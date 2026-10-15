from app.schemas.ai_schemas import PanelTurnRequest, PanelTurnResponse

class PanelOrchestratorService:
    def process_turn(self, req: PanelTurnRequest) -> PanelTurnResponse:
        current_turn = req.current_turn
        next_turn = current_turn + 2

        if next_turn == 3:
            return PanelTurnResponse(
                next_persona_id="TECH_LEAD",
                next_persona_name="Alex Chen (Principal Staff Engineer)",
                action_type="QUESTION",
                prompt_content="Good introduction. Let's move directly into the code. When designing high-concurrency Spring Boot services, how do you prevent Hikari connection pool exhaustion during sudden downstream microservice latency spikes?",
                turn_number=next_turn
            )
        elif next_turn == 5:
            return PanelTurnResponse(
                next_persona_id="ARCHITECT",
                next_persona_name="Dr. Elena Rostova (Chief Architect)",
                action_type="CHALLENGE",
                prompt_content="I have to challenge that assumption. Introducing Redis cache clustering introduces split-brain risk under network partitioning. How does your architecture ensure zero dirty reads for critical transaction histories without sacrificing latency?",
                turn_number=next_turn
            )
        elif next_turn == 7:
            return PanelTurnResponse(
                next_persona_id="HIRING_MGR",
                next_persona_name="Marcus Vance (VP Engineering)",
                action_type="QUESTION",
                prompt_content="Technical depth is clear, but let's talk execution and business trade-offs. If delivering this distributed architecture would delay the product launch by 3 weeks, how do you present the options to the executive team and what intermediate compromises would you recommend?",
                turn_number=next_turn
            )
        else:
            return PanelTurnResponse(
                next_persona_id="HR",
                next_persona_name="Priya Sharma (Director of Talent & Culture)",
                action_type="FOLLOWUP",
                prompt_content="Thank you for walking us through those challenging scenarios. Looking back across our discussion today, how do you feel about the technical culture we value here, and what questions do you have for our panel?",
                turn_number=next_turn
            )
