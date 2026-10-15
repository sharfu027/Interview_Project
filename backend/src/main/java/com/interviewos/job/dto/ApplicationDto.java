package com.interviewos.job.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ApplicationDto(
    UUID id,
    String companyName,
    String jobTitle,
    String status,
    String currentStage,
    LocalDate appliedDate,
    BigDecimal salaryOffered,
    String contactPerson,
    String contactEmail,
    String notes
) {}
