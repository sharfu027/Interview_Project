package com.interviewos.learning.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record CareerRoadmapDto(
    UUID id,
    String title,
    String targetRole,
    String targetSeniority,
    LocalDate targetCompletionDate,
    int weeklyStudyHours,
    BigDecimal progressPercentage,
    String status,
    Instant createdAt,
    List<RoadmapMilestoneDto> milestones
) {}
