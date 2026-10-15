package com.interviewos.learning.dto;

import java.time.Instant;
import java.util.UUID;

public record RoadmapMilestoneDto(
    UUID id,
    int milestoneOrder,
    String title,
    String description,
    String skillCategory,
    int estimatedHours,
    boolean isCompleted,
    Instant completedAt
) {}
