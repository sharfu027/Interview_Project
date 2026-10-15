import pytest
from app.schemas.ai_schemas import (
    ResumeParseRequest, QuestionGenRequest, AnswerEvaluationRequest,
    SpeechAnalysisRequest, PanelTurnRequest
)
from app.services.resume_analyzer import ResumeAnalyzerService
from app.services.interview_orchestrator import InterviewOrchestratorService
from app.services.speaking_coach import SpeakingCoachService
from app.services.panel_orchestrator import PanelOrchestratorService
from app.services.salary_estimator import SalaryEstimatorService

def test_resume_analyzer():
    service = ResumeAnalyzerService()
    req = ResumeParseRequest(
        raw_text="Architected distributed microservices in Java and Spring Boot, tuning PostgreSQL queries and reducing latency by 45%.",
        target_role="Senior Backend Engineer"
    )
    result = service.analyze_resume(req)
    assert result.ats_score > 70.0
    assert any(s.name == "Java" for s in result.extracted_skills)
    assert any(s.name == "Spring Boot" for s in result.extracted_skills)
    assert len(result.bullet_improvements) > 0

def test_interview_orchestrator():
    service = InterviewOrchestratorService()
    q_req = QuestionGenRequest(
        interview_type="TECHNICAL",
        job_family="BACKEND",
        seniority="SENIOR"
    )
    q_res = service.generate_questions(q_req)
    assert len(q_res.questions) >= 2
    assert q_res.questions[0].interviewer_persona != ""

    eval_req = AnswerEvaluationRequest(
        question_text="Explain volatile in Java",
        competency="CONCURRENCY",
        candidate_answer="The volatile keyword establishes a happens-before relationship ensuring memory visibility across threads, preventing CPU cache staleness. However, it does not guarantee atomic increments."
    )
    eval_res = service.evaluate_answer(eval_req)
    assert eval_res.overall_score >= 8.0
    assert len(eval_res.criterion_scores) == 4

def test_speaking_coach():
    service = SpeakingCoachService()
    req = SpeechAnalysisRequest(
        transcript_text="Um, in our architecture, like, we basically configured a connection pool, you know, to handle traffic spikes.",
        duration_seconds=10.0
    )
    result = service.analyze_speech(req)
    assert result.filler_word_count >= 3
    assert "um" in result.filler_breakdown
    assert result.words_per_minute > 0

def test_panel_orchestrator():
    service = PanelOrchestratorService()
    turn_req = PanelTurnRequest(
        session_id="session-123",
        current_turn=1,
        candidate_last_answer="I have 6 years experience in Java microservices.",
        active_persona_id="HR"
    )
    res = service.process_turn(turn_req)
    assert res.next_persona_id == "TECH_LEAD"
    assert res.action_type == "QUESTION"
    assert res.turn_number == 3

def test_salary_estimator():
    service = SalaryEstimatorService()
    est = service.estimate_compensation("Senior Backend Engineer", "SENIOR", "Remote")
    assert est["base_salary_median"] > 150000
    assert est["currency"] == "USD"
    assert len(est["influencing_factors"]) > 0
