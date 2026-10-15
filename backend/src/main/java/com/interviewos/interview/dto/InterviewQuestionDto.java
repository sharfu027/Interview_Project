package com.interviewos.interview.dto;

import java.util.UUID;

public record InterviewQuestionDto(
    UUID id,
    int questionOrder,
    String interviewerPersona,
    String competency,
    String questionText,
    String difficulty,
    String sourceReference,
    String status,
    String submittedAnswerText
) {}
