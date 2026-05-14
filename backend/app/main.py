from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.memory import ConversationMemory
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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    memory = ConversationMemory(max_messages=settings.max_history_messages)
    app.state.rag_service = RAGService(settings=settings, memory=memory)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest, request: Request) -> ChatResponse:
    result = request.app.state.rag_service.chat(
        question=payload.question,
        session_id=payload.session_id,
    )
    return ChatResponse(**result)

