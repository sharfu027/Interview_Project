package com.interviewos.interview.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record InterviewSessionDto(
    UUID id,
    String title,
    String interviewType,
    String jobFamily,
    String seniority,
    String difficulty,
    String mode,
    boolean strictSimulation,
    String feedbackTiming,
    String status,
    int currentQuestionIndex,
    int totalQuestions,
    int durationMinutes,
    Instant startedAt,
    Instant endedAt,
    BigDecimal overallScore,
    String summaryFeedback,
    List<InterviewQuestionDto> questions
) {}
