from __future__ import annotations

from dataclasses import dataclass

import chromadb
from chromadb.config import Settings as ChromaSettings
from groq import Groq
from sentence_transformers import SentenceTransformer

from app.config import Settings

UNKNOWN_RESPONSE = "I don't have information about that yet."

SYSTEM_PROMPT = """You are Harsh Johiya's AI portfolio assistant.

Answer strictly from the retrieved context.
Do not invent project details, skills, achievements, dates, links, technologies, or experience.
If the answer is not explicitly available in context, reply exactly:
I don't have information about that yet.

Keep responses concise, technical, professional, and structured."""


@dataclass(frozen=True)
class RetrievedChunk:
    id: str
    source: str
    chunk_index: int
    document: str
    distance: float | None


class RAGService:
    def __init__(self, settings: Settings) -> None:
        if not settings.groq_api_key:
            raise RuntimeError("GROQ_API_KEY is required.")

        self.settings = settings
        self.groq = Groq(api_key=settings.groq_api_key)
        self.embedder = SentenceTransformer(settings.embedding_model)
        self.chroma = chromadb.PersistentClient(
            path=settings.chroma_path,
            settings=ChromaSettings(anonymized_telemetry=settings.chroma_anonymized_telemetry),
        )
        self.collection = self.chroma.get_or_create_collection(
            name=settings.chroma_collection,
            metadata={"hnsw:space": "cosine"},
        )

    def _format_history(self, messages: list[dict[str, str]]) -> str:
        if not messages:
            return "No previous conversation."
        return "\n".join(f"{message['role']}: {message['content']}" for message in messages)

    def _normalize_history(self, history: list[dict[str, str]] | None) -> list[dict[str, str]]:
        if not history:
            return []

        normalized: list[dict[str, str]] = []
        for message in history[-self.settings.max_history_messages :]:
            role = str(message.get("role", "")).strip().lower()
            content = str(message.get("content", "")).strip()
            if role in {"user", "assistant"} and content:
                normalized.append({"role": role, "content": content[:4000]})
        return normalized

    def _format_context(self, chunks: list[RetrievedChunk]) -> str:
        context_blocks = []
        for index, chunk in enumerate(chunks, start=1):
            context_blocks.append(
                f"[Context {index} | source={chunk.source} | chunk={chunk.chunk_index}]\n{chunk.document}"
            )
        context = "\n\n".join(context_blocks)
        return context[: self.settings.max_context_chars]

    def retrieve(self, query: str) -> list[RetrievedChunk]:
        query_embedding = self.embedder.encode(query, normalize_embeddings=True).tolist()
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=self.settings.top_k,
            include=["documents", "metadatas", "distances"],
        )

        ids = results.get("ids", [[]])[0]
        documents = results.get("documents", [[]])[0]
        metadatas = results.get("metadatas", [[]])[0]
        distances = results.get("distances", [[]])[0]

        chunks: list[RetrievedChunk] = []
        for item_id, document, metadata, distance in zip(ids, documents, metadatas, distances):
            if not document:
                continue
            if distance is not None and float(distance) > self.settings.similarity_threshold:
                continue

            source = str((metadata or {}).get("source", "profile.txt"))
            chunk_index = int((metadata or {}).get("chunk_index", -1))
            chunks.append(
                RetrievedChunk(
                    id=str(item_id),
                    source=source,
                    chunk_index=chunk_index,
                    document=document,
                    distance=float(distance) if distance is not None else None,
                )
            )

        return chunks

    def _grounding_check(self, context: str, answer: str) -> bool:
        if answer.strip() == UNKNOWN_RESPONSE:
            return True

        verification_messages = [
            {
                "role": "system",
                "content": "You verify grounding. Reply with only YES or NO.",
            },
            {
                "role": "user",
                "content": (
                    "Determine whether every factual claim in the answer is directly supported "
                    "by the context.\n\n"
                    f"Context:\n{context}\n\nAnswer:\n{answer}"
                ),
            },
        ]

        verdict = self.groq.chat.completions.create(
            model=self.settings.groq_model,
            messages=verification_messages,
            temperature=0,
            max_tokens=3,
        )
        result = (verdict.choices[0].message.content or "").strip().upper()
        return result.startswith("YES")

    def chat(self, question: str, history: list[dict[str, str]] | None = None) -> dict:
        clean_question = question.strip()
        if not clean_question:
            raise ValueError("question must not be empty")

        history_messages = self._normalize_history(history)
        chunks = self.retrieve(clean_question)

        if not chunks:
            answer = UNKNOWN_RESPONSE
            return {"answer": answer}

        context = self._format_context(chunks)
        history_text = self._format_history(history_messages)
        user_payload = (
            f"Retrieved Context:\n{context}\n\n"
            f"Conversation History:\n{history_text}\n\n"
            f"User Question:\n{clean_question}\n\n"
            "Rules:\n"
            "- Use only retrieved context.\n"
            f"- If information is unavailable, respond exactly: {UNKNOWN_RESPONSE}"
        )

        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        messages.extend(history_messages)
        messages.append({"role": "user", "content": user_payload})

        completion = self.groq.chat.completions.create(
            model=self.settings.groq_model,
            messages=messages,
            temperature=0.1,
            max_tokens=600,
        )
        answer = (completion.choices[0].message.content or "").strip() or UNKNOWN_RESPONSE

        if not self._grounding_check(context=context, answer=answer):
            answer = UNKNOWN_RESPONSE

        return {"answer": answer}

