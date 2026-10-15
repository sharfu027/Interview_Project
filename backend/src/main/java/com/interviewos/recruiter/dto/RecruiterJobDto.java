package com.interviewos.recruiter.dto;

import java.time.Instant;
import java.util.UUID;

public record RecruiterJobDto(
    UUID id,
    UUID organizationId,
    String title,
    String department,
    String jobFamily,
    String seniority,
    String location,
    String employmentType,
    String description,
    String status,
    Instant createdAt
) {}
