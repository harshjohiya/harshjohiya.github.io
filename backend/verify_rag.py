"""Quick verification that the RAG pipeline works end-to-end."""
import os
import sys

# Ensure we can import app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.config import get_settings
import chromadb
from chromadb.config import Settings as ChromaSettings
from sentence_transformers import SentenceTransformer

settings = get_settings()
chroma_path = settings.resolved_chroma_path

print(f"=== RAG Verification ===")
print(f"ChromaDB path: {chroma_path}")
print(f"Path exists: {os.path.exists(chroma_path)}")
print(f"Collection: {settings.chroma_collection}")
print(f"Embedding model: {settings.embedding_model}")
print()

client = chromadb.PersistentClient(
    path=chroma_path,
    settings=ChromaSettings(anonymized_telemetry=False),
)

collection = client.get_or_create_collection(
    name=settings.chroma_collection,
    metadata={"hnsw:space": "cosine"},
)

doc_count = collection.count()
print(f"Total documents in collection: {doc_count}")

if doc_count == 0:
    print("ERROR: Collection is EMPTY! Run ingest.py first.")
    sys.exit(1)

# Show all documents
all_docs = collection.get(include=["documents", "metadatas"])
print(f"\nAll document IDs: {all_docs['ids']}")
for i, (doc_id, doc, meta) in enumerate(zip(all_docs['ids'], all_docs['documents'], all_docs['metadatas'])):
    preview = (doc[:150] + "...") if len(doc) > 150 else doc
    print(f"\n  [{doc_id}] meta={meta}")
    print(f"    {preview}")

# Run test queries
embedder = SentenceTransformer(settings.embedding_model)

test_queries = [
    "What technologies does Harsh use?",
    "Tell me about RiskLens",
    "What projects has Harsh built?",
    "What is Harsh's education?",
    "What is Harsh's experience?",
    "What is Harsh's GitHub?",
]

print(f"\n\n=== Test Queries ===")
for query in test_queries:
    query_emb = embedder.encode(query, normalize_embeddings=True).tolist()
    results = collection.query(
        query_embeddings=[query_emb],
        n_results=5,
        include=["documents", "distances"],
    )
    docs = results["documents"][0] if results["documents"] else []
    dists = results["distances"][0] if results["distances"] else []
    
    print(f"\nQuery: '{query}'")
    print(f"  Results: {len(docs)}")
    for j, (d, dist) in enumerate(zip(docs, dists)):
        preview = (d[:120] + "...") if len(d) > 120 else d
        passed = "PASS" if dist <= settings.similarity_threshold else "FAIL"
        print(f"  [{j}] {passed} dist={dist:.4f}: {preview}")

print(f"\n=== Verification Complete ===")
print(f"Similarity threshold: {settings.similarity_threshold}")
