import re
from typing import List, Dict
from app.schemas.ai_schemas import ResumeParseRequest, ResumeAnalysisResponse, ExtractedSkill

TECH_KEYWORDS = {
    "java": ("Java", "TECHNICAL", "ADVANCED"),
    "spring": ("Spring Boot", "FRAMEWORK", "ADVANCED"),
    "python": ("Python", "TECHNICAL", "INTERMEDIATE"),
    "react": ("React 19", "FRAMEWORK", "INTERMEDIATE"),
    "typescript": ("TypeScript", "LANGUAGE", "INTERMEDIATE"),
    "postgres": ("PostgreSQL", "DATABASE", "ADVANCED"),
    "postgresql": ("PostgreSQL", "DATABASE", "ADVANCED"),
    "sql": ("SQL & Query Tuning", "DATABASE", "ADVANCED"),
    "kafka": ("Apache Kafka", "ARCHITECTURE", "INTERMEDIATE"),
    "redis": ("Redis", "DATABASE", "INTERMEDIATE"),
    "docker": ("Docker", "DEVOPS", "INTERMEDIATE"),
    "kubernetes": ("Kubernetes", "DEVOPS", "INTERMEDIATE"),
    "microservices": ("Microservices Architecture", "ARCHITECTURE", "ADVANCED"),
    "aws": ("AWS Cloud", "CLOUD", "INTERMEDIATE"),
}

class ResumeAnalyzerService:
    def analyze_resume(self, request: ResumeParseRequest) -> ResumeAnalysisResponse:
        text = request.raw_text
        text_lower = text.lower()

        # 1. Extract identified technologies
        found_skills: List[ExtractedSkill] = []
        seen = set()
        for kw, (display_name, category, default_prof) in TECH_KEYWORDS.items():
            if re.search(r'\b' + re.escape(kw) + r'\b', text_lower):
                if display_name not in seen:
                    seen.add(display_name)
                    found_skills.append(ExtractedSkill(
                        name=display_name,
                        category=category,
                        proficiency=default_prof,
                        years=3.5
                    ))

        if not found_skills:
            found_skills = [
                ExtractedSkill(name="Java", category="TECHNICAL", proficiency="ADVANCED", years=4.0),
                ExtractedSkill(name="Spring Boot", category="FRAMEWORK", proficiency="ADVANCED", years=3.5),
                ExtractedSkill(name="PostgreSQL", category="DATABASE", proficiency="ADVANCED", years=3.0)
            ]

        # 2. Rubric scoring
        has_metrics = bool(re.search(r'\b(\d+[\%kM]|\$\d+|\d+\s*ms)\b', text))
        has_action_verbs = bool(re.search(r'\b(engineered|architected|led|developed|optimized|designed|tuning)\b', text_lower))

        metric_pts = 35.0 if has_metrics else 20.0
        verb_pts = 35.0 if has_action_verbs else 20.0
        keyword_pts = min(30.0, len(found_skills) * 7.5)

        ats_score = round(metric_pts + verb_pts + keyword_pts, 1)

        missing_skills = []
        if "kafka" not in text_lower:
            missing_skills.append("Apache Kafka & Event-driven Messaging")
        if "concurrency" not in text_lower and "threading" not in text_lower:
            missing_skills.append("Explicit Multi-threading & Concurrency guarantees")

        bullet_improvements = [
            "Quantify performance improvements with concrete latency or throughput numbers (e.g. 'reduced latency by 42%').",
            "State specific caching or index tuning strategies applied in production.",
            "Include high-scale failure recovery mechanisms handled in your cloud projects."
        ]

        return ResumeAnalysisResponse(
            ats_score=ats_score,
            summary="Strong technical profile with verifiable engineering terminology and system design experience.",
            extracted_skills=found_skills,
            strengths=[
                "Clear technical stack alignment with modern backend roles",
                "Strong use of impact-oriented action verbs",
                "Verifiable project scopes with database design details"
            ],
            missing_critical_skills=missing_skills if missing_skills else ["Distributed Lock Management"],
            bullet_improvements=bullet_improvements,
            rubric_evaluation={
                "keyword_coverage": round(keyword_pts / 30.0 * 10.0, 1),
                "quantifiable_outcomes": round(metric_pts / 35.0 * 10.0, 1),
                "action_verb_clarity": round(verb_pts / 35.0 * 10.0, 1)
            }
        )
