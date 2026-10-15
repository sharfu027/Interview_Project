package com.interviewos.speech.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record SaveSpeechMetricRequest(
    UUID questionId,
    BigDecimal wordsPerMinute,
    int totalWords,
    int fillerWordCount,
    String fillerWordsBreakdownJson,
    int pauseCount,
    int longPauseCount,
    BigDecimal speakingDurationSeconds,
    BigDecimal clarityScore,
    String structureQuality,
    String feedbackNotes
) {}
