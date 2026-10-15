package com.interviewos.interview.controller;

import com.interviewos.common.ApiResponse;
import com.interviewos.config.UserPrincipal;
import com.interviewos.interview.dto.*;
import com.interviewos.interview.service.InterviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/interviews")
@Tag(name = "Interview Engine", description = "Endpoints for configuring, running, and reviewing AI mock interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping
    @Operation(summary = "Create and configure a new AI mock interview session")
    public ResponseEntity<ApiResponse<InterviewSessionDto>> createInterview(
        @AuthenticationPrincipal UserPrincipal principal,
        @Valid @RequestBody CreateInterviewRequest request
    ) {
        InterviewSessionDto session = interviewService.createSession(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Interview session created", session));
    }

    @GetMapping
    @Operation(summary = "List candidate interview sessions history")
    public ResponseEntity<ApiResponse<List<InterviewSessionDto>>> listInterviews(@AuthenticationPrincipal UserPrincipal principal) {
        List<InterviewSessionDto> sessions = interviewService.listUserSessions(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(sessions));
    }

    @GetMapping("/{sessionId}")
    @Operation(summary = "Get specific interview session details and current state")
    public ResponseEntity<ApiResponse<InterviewSessionDto>> getSession(
        @PathVariable UUID sessionId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        InterviewSessionDto session = interviewService.getSession(sessionId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(session));
    }

    @PostMapping("/{sessionId}/start")
    @Operation(summary = "Start interview session: transition to IN_PROGRESS and activate question 1")
    public ResponseEntity<ApiResponse<InterviewSessionDto>> startSession(
        @PathVariable UUID sessionId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        InterviewSessionDto session = interviewService.startSession(sessionId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Interview session started", session));
    }

    @PostMapping("/{sessionId}/questions/{questionId}/answer")
    @Operation(summary = "Submit candidate answer, run rubric scoring, and advance session")
    public ResponseEntity<ApiResponse<InterviewSessionDto>> submitAnswer(
        @PathVariable UUID sessionId,
        @PathVariable UUID questionId,
        @Valid @RequestBody SubmitAnswerRequest request,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        InterviewSessionDto session = interviewService.submitAnswer(sessionId, questionId, principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Answer evaluated and recorded", session));
    }

    @GetMapping("/{sessionId}/report")
    @Operation(summary = "Get comprehensive interview scorecard and actionable feedback report")
    public ResponseEntity<ApiResponse<InterviewReportDto>> getSessionReport(
        @PathVariable UUID sessionId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        InterviewReportDto report = interviewService.getSessionReport(sessionId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(report));
    }
}
