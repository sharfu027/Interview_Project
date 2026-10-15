import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "InterviewOS AI Intelligence Service"
    API_V1_STR: str = "/api/v1"
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # AI Providers Configuration
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "mock") # mock, openai, gemini, anthropic
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")

    # STT Provider Configuration
    STT_PROVIDER: str = os.getenv("STT_PROVIDER", "mock") # mock, whisper, deepgram

    # Security & CORS
    BACKEND_SECRET_KEY: str = os.getenv("BACKEND_SECRET_KEY", "interviewos-internal-secret-token")
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:8080", "http://localhost:3000"]

    class Config:
        case_sensitive = True

settings = Settings()
