from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.endpoints import router as api_v1_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Dedicated AI and Media Processing Backend for InterviewOS Platform",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1_router, prefix=f"{settings.API_V1_STR}/ai", tags=["AI Engine"])

@app.get("/health", tags=["Operational"])
async def health_check():
    return {
        "status": "HEALTHY",
        "service": settings.PROJECT_NAME,
        "llm_provider": settings.LLM_PROVIDER,
        "stt_provider": settings.STT_PROVIDER
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
