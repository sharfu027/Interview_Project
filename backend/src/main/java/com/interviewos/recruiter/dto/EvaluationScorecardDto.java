package com.interviewos.recruiter.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record EvaluationScorecardDto(
    UUID id,
    UUID candidateLinkId,
    String candidateName,
    String interviewerName,
    String recommendation,
    BigDecimal overallScore,
    String generalNotes,
    Instant submittedAt
) {}
