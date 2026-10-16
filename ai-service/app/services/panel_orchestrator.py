from app.schemas.ai_schemas import PanelTurnRequest, PanelTurnResponse

class PanelOrchestratorService:
    def process_turn(self, req: PanelTurnRequest) -> PanelTurnResponse:
        current_turn = req.current_turn
        next_turn = current_turn + 2
        title_lower = req.job_title.lower()
        last_ans = req.candidate_last_answer.strip()

        # Extract context from candidate's last answer
        ans_snippet = f"Following up on your point regarding {last_ans[:40]}... " if len(last_ans) > 20 else ""

        if next_turn == 3:
            if "frontend" in title_lower:
                prompt = f"{ans_snippet}Let's dive into frontend rendering architecture. When optimizing client-side React rendering under heavy WebSocket live feeds, how do you prevent re-render cascades and main-thread blockage?"
                persona_name = "Mei Lin (Staff Frontend Architect)"
            elif "qa" in title_lower or "test" in title_lower:
                prompt = f"{ans_snippet}Let's look at test automation infrastructure. How do you design your test harness to isolate test data and eliminate flaky failures when running 500+ tests concurrently in CI/CD?"
                persona_name = "Devansh Roy (Lead Quality Architect)"
            elif "data" in title_lower:
                prompt = f"{ans_snippet}Moving to data engineering mechanics: how do you structure stream windowing and handle late-arriving event watermarks without state store bloat in distributed Kafka/Spark pipelines?"
                persona_name = "Anita Patel (Principal Data Architect)"
            else:
                prompt = f"{ans_snippet}Good start. Let's move directly into implementation. When designing high-concurrency backend services, how do you prevent thread pool and connection pool exhaustion during downstream latency spikes?"
                persona_name = "Alex Chen (Principal Staff Engineer)"

            return PanelTurnResponse(
                next_persona_id="TECH_LEAD",
                next_persona_name=persona_name,
                action_type="QUESTION",
                prompt_content=prompt,
                turn_number=next_turn
            )

        elif next_turn == 5:
            if "frontend" in title_lower:
                prompt = "I have to challenge that approach. Relying on global state synchronization across tabs can introduce subtle race conditions and memory leaks. How do you guarantee deterministic state reconciliation without excessive storage overhead?"
            elif "qa" in title_lower or "test" in title_lower:
                prompt = "Let's challenge the test execution trade-off. Running full end-to-end browser tests on every pull request slows down developer feedback. How do you mathematically calibrate the test pyramid to balance contract tests versus browser tests?"
            elif "data" in title_lower:
                prompt = "I must challenge that pipeline design. Introducing micro-batching for near-real-time dashboards increases storage compaction costs exponentially. How do you optimize partition pruning and file size compaction?"
            else:
                prompt = "I have to challenge that assumption. Introducing distributed caching introduces split-brain and cache stampede risk under network partitions. How does your architecture guarantee zero dirty reads for critical transaction histories without sacrificing latency?"

            return PanelTurnResponse(
                next_persona_id="ARCHITECT",
                next_persona_name="Dr. Elena Rostova (Chief Architect)",
                action_type="CHALLENGE",
                prompt_content=prompt,
                turn_number=next_turn
            )

        elif next_turn == 7:
            return PanelTurnResponse(
                next_persona_id="HIRING_MGR",
                next_persona_name="Marcus Vance (VP Engineering)",
                action_type="QUESTION",
                prompt_content="Technical depth is clear, but let's talk execution and trade-offs. If delivering this complete architecture would delay the product release by 3 weeks, how do you present the options to the executive team and what intermediate MVP compromises would you propose?",
                turn_number=next_turn
            )
        else:
            return PanelTurnResponse(
                next_persona_id="HR",
                next_persona_name="Priya Sharma (Director of Talent & Culture)",
                action_type="FOLLOWUP",
                prompt_content="Thank you for walking us through those challenging engineering and leadership scenarios. Looking back across our discussion today, what questions do you have for our panel about our engineering culture and technical roadmap?",
                turn_number=next_turn
            )
