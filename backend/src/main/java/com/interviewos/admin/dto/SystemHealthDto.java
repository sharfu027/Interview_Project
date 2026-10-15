package com.interviewos.admin.dto;

import java.time.Instant;
import java.util.Map;

public record SystemHealthDto(
    String status,
    String environment,
    Instant timestamp,
    Map<String, String> services,
    Map<String, Object> metrics
) {}
