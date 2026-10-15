package com.interviewos.speech.dto;

import java.time.Instant;
import java.util.UUID;

public record RecordingAssetDto(
    UUID id,
    UUID sessionId,
    String mediaType,
    String storageKey,
    long fileSizeBytes,
    int durationSeconds,
    String mimeType,
    Instant createdAt
) {}
