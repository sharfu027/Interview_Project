import json
from typing import Dict, Any
from app.providers.base import BaseLLMProvider, BaseSTTProvider

class MockLLMProvider(BaseLLMProvider):
    async def generate_completion(self, prompt: str, system_prompt: str = "", temperature: float = 0.2) -> str:
        # Returns structured JSON corresponding to the requested schema
        prompt_lower = prompt.lower()
        if "resume" in prompt_lower or "ats" in prompt_lower:
            return json.dumps({
                "ats_score": 88.5,
                "summary": "Experienced software engineer with expertise in distributed microservices and clean architecture.",
                "extracted_skills": [
                    {"name": "Java", "category": "TECHNICAL", "proficiency": "ADVANCED", "years": 5.0},
                    {"name": "Spring Boot", "category": "FRAMEWORK", "proficiency": "ADVANCED", "years": 4.5},
                    {"name": "React", "category": "FRAMEWORK", "proficiency": "INTERMEDIATE", "years": 3.0},
                    {"name": "PostgreSQL", "category": "DATABASE", "proficiency": "ADVANCED", "years": 4.0}
                ],
                "strengths": ["Strong action verbs", "Clear technical metrics", "Quantifiable business impact"],
                "missing_critical_skills": ["Kafka idempotency", "Virtual threads in Java 21"],
                "bullet_improvements": ["Expand on database indexing tuning", "Specify concurrency lock primitives used"],
                "rubric_evaluation": {"keyword_match": 8.8, "quantifiable_impact": 8.5, "format_simplicity": 9.2}
            })
        elif "evaluate" in prompt_lower or "answer" in prompt_lower:
            return json.dumps({
                "overall_score": 8.6,
                "criterion_scores": [
                    {"criterion": "TECHNICAL_CORRECTNESS", "score": 8.8, "max_score": 10.0, "notes": "Accurate mechanics and correct terminology."},
                    {"criterion": "REASONING", "score": 8.5, "max_score": 10.0, "notes": "Clear problem breakdown."},
                    {"criterion": "COMMUNICATION", "score": 8.5, "max_score": 10.0, "notes": "Structured phrasing."},
                    {"criterion": "TRADE_OFFS", "score": 8.6, "max_score": 10.0, "notes": "Acknowledged lock contention and latency."}
                ],
                "strengths": ["Highlighted memory visibility guarantees", "Clear explanation of thread safety"],
                "concrete_improvement": "Specify how you monitor connection pool saturation in production under spike load.",
                "sample_ideal_response": "In our distributed order gateway, we implemented a bounded queue with StampedLock and Prometheus alerts when queue depth exceeded 80% capacity."
            })
        else:
            return json.dumps({"status": "ok", "message": "Processed successfully"})

class MockSTTProvider(BaseSTTProvider):
    async def transcribe_audio(self, audio_bytes: bytes, language: str = "en-US") -> Dict[str, Any]:
        return {
            "full_text": "In our microservices architecture, we utilized Java with Spring Boot and PostgreSQL, ensuring idempotent processing through unique transactional keys.",
            "duration_seconds": 12.5,
            "words_per_minute": 134.4,
            "confidence": 0.965,
            "segments": [
                {"start": 0.0, "end": 4.2, "text": "In our microservices architecture,"},
                {"start": 4.3, "end": 12.5, "text": "we utilized Java with Spring Boot and PostgreSQL, ensuring idempotent processing."}
            ]
        }
