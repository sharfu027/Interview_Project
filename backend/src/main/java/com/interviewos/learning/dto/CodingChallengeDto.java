package com.interviewos.learning.dto;

import java.util.UUID;

public record CodingChallengeDto(
    UUID id,
    String title,
    String slug,
    String difficulty,
    String category,
    String description,
    String starterCode,
    int timeLimitMs,
    int memoryLimitMb
) {}
