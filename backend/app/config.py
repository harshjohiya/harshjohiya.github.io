from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    groq_api_key: str = Field(default="")
    groq_model: str = Field(default="llama-3.3-70b-versatile")

    chroma_path: str = Field(default="./chroma_db")
    chroma_collection: str = Field(default="portfolio_profile")
    chroma_anonymized_telemetry: bool = Field(default=False)

    embedding_model: str = Field(default="sentence-transformers/all-MiniLM-L6-v2")
    top_k: int = Field(default=4, ge=1, le=20)
    similarity_threshold: float = Field(default=0.65, ge=0.0, le=2.0)
    max_context_chars: int = Field(default=7000, ge=1000, le=20000)

    max_history_messages: int = Field(default=12, ge=2, le=50)
    cors_origins: str = Field(
        default=(
            "http://localhost:5173,http://127.0.0.1:5173,"
            "http://localhost:8080,http://127.0.0.1:8080"
        )
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()

