package com.interviewos.recruiter.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record SubmitScorecardRequest(
    @NotBlank(message = "Recommendation is required")
    String recommendation, // STRONG_HIRE, HIRE, NO_HIRE, STRONG_NO_HIRE

    @NotNull(message = "Overall score is required")
    BigDecimal overallScore,

    String generalNotes
) {}
