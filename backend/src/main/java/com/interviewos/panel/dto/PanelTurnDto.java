package com.interviewos.panel.dto;

import java.time.Instant;
import java.util.UUID;

public record PanelTurnDto(
    UUID id,
    int turnNumber,
    String personaId,
    String personaName,
    String personaRole,
    String actionType,
    String content,
    Instant createdAt
) {}
