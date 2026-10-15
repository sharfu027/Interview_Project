package com.interviewos.speech.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record SpeechMetricDto(
    UUID id,
    UUID sessionId,
    BigDecimal wordsPerMinute,
    int totalWords,
    int fillerWordCount,
    int pauseCount,
    int longPauseCount,
    BigDecimal speakingDurationSeconds,
    BigDecimal clarityScore,
    String structureQuality,
    String feedbackNotes,
    Instant createdAt
) {}
