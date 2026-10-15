package com.interviewos.job.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record JobPostingDto(
    UUID id,
    String companyName,
    String title,
    String jobFamily,
    String seniority,
    String location,
    String employmentType,
    String remotePolicy,
    String description,
    BigDecimal salaryMin,
    BigDecimal salaryMax,
    String currency,
    String externalUrl
) {}
