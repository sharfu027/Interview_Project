package com.interviewos.resume.dto;

import java.time.Instant;
import java.util.UUID;

public record ResumeDto(
    UUID id,
    String title,
    String originalFileName,
    long fileSizeBytes,
    String mimeType,
    boolean isPrimary,
    Instant createdAt
) {}
