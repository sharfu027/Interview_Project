package com.interviewos.recruiter.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record RecruiterCandidateDto(
    UUID linkId,
    UUID candidateId,
    String candidateName,
    String candidateEmail,
    String jobTitle,
    String status,
    BigDecimal rating,
    boolean consentedShare,
    Instant appliedAt
) {}
