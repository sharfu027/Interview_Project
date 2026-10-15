package com.interviewos.learning.dto;

import java.util.UUID;

public record SavedQuestionDto(
    UUID id,
    String category,
    String questionText,
    String referenceAnswer,
    String difficulty,
    String notes
) {}
