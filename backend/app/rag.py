from __future__ import annotations

import os
from dataclasses import dataclass

import chromadb
from chromadb.config import Settings as ChromaSettings
from groq import Groq
from sentence_transformers import SentenceTransformer

from app.config import Settings

UNKNOWN_RESPONSE = (
    "That information isn't available in Harsh's portfolio knowledge base. "
    "I can help you explore: his **projects** (RiskLens, DeepTrust, HindiASR, Food Delivery Prediction), "
    "**technical skills** (Python, PyTorch, FastAPI, React), "
    "**experience** (AI Intern at Baseraa, WorldQuant), "
    "**AI/ML work** (deep learning, computer vision, NLP), or "
    "**education** (BS Engineering Science at IISER Bhopal). "
    "What would you like to know?"
)

SYSTEM_PROMPT = """You are Harsh Johiya's AI portfolio assistant.

Answer strictly from the retrieved context. Do not invent or guess any details \u2014 no project names, skills, dates, links, technologies, or experience that are not explicitly in the context.

If the requested information is NOT available in the retrieved context:
1. Clearly state the information is not available in Harsh's portfolio knowledge base.
2. Do NOT invent or guess anything.
3. Guide the user toward related topics they can ask about:
   - Projects: RiskLens, DeepTrust, HindiASR, Food Delivery Time Prediction
   - Technical skills: Python, PyTorch, FastAPI, React, TypeScript, scikit-learn
   - Experience: AI Intern at Baseraa, Quantitative Research Consultant at WorldQuant
   - AI/ML work: deep learning, computer vision, NLP, model fine-tuning
   - FastAPI and React full-stack applications
   - Education: BS Engineering Science at IISER Bhopal

Keep responses concise, technical, professional, and structured."""

QUERY_EXPANSION_PROMPT = """You are a search query expansion assistant for a personal portfolio/resume knowledge base.

The knowledge base has these EXACT section headers:
- Profile Summary
- About
- Education
- Experience
- Technical Skills
- Featured Projects

Given a user's question, generate 5 search queries. ALWAYS include:
1. The most relevant EXACT section header (e.g., "Experience", "Technical Skills")
2. Specific entity names (e.g., "Baseraa", "WorldQuant", "RiskLens")
3. Different phrasings of the same intent
4. Keywords that appear literally in a resume (e.g., "intern", "consultant", "worked at")
5. A direct keyword match

Return ONLY 5 queries, one per line, no numbering, no explanation."""


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

        chroma_path = settings.resolved_chroma_path
        print(f"[RAG] ChromaDB path: {chroma_path}")
        print(f"[RAG] ChromaDB path exists: {os.path.exists(chroma_path)}")
        print(f"[RAG] Embedding model: {settings.embedding_model}")
        print(f"[RAG] Collection name: {settings.chroma_collection}")

        self.chroma = chromadb.PersistentClient(
            path=chroma_path,
            settings=ChromaSettings(anonymized_telemetry=settings.chroma_anonymized_telemetry),
        )
        self.collection = self.chroma.get_or_create_collection(
            name=settings.chroma_collection,
            metadata={"hnsw:space": "cosine"},
        )

        doc_count = self.collection.count()
        print(f"[RAG] Collection '{settings.chroma_collection}' has {doc_count} documents")

        if doc_count > 0:
            sample = self.collection.peek(limit=2)
            print(f"[RAG] Sample document IDs: {sample.get('ids', [])}")
            sample_docs = sample.get("documents", [])
            if sample_docs:
                for i, doc in enumerate(sample_docs):
                    preview = (doc[:120] + "...") if len(doc) > 120 else doc
                    print(f"[RAG] Sample doc {i}: {preview}")

    # ------------------------------------------------------------------
    # Query expansion (Multi-Query RAG)
    # ------------------------------------------------------------------

    def _expand_query(self, question: str) -> list[str]:
        """Use the LLM to generate alternative phrasings of the question."""
        try:
            response = self.groq.chat.completions.create(
                model=self.settings.groq_model,
                messages=[
                    {"role": "system", "content": QUERY_EXPANSION_PROMPT},
                    {"role": "user", "content": f"Original question: {question}"},
                ],
                temperature=0.4,
                max_tokens=200,
            )
            raw = (response.choices[0].message.content or "").strip()
            variants = [line.strip() for line in raw.splitlines() if line.strip()]
            # Always include the original question
            all_queries = [question] + variants[:5]
            print(f"[RAG] Query expansion - original + {len(variants)} variants:")
            for q in all_queries:
                print(f"[RAG]   -> {q}")
            return all_queries
        except Exception as exc:
            print(f"[RAG] Query expansion failed ({exc}), using original only")
            return [question]

    # ------------------------------------------------------------------
    # Low-level single-query retrieval (embedding-based)
    # ------------------------------------------------------------------

    def _retrieve_by_embedding(self, query: str) -> dict[str, RetrievedChunk]:
        """Retrieve chunks via embedding similarity."""
        query_embedding = self.embedder.encode(query, normalize_embeddings=True).tolist()
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=self.settings.top_k,
            include=["documents", "metadatas", "distances"],
        )

        ids = results["ids"][0] if results["ids"] else []
        documents = results["documents"][0] if results["documents"] else []
        metadatas = results["metadatas"][0] if results["metadatas"] else []
        distances = results["distances"][0] if results["distances"] else []

        chunks: dict[str, RetrievedChunk] = {}
        for item_id, document, metadata, distance in zip(ids, documents, metadatas, distances):
            if not document:
                continue
            dist = float(distance) if distance is not None else 99.0
            is_close_enough = dist <= self.settings.similarity_threshold
            has_keyword = any(
                kw in document.lower()
                for kw in ["experience", "intern", "worldquant", "baseraa", "work", "consultant"]
            )
            if not is_close_enough and not has_keyword:
                continue
            source = str((metadata or {}).get("source", "profile.txt"))
            chunk_index = int((metadata or {}).get("chunk_index", -1))
            chunks[str(item_id)] = RetrievedChunk(
                id=str(item_id),
                source=source,
                chunk_index=chunk_index,
                document=document,
                distance=dist,
            )
        return chunks

    # ------------------------------------------------------------------
    # Keyword/full-text retrieval using query_texts
    # ------------------------------------------------------------------

    def _retrieve_by_text(self, query: str) -> dict[str, RetrievedChunk]:
        """Retrieve chunks via ChromaDB's built-in full-text search."""
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=self.settings.top_k,
                include=["documents", "metadatas", "distances"],
            )

            ids = results["ids"][0] if results["ids"] else []
            documents = results["documents"][0] if results["documents"] else []
            metadatas = results["metadatas"][0] if results["metadatas"] else []
            distances = results["distances"][0] if results["distances"] else []

            chunks: dict[str, RetrievedChunk] = {}
            for item_id, document, metadata, distance in zip(ids, documents, metadatas, distances):
                if not document:
                    continue
                dist = float(distance) if distance is not None else 99.0
                is_close_enough = dist <= self.settings.similarity_threshold
                has_keyword = any(
                    kw in document.lower()
                    for kw in ["experience", "intern", "worldquant", "baseraa", "work", "consultant"]
                )
                if not is_close_enough and not has_keyword:
                    continue
                source = str((metadata or {}).get("source", "profile.txt"))
                chunk_index = int((metadata or {}).get("chunk_index", -1))
                chunks[str(item_id)] = RetrievedChunk(
                    id=str(item_id),
                    source=source,
                    chunk_index=chunk_index,
                    document=document,
                    distance=dist,
                )
            return chunks
        except Exception as exc:
            print(f"[RAG] Text search failed ({exc}), returning empty")
            return {}

    # ------------------------------------------------------------------
    # Multi-query retrieval with hybrid search and deduplication
    # ------------------------------------------------------------------

    def retrieve(self, question: str) -> list[RetrievedChunk]:
        """
        1. Expand question into multiple variants via LLM
        2. For each variant, run BOTH embedding search AND text search
        3. Deduplicate by chunk ID, keep best (lowest) distance
        4. Return sorted by distance ascending
        """
        queries = self._expand_query(question)

        # Merge: keep best distance per chunk ID across all queries + methods
        merged: dict[str, RetrievedChunk] = {}

        def _merge(hits: dict[str, RetrievedChunk]) -> None:
            for chunk_id, chunk in hits.items():
                if chunk_id not in merged:
                    merged[chunk_id] = chunk
                else:
                    existing = merged[chunk_id]
                    if (chunk.distance is not None and existing.distance is not None
                            and chunk.distance < existing.distance):
                        merged[chunk_id] = chunk

        for query in queries:
            # Embedding-based search
            _merge(self._retrieve_by_embedding(query))
            # Full-text / keyword search
            _merge(self._retrieve_by_text(query))

        # Sort by distance ascending (most relevant first)
        ranked = sorted(
            merged.values(),
            key=lambda c: c.distance if c.distance is not None else 99.0,
        )

        print(f"[RAG] Hybrid multi-query: {len(ranked)} unique chunks from {len(queries)} queries")
        for i, chunk in enumerate(ranked):
            preview = (chunk.document[:100] + "...") if len(chunk.document) > 100 else chunk.document
            print(f"[RAG]   [{i}] id={chunk.id} dist={chunk.distance:.4f}: {preview}")

        return ranked

    # ------------------------------------------------------------------
    # Formatting helpers
    # ------------------------------------------------------------------

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

    # ------------------------------------------------------------------
    # Main chat entrypoint
    # ------------------------------------------------------------------

    def chat(self, question: str, history: list[dict[str, str]] | None = None) -> dict:
        clean_question = question.strip()
        if not clean_question:
            raise ValueError("question must not be empty")

        history_messages = self._normalize_history(history)
        chunks = self.retrieve(clean_question)

        if not chunks:
            print(f"[RAG] No chunks retrieved for: '{clean_question}'")
            return {"answer": UNKNOWN_RESPONSE}

        context = self._format_context(chunks)
        history_text = self._format_history(history_messages)

        print(f"[RAG] Context sent to LLM ({len(context)} chars)")

        user_payload = (
            f"Retrieved Context:\n{context}\n\n"
            f"Conversation History:\n{history_text}\n\n"
            f"User Question:\n{clean_question}\n\n"
            "Rules:\n"
            "- Answer using ONLY the retrieved context above.\n"
            "- Do NOT invent or guess any facts.\n"
            "- If the answer is not in the context, clearly say so and guide the user "
            "toward what you CAN answer: projects, skills, experience, AI/ML work, education."
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

        return {"answer": answer}
