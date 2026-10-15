from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Resume Parsing & ATS Scoring Schemas
class ResumeParseRequest(BaseModel):
    raw_text: str = Field(..., min_length=20, description="Raw extracted text of resume")
    target_role: Optional[str] = "Software Engineer"
    target_job_family: Optional[str] = "BACKEND"

class ExtractedSkill(BaseModel):
    name: str
    category: str = "TECHNICAL"
    proficiency: str = "INTERMEDIATE"
    years: float = 1.0

class ResumeAnalysisResponse(BaseModel):
    ats_score: float = Field(..., ge=0.0, le=100.0)
    summary: str
    extracted_skills: List[ExtractedSkill]
    strengths: List[str]
    missing_critical_skills: List[str]
    bullet_improvements: List[str]
    rubric_evaluation: Dict[str, float]

# Mock Interview Question Generation & Answer Evaluation
class QuestionGenRequest(BaseModel):
    interview_type: str = "TECHNICAL"
    job_family: str = "BACKEND"
    seniority: str = "SENIOR"
    difficulty: str = "MEDIUM"
    resume_skills: List[str] = []
    resume_projects: List[str] = []
    total_questions: int = 5

class GeneratedQuestion(BaseModel):
    order: int
    interviewer_persona: str
    competency: str
    question_text: str
    difficulty: str
    expected_concepts: List[str]
    rubric_focus: str

class QuestionGenResponse(BaseModel):
    questions: List[GeneratedQuestion]

class AnswerEvaluationRequest(BaseModel):
    question_text: str
    competency: str
    candidate_answer: str = Field(..., min_length=2)
    interview_type: str = "TECHNICAL"
    seniority: str = "SENIOR"

class CriterionScore(BaseModel):
    criterion: str
    score: float = Field(..., ge=0.0, le=10.0)
    max_score: float = 10.0
    notes: str

class AnswerEvaluationResponse(BaseModel):
    overall_score: float = Field(..., ge=0.0, le=10.0)
    criterion_scores: List[CriterionScore]
    strengths: List[str]
    concrete_improvement: str
    sample_ideal_response: str
    star_analysis: Dict[str, str] = {}

# Speaking Coach Metrics Schemas
class SpeechAnalysisRequest(BaseModel):
    transcript_text: str
    duration_seconds: float = Field(..., gt=0.0)

class SpeechAnalysisResponse(BaseModel):
    words_per_minute: float
    total_words: int
    filler_word_count: int
    filler_breakdown: Dict[str, int]
    pace_status: str # TOO_SLOW, OPTIMAL, TOO_FAST
    clarity_score: float
    structure_quality: str # EXCELLENT, GOOD, RAMBLING, INCOMPLETE
    coaching_tip: str

# 4-Persona Panel Turn Schemas
class PanelTurnRequest(BaseModel):
    session_id: str
    current_turn: int
    candidate_last_answer: str
    active_persona_id: str
    job_title: str = "Senior Distributed Systems Engineer"

class PanelTurnResponse(BaseModel):
    next_persona_id: str # HR, TECH_LEAD, HIRING_MGR, ARCHITECT
    next_persona_name: str
    action_type: str # QUESTION, CHALLENGE, FOLLOWUP
    prompt_content: str
    turn_number: int
