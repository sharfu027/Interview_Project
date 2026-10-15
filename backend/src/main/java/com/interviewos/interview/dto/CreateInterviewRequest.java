package com.interviewos.interview.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public record CreateInterviewRequest(
    @NotBlank(message = "Title is required")
    String title,

    @NotBlank(message = "Interview type is required")
    String interviewType, // HR, TECHNICAL, SYSTEM_DESIGN, CODING, BEHAVIORAL, RESUME_GRILLING, ARCHITECT, MANAGER

    String jobFamily,
    String seniority,
    String difficulty,
    String mode,
    boolean strictSimulation,
    String feedbackTiming,
    UUID resumeId,
    UUID jobId,
    int totalQuestions,
    int durationMinutes
) {}
