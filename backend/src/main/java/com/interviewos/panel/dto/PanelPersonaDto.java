package com.interviewos.panel.dto;

public record PanelPersonaDto(
    String id,
    String displayName,
    String roleTitle,
    String avatarUrl,
    String questioningStyle
) {}
