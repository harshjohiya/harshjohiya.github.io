from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=4000)
    session_id: str | None = Field(default=None, max_length=128)


class SourceChunk(BaseModel):
    id: str
    source: str
    chunk_index: int
    distance: float | None = None


class ChatResponse(BaseModel):
    answer: str
    session_id: str
    sources: list[SourceChunk] = Field(default_factory=list)

