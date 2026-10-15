package com.interviewos.interview.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record InterviewReportDto(
    UUID sessionId,
    String title,
    String interviewType,
    String jobFamily,
    String seniority,
    BigDecimal overallScore,
    String summaryFeedback,
    Instant startedAt,
    Instant endedAt,
    int durationMinutes,
    List<QuestionEvaluationReportDto> questionEvaluations,
    Map<String, BigDecimal> competencyScores,
    List<String> keyStrengths,
    List<String> recommendedNextActions
) {
    public record QuestionEvaluationReportDto(
        UUID questionId,
        int questionOrder,
        String interviewerPersona,
        String competency,
        String questionText,
        String answerText,
        BigDecimal questionScore,
        List<CriterionScoreDto> criterionScores,
        String concreteImprovement,
        String sampleIdealResponse
    ) {}

    public record CriterionScoreDto(String criterion, BigDecimal score, BigDecimal maxScore, String notes) {}
}
