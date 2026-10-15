package com.interviewos.panel.controller;

import com.interviewos.common.ApiResponse;
import com.interviewos.config.UserPrincipal;
import com.interviewos.panel.dto.PanelPersonaDto;
import com.interviewos.panel.dto.PanelSessionDto;
import com.interviewos.panel.dto.SubmitPanelTurnRequest;
import com.interviewos.panel.service.PanelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ai-panel")
@Tag(name = "AI Interview Panel", description = "Endpoints for multi-role 4-persona AI mock panel interactions")
public class PanelController {

    private final PanelService panelService;

    public PanelController(PanelService panelService) {
        this.panelService = panelService;
    }

    @GetMapping("/personas")
    @Operation(summary = "Get list of available panel personas (HR, Tech Lead, Hiring Manager, Enterprise Architect)")
    public ResponseEntity<ApiResponse<List<PanelPersonaDto>>> getPersonas() {
        List<PanelPersonaDto> personas = panelService.getPersonas();
        return ResponseEntity.ok(ApiResponse.success(personas));
    }

    @GetMapping("/sessions/{interviewSessionId}")
    @Operation(summary = "Get or initialize an AI panel session for an interview")
    public ResponseEntity<ApiResponse<PanelSessionDto>> getPanelSession(
        @PathVariable UUID interviewSessionId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        PanelSessionDto session = panelService.getOrCreatePanelSession(interviewSessionId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(session));
    }

    @PostMapping("/sessions/{panelSessionId}/turns")
    @Operation(summary = "Submit candidate turn response and trigger AI panel cross-examination")
    public ResponseEntity<ApiResponse<PanelSessionDto>> submitTurn(
        @PathVariable UUID panelSessionId,
        @Valid @RequestBody SubmitPanelTurnRequest request,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        PanelSessionDto session = panelService.submitCandidateResponse(panelSessionId, principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Response recorded and panel response generated", session));
    }
}
