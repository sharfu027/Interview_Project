package com.interviewos.job.controller;

import com.interviewos.common.ApiResponse;
import com.interviewos.common.PagedResponse;
import com.interviewos.config.UserPrincipal;
import com.interviewos.job.dto.ApplicationDto;
import com.interviewos.job.dto.CompanyDto;
import com.interviewos.job.dto.CreateApplicationRequest;
import com.interviewos.job.dto.JobPostingDto;
import com.interviewos.job.service.JobService;
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
@RequestMapping("/api/v1/jobs")
@Tag(name = "Job & Company Intelligence", description = "Endpoints for job postings, company prep guides, and application tracking")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping("/public")
    @Operation(summary = "List active job postings with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<JobPostingDto>>> listJobs(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<JobPostingDto> response = jobService.listActiveJobs(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/public/{jobId}")
    @Operation(summary = "Get specific job posting details")
    public ResponseEntity<ApiResponse<JobPostingDto>> getJobById(@PathVariable UUID jobId) {
        JobPostingDto job = jobService.getJobById(jobId);
        return ResponseEntity.ok(ApiResponse.success(job));
    }

    @GetMapping("/public/companies/{slug}")
    @Operation(summary = "Get company-specific preparation guides, interview process notes, and culture insights")
    public ResponseEntity<ApiResponse<CompanyDto>> getCompanyPrep(@PathVariable String slug) {
        CompanyDto company = jobService.getCompanyPrep(slug);
        return ResponseEntity.ok(ApiResponse.success(company));
    }

    @GetMapping("/applications")
    @Operation(summary = "List candidate applications and pipeline stages")
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> listApplications(@AuthenticationPrincipal UserPrincipal principal) {
        List<ApplicationDto> applications = jobService.listApplications(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(applications));
    }

    @PostMapping("/applications")
    @Operation(summary = "Track a new job application in the candidate pipeline")
    public ResponseEntity<ApiResponse<ApplicationDto>> createApplication(
        @AuthenticationPrincipal UserPrincipal principal,
        @Valid @RequestBody CreateApplicationRequest req
    ) {
        ApplicationDto created = jobService.createApplication(principal.getId(), req);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Application created", created));
    }

    @PatchMapping("/applications/{applicationId}")
    @Operation(summary = "Update application stage or status")
    public ResponseEntity<ApiResponse<ApplicationDto>> updateApplication(
        @PathVariable UUID applicationId,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String currentStage,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        ApplicationDto updated = jobService.updateApplication(applicationId, principal.getId(), status, currentStage);
        return ResponseEntity.ok(ApiResponse.success("Application updated", updated));
    }

    @DeleteMapping("/applications/{applicationId}")
    @Operation(summary = "Remove application from candidate pipeline")
    public ResponseEntity<ApiResponse<Void>> deleteApplication(
        @PathVariable UUID applicationId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        jobService.deleteApplication(applicationId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Application deleted", null));
    }
}
