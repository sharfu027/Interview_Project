package com.interviewos.recruiter.controller;

import com.interviewos.common.ApiResponse;
import com.interviewos.config.UserPrincipal;
import com.interviewos.recruiter.dto.*;
import com.interviewos.recruiter.service.RecruiterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/recruiter")
@Tag(name = "Recruiter Workspace", description = "Endpoints for job requisitions, candidate pipeline, and evaluation scorecards")
@PreAuthorize("hasAnyRole('RECRUITER', 'ORG_ADMIN', 'ADMIN')")
public class RecruiterController {

    private final RecruiterService recruiterService;

    public RecruiterController(RecruiterService recruiterService) {
        this.recruiterService = recruiterService;
    }

    @GetMapping("/jobs")
    @Operation(summary = "List job requisitions managed by recruiter organization")
    public ResponseEntity<ApiResponse<List<RecruiterJobDto>>> listJobs(@RequestParam(required = false) UUID organizationId) {
        List<RecruiterJobDto> jobs = recruiterService.listJobs(organizationId);
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    @PostMapping("/jobs")
    @Operation(summary = "Create and publish a new job requisition")
    public ResponseEntity<ApiResponse<RecruiterJobDto>> createJob(
        @RequestParam(required = false) UUID organizationId,
        @Valid @RequestBody CreateRecruiterJobRequest request,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        RecruiterJobDto created = recruiterService.createJob(organizationId, principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Job created successfully", created));
    }

    @GetMapping("/candidates")
    @Operation(summary = "List candidate applications under active recruiter review")
    public ResponseEntity<ApiResponse<List<RecruiterCandidateDto>>> listCandidates(@RequestParam(required = false) UUID organizationId) {
        List<RecruiterCandidateDto> candidates = recruiterService.listCandidates(organizationId);
        return ResponseEntity.ok(ApiResponse.success(candidates));
    }

    @GetMapping("/candidates/{candidateLinkId}/scorecards")
    @Operation(summary = "List structured interview scorecards for a candidate")
    public ResponseEntity<ApiResponse<List<EvaluationScorecardDto>>> listScorecards(@PathVariable UUID candidateLinkId) {
        List<EvaluationScorecardDto> cards = recruiterService.listScorecards(candidateLinkId);
        return ResponseEntity.ok(ApiResponse.success(cards));
    }

    @PostMapping("/candidates/{candidateLinkId}/scorecards")
    @Operation(summary = "Submit evaluation scorecard for a candidate")
    public ResponseEntity<ApiResponse<EvaluationScorecardDto>> submitScorecard(
        @PathVariable UUID candidateLinkId,
        @Valid @RequestBody SubmitScorecardRequest request,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        EvaluationScorecardDto scorecard = recruiterService.submitScorecard(candidateLinkId, principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Scorecard submitted successfully", scorecard));
    }
}
