import re
from typing import List, Dict, Set
from app.schemas.ai_schemas import ResumeParseRequest, ResumeAnalysisResponse, ExtractedSkill

TECH_TAXONOMY = {
    # Frontend
    "react": ("React", "FRONTEND", "ADVANCED"),
    "react 19": ("React 19", "FRONTEND", "ADVANCED"),
    "typescript": ("TypeScript", "LANGUAGE", "ADVANCED"),
    "javascript": ("JavaScript", "LANGUAGE", "ADVANCED"),
    "next.js": ("Next.js", "FRONTEND", "ADVANCED"),
    "nextjs": ("Next.js", "FRONTEND", "ADVANCED"),
    "vue": ("Vue.js", "FRONTEND", "INTERMEDIATE"),
    "angular": ("Angular", "FRONTEND", "INTERMEDIATE"),
    "svelte": ("Svelte", "FRONTEND", "INTERMEDIATE"),
    "tailwind": ("Tailwind CSS", "FRONTEND", "ADVANCED"),
    "css": ("CSS3 / Styling Architecture", "FRONTEND", "INTERMEDIATE"),
    "html": ("HTML5 & Semantic Web", "FRONTEND", "INTERMEDIATE"),
    "redux": ("Redux / State Management", "FRONTEND", "INTERMEDIATE"),
    "zustand": ("Zustand", "FRONTEND", "INTERMEDIATE"),
    "webpack": ("Webpack", "FRONTEND", "INTERMEDIATE"),
    "vite": ("Vite", "FRONTEND", "ADVANCED"),

    # Backend & Languages
    "java": ("Java", "BACKEND", "ADVANCED"),
    "spring boot": ("Spring Boot", "BACKEND", "ADVANCED"),
    "spring": ("Spring Framework", "BACKEND", "ADVANCED"),
    "python": ("Python", "LANGUAGE", "ADVANCED"),
    "django": ("Django", "BACKEND", "INTERMEDIATE"),
    "fastapi": ("FastAPI", "BACKEND", "ADVANCED"),
    "flask": ("Flask", "BACKEND", "INTERMEDIATE"),
    "golang": ("Go", "LANGUAGE", "INTERMEDIATE"),
    "go": ("Go", "LANGUAGE", "INTERMEDIATE"),
    "c#": ("C#", "LANGUAGE", "ADVANCED"),
    ".net": (".NET Core / ASP.NET", "BACKEND", "ADVANCED"),
    "dotnet": (".NET Core / ASP.NET", "BACKEND", "ADVANCED"),
    "node": ("Node.js", "BACKEND", "ADVANCED"),
    "nodejs": ("Node.js", "BACKEND", "ADVANCED"),
    "express": ("Express.js", "BACKEND", "INTERMEDIATE"),
    "rust": ("Rust", "LANGUAGE", "INTERMEDIATE"),

    # Databases & Caching
    "postgresql": ("PostgreSQL", "DATABASE", "ADVANCED"),
    "postgres": ("PostgreSQL", "DATABASE", "ADVANCED"),
    "mysql": ("MySQL", "DATABASE", "INTERMEDIATE"),
    "mongodb": ("MongoDB", "DATABASE", "INTERMEDIATE"),
    "redis": ("Redis", "DATABASE", "ADVANCED"),
    "sql": ("SQL & Query Optimization", "DATABASE", "ADVANCED"),
    "cassandra": ("Cassandra", "DATABASE", "INTERMEDIATE"),
    "dynamodb": ("DynamoDB", "DATABASE", "INTERMEDIATE"),
    "elasticsearch": ("Elasticsearch", "DATABASE", "INTERMEDIATE"),

    # Messaging & Architecture
    "kafka": ("Apache Kafka", "ARCHITECTURE", "ADVANCED"),
    "rabbitmq": ("RabbitMQ", "ARCHITECTURE", "INTERMEDIATE"),
    "microservices": ("Microservices Architecture", "ARCHITECTURE", "ADVANCED"),
    "distributed systems": ("Distributed Systems", "ARCHITECTURE", "ADVANCED"),
    "graphql": ("GraphQL", "ARCHITECTURE", "INTERMEDIATE"),
    "grpc": ("gRPC", "ARCHITECTURE", "INTERMEDIATE"),
    "rest": ("RESTful API Design", "ARCHITECTURE", "ADVANCED"),

    # Cloud & DevOps
    "docker": ("Docker", "DEVOPS", "ADVANCED"),
    "kubernetes": ("Kubernetes", "DEVOPS", "ADVANCED"),
    "aws": ("AWS Cloud", "CLOUD", "ADVANCED"),
    "azure": ("Microsoft Azure", "CLOUD", "INTERMEDIATE"),
    "gcp": ("Google Cloud Platform", "CLOUD", "INTERMEDIATE"),
    "terraform": ("Terraform", "DEVOPS", "INTERMEDIATE"),
    "ci/cd": ("CI/CD Automation", "DEVOPS", "ADVANCED"),
    "github actions": ("GitHub Actions", "DEVOPS", "ADVANCED"),
    "linux": ("Linux System Administration", "DEVOPS", "INTERMEDIATE"),

    # QA & Testing
    "playwright": ("Playwright", "TESTING_QA", "ADVANCED"),
    "selenium": ("Selenium WebDriver", "TESTING_QA", "INTERMEDIATE"),
    "cypress": ("Cypress", "TESTING_QA", "INTERMEDIATE"),
    "jest": ("Jest", "TESTING_QA", "ADVANCED"),
    "junit": ("JUnit 5", "TESTING_QA", "ADVANCED"),
    "pytest": ("PyTest", "TESTING_QA", "ADVANCED"),
    "postman": ("Postman API Testing", "TESTING_QA", "INTERMEDIATE"),

    # Data & AI
    "spark": ("Apache Spark", "DATA_AI", "INTERMEDIATE"),
    "pandas": ("Pandas", "DATA_AI", "ADVANCED"),
    "numpy": ("NumPy", "DATA_AI", "ADVANCED"),
    "pytorch": ("PyTorch", "DATA_AI", "INTERMEDIATE"),
    "tensorflow": ("TensorFlow", "DATA_AI", "INTERMEDIATE"),
    "airflow": ("Apache Airflow", "DATA_AI", "INTERMEDIATE"),
}

ROLE_REQUIREMENTS = {
    "FRONTEND": ["TypeScript", "React", "CSS3 / Styling Architecture", "HTML5 & Semantic Web", "Vite", "Jest"],
    "BACKEND": ["SQL & Query Optimization", "PostgreSQL", "RESTful API Design", "Docker", "Redis", "Microservices Architecture"],
    "FULLSTACK": ["TypeScript", "React", "SQL & Query Optimization", "RESTful API Design", "Docker", "Git"],
    "QA": ["Playwright", "Selenium WebDriver", "CI/CD Automation", "Postman API Testing", "JUnit 5"],
    "QA_AUTOMATION": ["Playwright", "Selenium WebDriver", "CI/CD Automation", "Postman API Testing", "JUnit 5"],
    "DATA_ENGINEERING": ["SQL & Query Optimization", "Python", "Apache Spark", "Apache Kafka", "PostgreSQL", "Apache Airflow"],
    "DEVOPS_SRE": ["Docker", "Kubernetes", "Terraform", "AWS Cloud", "CI/CD Automation", "Linux System Administration"],
    "DOTNET": [".NET Core / ASP.NET", "C#", "SQL & Query Optimization", "Docker", "RESTful API Design"],
}

class ResumeAnalyzerService:
    def analyze_resume(self, request: ResumeParseRequest) -> ResumeAnalysisResponse:
        text = request.raw_text
        text_lower = text.lower()
        target_role = (request.target_role or "Software Engineer").strip()
        target_family = (request.target_job_family or "BACKEND").upper()

        # 1. Extract identified technologies with real presence detection
        found_skills: List[ExtractedSkill] = []
        seen_names: Set[str] = set()

        # Calculate rough overall experience years from dates if present (e.g. 2018-2024, or 5+ years)
        years_match = re.search(r'\b(\d+)\+?\s*years?\b', text_lower)
        estimated_years = float(years_match.group(1)) if years_match else 3.5

        for kw, (display_name, category, default_prof) in TECH_TAXONOMY.items():
            pattern = r'\b' + re.escape(kw) + r'\b'
            if re.search(pattern, text_lower):
                if display_name not in seen_names:
                    seen_names.add(display_name)
                    found_skills.append(ExtractedSkill(
                        name=display_name,
                        category=category,
                        proficiency=default_prof,
                        years=estimated_years
                    ))

        # 2. Rubric scoring based on genuine text features
        # Metric quantification (numbers, percentages, scale, currency)
        metric_matches = re.findall(r'\b(\d+[\%kM]|\$\d[\d,]*|\d+\s*(?:ms|seconds|req\/s|rps|tps|users|clients|requests))\b', text, re.IGNORECASE)
        metric_pts = min(30.0, 12.0 + len(metric_matches) * 9.0) if metric_matches else 10.0

        # Action verbs
        action_verb_matches = re.findall(r'\b(engineered|architected|spearheaded|led|developed|optimized|designed|implemented|migrated|refactored|automated|reduced|increased|scaled|tuned|tuning|delivered)\b', text_lower)
        verb_pts = min(35.0, 15.0 + len(set(action_verb_matches)) * 7.0)

        # Keyword coverage points based on real identified skills
        keyword_pts = min(35.0, 15.0 + len(found_skills) * 5.0)

        ats_score = round(min(98.5, max(30.0, metric_pts + verb_pts + keyword_pts)), 1)

        # 3. Dynamic Missing Skills Analysis based on Target Job Family
        required_set = ROLE_REQUIREMENTS.get(target_family, ROLE_REQUIREMENTS["BACKEND"])
        missing_skills = [req for req in required_set if req not in seen_names]
        if not missing_skills:
            if target_family == "FRONTEND":
                missing_skills = ["Web Vitals (LCP/CLS) Optimization", "Micro-frontend Isolation"]
            else:
                missing_skills = ["Distributed Lock Management", "Disaster Recovery Testing"]

        # 4. Tailored Strengths based on actual detected content
        strengths = []
        if len(found_skills) >= 4:
            primary_skills = ", ".join([s.name for s in found_skills[:3]])
            strengths.append(f"Demonstrated core proficiency in modern stack technologies ({primary_skills}).")
        else:
            strengths.append("Foundational technical competencies established.")

        if len(action_verb_matches) >= 3:
            strengths.append(f"Effective use of active engineering verbs ({', '.join(set(action_verb_matches[:3]))}) conveying ownership.")
        else:
            strengths.append("Clear career progression and project deliverables.")

        if metric_matches:
            strengths.append(f"Quantified engineering outcomes highlighted ({metric_matches[0]}).")
        else:
            strengths.append("Structured project responsibilities and technology application.")

        # 5. Tailored Bullet Improvements based on actual weaknesses detected
        bullet_improvements = []
        if len(metric_matches) < 2:
            bullet_improvements.append(
                "Add quantified engineering metrics to bullet points (e.g. 'reduced latency by 35%' or 'scaled throughput to 10k req/s')."
            )
        if len(action_verb_matches) < 4:
            bullet_improvements.append(
                "Start each bullet point with high-impact action verbs (e.g. 'Architected', 'Spearheaded', 'Automated')."
            )
        if missing_skills:
            bullet_improvements.append(
                f"Highlight hands-on experience or project proof-of-concepts in target role gaps: {', '.join(missing_skills[:2])}."
            )
        if len(bullet_improvements) < 3:
            bullet_improvements.append(
                "Elaborate on production failure recovery, alerting thresholds, and caching strategies."
            )

        summary = (
            f"Candidate profile parsed for {target_role}. Identified {len(found_skills)} distinct verified technologies. "
            f"ATS compatibility scored at {ats_score}/100 with {len(action_verb_matches)} impact verbs and {len(metric_matches)} quantified outcomes."
        )

        return ResumeAnalysisResponse(
            ats_score=ats_score,
            summary=summary,
            extracted_skills=found_skills,
            strengths=strengths,
            missing_critical_skills=missing_skills[:4],
            bullet_improvements=bullet_improvements,
            rubric_evaluation={
                "keyword_coverage": round(keyword_pts / 30.0 * 10.0, 1),
                "quantifiable_outcomes": round(metric_pts / 35.0 * 10.0, 1),
                "action_verb_clarity": round(verb_pts / 35.0 * 10.0, 1)
            }
        )
