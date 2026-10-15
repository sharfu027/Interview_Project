package com.interviewos.panel.dto;

import java.util.List;
import java.util.UUID;

public record PanelSessionDto(
    UUID id,
    UUID interviewSessionId,
    String interviewTitle,
    String activePersonaId,
    String activePersonaName,
    int currentTurn,
    List<PanelPersonaDto> personas,
    List<PanelTurnDto> turns,
    String consensusNotes
) {}
