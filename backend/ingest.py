from __future__ import annotations

import argparse
from pathlib import Path

import chromadb
from sentence_transformers import SentenceTransformer

from app.config import get_settings


def chunk_text(text: str, chunk_size_words: int = 180, overlap_words: int = 40) -> list[str]:
    words = text.split()
    if not words:
        return []

    chunks: list[str] = []
    start = 0
    while start < len(words):
        end = min(start + chunk_size_words, len(words))
        chunk = " ".join(words[start:end]).strip()
        if chunk:
            chunks.append(chunk)
        if end == len(words):
            break
        start = max(0, end - overlap_words)

    return chunks


def ingest_profile(profile_path: Path) -> None:
    if not profile_path.exists():
        raise FileNotFoundError(f"profile file not found: {profile_path}")

    raw_text = profile_path.read_text(encoding="utf-8").strip()
    if not raw_text:
        raise ValueError("profile.txt is empty")

    settings = get_settings()
    embedder = SentenceTransformer(settings.embedding_model)
    chunks = chunk_text(raw_text)
    embeddings = embedder.encode(chunks, normalize_embeddings=True).tolist()

    chroma = chromadb.PersistentClient(path=settings.chroma_path)
    collection = chroma.get_or_create_collection(
        name=settings.chroma_collection,
        metadata={"hnsw:space": "cosine"},
    )

    existing = collection.get(where={"source": profile_path.name}, include=[])
    existing_ids = existing.get("ids", [])
    if existing_ids:
        collection.delete(ids=existing_ids)

    ids = [f"profile-{index}" for index in range(len(chunks))]
    metadatas = [{"source": profile_path.name, "chunk_index": index} for index in range(len(chunks))]

    collection.upsert(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    print(f"Ingested {len(chunks)} chunks into collection '{settings.chroma_collection}'.")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Ingest profile.txt into ChromaDB.")
    parser.add_argument(
        "--profile",
        type=str,
        default="profile.txt",
        help="Path to profile text file.",
    )
    return parser.parse_args()


if __name__ == "__main__":
    arguments = parse_args()
    ingest_profile(Path(arguments.profile).resolve())

