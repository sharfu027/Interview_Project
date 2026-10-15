import re
from typing import Dict
from app.schemas.ai_schemas import SpeechAnalysisRequest, SpeechAnalysisResponse

FILLER_WORDS = ["um", "uh", "like", "you know", "actually", "basically", "sort of", "kind of", "right"]

class SpeakingCoachService:
    def analyze_speech(self, req: SpeechAnalysisRequest) -> SpeechAnalysisResponse:
        text = req.transcript_text.strip()
        text_lower = text.lower()
        duration_min = max(0.05, req.duration_seconds / 60.0)

        # 1. Total word count
        words = re.findall(r'\b\w+\b', text)
        total_words = len(words)

        # 2. Words per minute (WPM)
        wpm = round(total_words / duration_min, 1) if duration_min > 0 else 0.0

        # 3. Filler word detection
        filler_breakdown: Dict[str, int] = {}
        total_fillers = 0

        for filler in FILLER_WORDS:
            matches = len(re.findall(r'\b' + re.escape(filler) + r'\b', text_lower))
            if matches > 0:
                filler_breakdown[filler] = matches
                total_fillers += matches

        # 4. Pace status
        if wpm < 110:
            pace_status = "TOO_SLOW"
            coaching_tip = "Pacing is slightly deliberate. Aim for 125-150 words per minute to project dynamic confidence."
        elif wpm > 175:
            pace_status = "TOO_FAST"
            coaching_tip = "Speaking rapidly. Insert brief pauses after key technical insights to let interviewers absorb your architecture."
        else:
            pace_status = "OPTIMAL"
            coaching_tip = "Excellent, conversational pacing. Voice clarity and rhythm are well-balanced."

        # 5. Clarity score
        clarity_penalty = min(3.0, (total_fillers / max(1, total_words)) * 25.0)
        clarity_score = round(max(5.0, 10.0 - clarity_penalty), 1)

        structure = "EXCELLENT" if total_words > 40 and total_fillers <= 3 else ("RAMBLING" if total_fillers > 8 else "GOOD")

        return SpeechAnalysisResponse(
            words_per_minute=wpm,
            total_words=total_words,
            filler_word_count=total_fillers,
            filler_breakdown=filler_breakdown,
            pace_status=pace_status,
            clarity_score=clarity_score,
            structure_quality=structure,
            coaching_tip=coaching_tip
        )
