package com.interviewos.panel.dto;

import jakarta.validation.constraints.NotBlank;

public record SubmitPanelTurnRequest(
    @NotBlank(message = "Response content is required")
    String responseText
) {}
