from __future__ import annotations

import argparse
import os
import re
from pathlib import Path

import chromadb
from chromadb.config import Settings as ChromaSettings
from sentence_transformers import SentenceTransformer

from app.config import get_settings


def semantic_chunk_profile(text: str, chunk_size: int = 500, overlap: int = 100) -> list[str]:
    """Chunk profile.txt by semantic sections (headers), then split large
    sections into smaller pieces with character-level overlap."""

    # Split on lines that look like section headers (lines that don't start with
    # whitespace or '-' and are followed by content lines).
    section_pattern = re.compile(r"^(?=[A-Z])", re.MULTILINE)
    raw_sections: list[str] = []
    lines = text.strip().splitlines()

    current_section_lines: list[str] = []
    for line in lines:
        stripped = line.strip()
        # Detect section headers: non-empty lines that start a new topic
        # Headers are lines like "Profile Summary", "Education", "Experience", etc.
        if (
            stripped
            and not stripped.startswith("-")
            and not stripped.startswith("*")
            and not stripped[0].isdigit()
            and not line.startswith("  ")
            and not line.startswith("\t")
            and current_section_lines
        ):
            raw_sections.append("\n".join(current_section_lines).strip())
            current_section_lines = [line]
        else:
            current_section_lines.append(line)

    if current_section_lines:
        raw_sections.append("\n".join(current_section_lines).strip())

    # Now split each section into chunks respecting chunk_size
    chunks: list[str] = []
    for section in raw_sections:
        section = section.strip()
        if not section:
            continue

        if len(section) <= chunk_size:
            chunks.append(section)
        else:
            # Split section into overlapping character-level chunks
            start = 0
            while start < len(section):
                end = min(start + chunk_size, len(section))
                chunk = section[start:end].strip()
                if chunk:
                    chunks.append(chunk)
                if end >= len(section):
                    break
                start = end - overlap

    # Deduplicate any identical chunks
    seen = set()
    deduped: list[str] = []
    for chunk in chunks:
        if chunk not in seen:
            seen.add(chunk)
            deduped.append(chunk)

    return deduped


def ingest_profile(profile_path: Path) -> None:
    if not profile_path.exists():
        raise FileNotFoundError(f"profile file not found: {profile_path}")

    raw_text = profile_path.read_text(encoding="utf-8").strip()
    if not raw_text:
        raise ValueError("profile.txt is empty")

    settings = get_settings()

    # Use the resolved absolute path
    chroma_path = settings.resolved_chroma_path
    print(f"[Ingest] ChromaDB path: {chroma_path}")
    print(f"[Ingest] Embedding model: {settings.embedding_model}")
    print(f"[Ingest] Collection name: {settings.chroma_collection}")

    embedder = SentenceTransformer(settings.embedding_model)
    chunks = semantic_chunk_profile(raw_text, chunk_size=500, overlap=100)

    print(f"[Ingest] Created {len(chunks)} chunks from profile")
    for i, chunk in enumerate(chunks):
        preview = (chunk[:120] + "...") if len(chunk) > 120 else chunk
        print(f"[Ingest]   Chunk {i}: ({len(chunk)} chars) {preview}")

    embeddings = embedder.encode(chunks, normalize_embeddings=True).tolist()

    chroma = chromadb.PersistentClient(
        path=chroma_path,
        settings=ChromaSettings(anonymized_telemetry=settings.chroma_anonymized_telemetry),
    )
    collection = chroma.get_or_create_collection(
        name=settings.chroma_collection,
        metadata={"hnsw:space": "cosine"},
    )

    # Clear existing profile documents
    existing = collection.get(where={"source": profile_path.name}, include=[])
    existing_ids = existing.get("ids", [])
    if existing_ids:
        print(f"[Ingest] Deleting {len(existing_ids)} existing chunks")
        collection.delete(ids=existing_ids)

    ids = [f"profile-{index}" for index in range(len(chunks))]
    metadatas = [{"source": profile_path.name, "chunk_index": index} for index in range(len(chunks))]

    collection.upsert(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    print(f"\n[Ingest] ✓ Ingested {len(chunks)} chunks into collection '{settings.chroma_collection}'.")
    print(f"[Ingest] Total documents in collection: {collection.count()}")

    # Verification: run some test queries
    print("\n[Ingest] === Verification Queries ===")
    test_queries = [
        "What technologies does Harsh use?",
        "Tell me about RiskLens",
        "What projects has Harsh built?",
        "What is Harsh's education?",
        "What is Harsh's experience?",
        "What is Harsh's GitHub?",
    ]
    for query in test_queries:
        query_embedding = embedder.encode(query, normalize_embeddings=True).tolist()
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=3,
            include=["documents", "distances"],
        )
        docs = results["documents"][0] if results["documents"] else []
        dists = results["distances"][0] if results["distances"] else []
        print(f"\n  Query: '{query}'")
        for i, (doc, dist) in enumerate(zip(docs, dists)):
            preview = (doc[:100] + "...") if len(doc) > 100 else doc
            print(f"    [{i}] distance={dist:.4f}: {preview}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Ingest profile.txt into ChromaDB.")
    parser.add_argument(
        "--profile",
        type=str,
        default=None,
        help="Path to profile text file (defaults to backend/profile.txt).",
    )
    return parser.parse_args()


if __name__ == "__main__":
    arguments = parse_args()
    if arguments.profile:
        profile_file = Path(arguments.profile).resolve()
    else:
        # Default to profile.txt in the same directory as this script
        profile_file = Path(__file__).resolve().parent / "profile.txt"
    ingest_profile(profile_file)
