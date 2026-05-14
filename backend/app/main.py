from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.rag import RAGService
from app.schemas import ChatRequest, ChatResponse

settings = get_settings()

app = FastAPI(
    title="Harsh Portfolio Chatbot API",
    version="1.0.0",
    description="FastAPI backend for portfolio chatbot with Groq + ChromaDB RAG.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    app.state.rag_service = RAGService(settings=settings)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest, request: Request) -> ChatResponse:
    result = request.app.state.rag_service.chat(
        question=payload.question,
        history=[message.model_dump() for message in payload.history],
    )
    return ChatResponse(**result)

