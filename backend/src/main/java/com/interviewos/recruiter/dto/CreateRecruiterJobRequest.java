package com.interviewos.recruiter.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateRecruiterJobRequest(
    @NotBlank(message = "Job title is required")
    String title,

    String department,

    @NotBlank(message = "Job family is required")
    String jobFamily,

    String seniority,
    String location,
    String employmentType,

    @NotBlank(message = "Job description is required")
    String description
) {}
