import re
from typing import List
from app.schemas.ai_schemas import (
    QuestionGenRequest, QuestionGenResponse, GeneratedQuestion,
    AnswerEvaluationRequest, AnswerEvaluationResponse, CriterionScore
)

class InterviewOrchestratorService:
    def generate_questions(self, req: QuestionGenRequest) -> QuestionGenResponse:
        questions: List[GeneratedQuestion] = []
        family = req.job_family.upper()
        itype = req.interview_type.upper()

        if itype == "BEHAVIORAL" or itype == "HR":
            questions.append(GeneratedQuestion(
                order=1,
                interviewer_persona="Priya Sharma (Talent Director)",
                competency="CAREER_MOTIVATION",
                question_text="What prompted you to consider this transition, and what specific technical problems are you most passionate about tackling next?",
                difficulty="EASY",
                expected_concepts=["Role alignment", "Technical growth", "Company values"],
                rubric_focus="Motivation and communication clarity"
            ))
            questions.append(GeneratedQuestion(
                order=2,
                interviewer_persona="Marcus Vance (VP Engineering)",
                competency="CONFLICT_AND_COLLABORATION",
                question_text="Describe a situation where you had a strong disagreement with an architectural choice made by your team. How did you advocate your perspective and arrive at consensus?",
                difficulty="MEDIUM",
                expected_concepts=["STAR structure", "Empathy", "Data-driven negotiation"],
                rubric_focus="Interpersonal effectiveness and maturity"
            ))
        else: # TECHNICAL, SYSTEM_DESIGN, CODING, ARCHITECT
            questions.append(GeneratedQuestion(
                order=1,
                interviewer_persona="Alex Chen (Principal Staff Engineer)",
                competency="CONCURRENCY_AND_MEMORY",
                question_text="In Java, what is the precise happens-before relationship established by the volatile keyword, and how does it prevent instruction reordering in multithreaded pipelines?",
                difficulty="HARD",
                expected_concepts=["Java Memory Model", "Hardware memory barriers", "Cache coherence"],
                rubric_focus="Deep technical correctness and memory safety"
            ))
            questions.append(GeneratedQuestion(
                order=2,
                interviewer_persona="Dr. Elena Rostova (Chief Architect)",
                competency="DISTRIBUTED_SYSTEMS",
                question_text="Design a resilient payment processing webhook consumer that guarantees exactly-once processing semantics without holding long-lived database locks.",
                difficulty="HARD",
                expected_concepts=["Idempotency keys", "Redis distributed lock TTL", "Transactional outbox pattern"],
                rubric_focus="Scalability, failure modes, and trade-off awareness"
            ))
            questions.append(GeneratedQuestion(
                order=3,
                interviewer_persona="Alex Chen (Principal Staff Engineer)",
                competency="DATABASE_OPTIMIZATION",
                question_text="Under PostgreSQL, how does MVCC handle concurrent row updates, and what are the specific performance trade-offs of using B-Tree vs BRIN indexes for large historical log tables?",
                difficulty="MEDIUM",
                expected_concepts=["MVCC vacuuming", "Index page overhead", "Sequential scan vs index scan"],
                rubric_focus="Storage engine internals and query tuning"
            ))

        return QuestionGenResponse(questions=questions)

    def evaluate_answer(self, req: AnswerEvaluationRequest) -> AnswerEvaluationResponse:
        answer = req.candidate_answer.strip()
        word_count = len(answer.split())

        # Rubric scoring heuristics
        tech_score = 9.0 if word_count > 45 and ("memory" in answer.lower() or "thread" in answer.lower() or "cache" in answer.lower()) else 7.5
        reasoning_score = 8.8 if word_count > 60 else 7.2
        clarity_score = 8.5
        tradeoff_score = 8.7 if ("trade" in answer.lower() or "however" in answer.lower() or "latency" in answer.lower()) else 7.0

        overall = round((tech_score + reasoning_score + clarity_score + tradeoff_score) / 4.0, 1)

        criterion_scores = [
            CriterionScore(criterion="TECHNICAL_CORRECTNESS", score=tech_score, notes="Accurate architectural references and terminology."),
            CriterionScore(criterion="REASONING_STRUCTURE", score=reasoning_score, notes="Logical progression from problem statement to implementation."),
            CriterionScore(criterion="COMMUNICATION_CLARITY", score=clarity_score, notes="Concise and direct phrasing."),
            CriterionScore(criterion="AWARENESS_OF_TRADEOFFS", score=tradeoff_score, notes="Demonstrated understanding of operational trade-offs.")
        ]

        return AnswerEvaluationResponse(
            overall_score=overall,
            criterion_scores=criterion_scores,
            strengths=[
                "Articulated core engineering mechanism clearly",
                "Recognized concurrency and locking implications"
            ],
            concrete_improvement="Quantify the latency SLA impact and mention alerting thresholds for thread pool starvation.",
            sample_ideal_response="An exemplary response details exact failure recovery times, custom rejection policies, and health probe configurations.",
            star_analysis={
                "situation": "Identified the distributed scale constraint",
                "task": "Outlined the synchronization guarantee required",
                "action": "Applied bounded buffers and atomic check-and-set",
                "result": "Prevented data corruption with sub-10ms response times"
            }
        )
