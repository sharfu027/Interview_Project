from fastapi import APIRouter, HTTPException, Depends
from app.schemas.ai_schemas import (
    ResumeParseRequest, ResumeAnalysisResponse,
    QuestionGenRequest, QuestionGenResponse,
    AnswerEvaluationRequest, AnswerEvaluationResponse,
    SpeechAnalysisRequest, SpeechAnalysisResponse,
    PanelTurnRequest, PanelTurnResponse
)
from app.services.resume_analyzer import ResumeAnalyzerService
from app.services.interview_orchestrator import InterviewOrchestratorService
from app.services.panel_orchestrator import PanelOrchestratorService
from app.services.speaking_coach import SpeakingCoachService
from app.services.salary_estimator import SalaryEstimatorService

router = APIRouter()

resume_service = ResumeAnalyzerService()
interview_service = InterviewOrchestratorService()
panel_service = PanelOrchestratorService()
speech_service = SpeakingCoachService()
salary_service = SalaryEstimatorService()

@router.post("/resumes/parse", response_model=ResumeAnalysisResponse)
async def parse_resume(request: ResumeParseRequest):
    return resume_service.analyze_resume(request)

@router.post("/interviews/generate-questions", response_model=QuestionGenResponse)
async def generate_questions(request: QuestionGenRequest):
    return interview_service.generate_questions(request)

@router.post("/interviews/evaluate-answer", response_model=AnswerEvaluationResponse)
async def evaluate_answer(request: AnswerEvaluationRequest):
    return interview_service.evaluate_answer(request)

@router.post("/panel/turn", response_model=PanelTurnResponse)
async def process_panel_turn(request: PanelTurnRequest):
    return panel_service.process_turn(request)

@router.post("/speech/analyze", response_model=SpeechAnalysisResponse)
async def analyze_speech(request: SpeechAnalysisRequest):
    return speech_service.analyze_speech(request)

@router.get("/salary/estimate")
async def estimate_salary(role: str = "Backend Engineer", seniority: str = "SENIOR", location: str = "Remote"):
    return salary_service.estimate_compensation(role, seniority, location)
