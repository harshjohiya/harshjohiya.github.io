import sys
import os

sys.path.insert(0, ".")

from app.config import get_settings
from app.rag import RAGService

s = get_settings()
rag = RAGService(settings=s)

queries_to_test = [
    "how much experience does harsh have",
    "What technologies does Harsh use?",
    "Tell me about RiskLens",
    "What projects has Harsh built?",
]

output_lines = []

for q in queries_to_test:
    output_lines.append("=" * 60)
    output_lines.append(f"QUESTION: {q}")
    output_lines.append("=" * 60)
    
    chunks = rag.retrieve(q)
    output_lines.append(f"CHUNKS: {len(chunks)}")
    for i, c in enumerate(chunks):
        output_lines.append(f"  [{i}] id={c.id} dist={c.distance:.4f}: {c.document[:150]}")
    
    result = rag.chat(q)
    output_lines.append(f"\nANSWER:\n{result['answer']}")
    output_lines.append("")

with open("test_result_clean.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(output_lines))

print("Done - see test_result_clean.txt")
