package com.interviewos.interview.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public record SubmitAnswerRequest(
    @NotBlank(message = "Answer text is required")
    String answerText,

    int durationSeconds,
    BigDecimal wordsPerMinute,
    int fillerWordCount,
    int pauseCount,
    String audioAssetUrl
) {}
