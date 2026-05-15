from functools import lru_cache
import os
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    groq_api_key: str = Field(default="")
    groq_model: str = Field(default="llama-3.3-70b-versatile")

    chroma_path: str = Field(default="")
    chroma_collection: str = Field(default="portfolio_profile")
    chroma_anonymized_telemetry: bool = Field(default=False)

    embedding_model: str = Field(default="sentence-transformers/all-MiniLM-L6-v2")
    top_k: int = Field(default=5, ge=1, le=20)
    similarity_threshold: float = Field(default=1.2, ge=0.0, le=2.0)
    max_context_chars: int = Field(default=7000, ge=1000, le=20000)

    max_history_messages: int = Field(default=12, ge=2, le=50)
    cors_origins: str = Field(
        default=(
            "http://localhost:5173,http://127.0.0.1:5173,"
            "http://localhost:8080,http://127.0.0.1:8080"
        )
    )

    model_config = SettingsConfigDict(
        env_file=(str(BACKEND_DIR / ".env"), ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def resolved_chroma_path(self) -> str:
        """Always resolve chroma_path relative to the backend directory."""
        raw = self.chroma_path or os.path.join(str(BACKEND_DIR), "chroma_db")
        if os.path.isabs(raw):
            return raw
        return os.path.normpath(os.path.join(str(BACKEND_DIR), raw))

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
