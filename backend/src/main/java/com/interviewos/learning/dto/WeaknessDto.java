package com.interviewos.learning.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record WeaknessDto(
    UUID id,
    String competency,
    String skillId,
    String title,
    String severity,
    BigDecimal confidenceLevel,
    String explanation,
    String status,
    Instant resolvedAt,
    Instant createdAt
) {}
