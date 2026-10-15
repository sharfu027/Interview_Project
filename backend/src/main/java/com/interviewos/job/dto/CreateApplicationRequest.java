package com.interviewos.job.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateApplicationRequest(
    @NotBlank(message = "Company name is required")
    String companyName,

    @NotBlank(message = "Job title is required")
    String jobTitle,

    String status,
    String currentStage,
    LocalDate appliedDate,
    BigDecimal salaryOffered,
    String contactPerson,
    String contactEmail,
    String notes
) {}
