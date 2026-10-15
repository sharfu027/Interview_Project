package com.interviewos.resume.controller;

import com.interviewos.common.ApiResponse;
import com.interviewos.config.UserPrincipal;
import com.interviewos.resume.dto.ResumeAnalysisDto;
import com.interviewos.resume.dto.ResumeDto;
import com.interviewos.resume.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/resumes")
@Tag(name = "Resume Intelligence", description = "Endpoints for resume upload, parsing, and ATS score analysis")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @GetMapping
    @Operation(summary = "List all resumes belonging to authenticated candidate")
    public ResponseEntity<ApiResponse<List<ResumeDto>>> getMyResumes(@AuthenticationPrincipal UserPrincipal principal) {
        List<ResumeDto> resumes = resumeService.getUserResumes(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(resumes));
    }

    @GetMapping("/{resumeId}")
    @Operation(summary = "Get specific resume details")
    public ResponseEntity<ApiResponse<ResumeDto>> getResume(
        @PathVariable UUID resumeId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        ResumeDto resume = resumeService.getResume(resumeId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(resume));
    }

    @GetMapping("/{resumeId}/analysis")
    @Operation(summary = "Get comprehensive ATS analysis, extracted skills, and bullet review")
    public ResponseEntity<ApiResponse<ResumeAnalysisDto>> getResumeAnalysis(
        @PathVariable UUID resumeId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        ResumeAnalysisDto analysis = resumeService.getResumeAnalysis(resumeId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(analysis));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload PDF or DOCX resume document")
    public ResponseEntity<ApiResponse<ResumeDto>> uploadResume(
        @RequestParam("file") MultipartFile file,
        @RequestParam(value = "title", required = false) String title,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        ResumeDto uploaded = resumeService.uploadResume(principal.getId(), file, title);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Resume uploaded and parsed successfully", uploaded));
    }

    @DeleteMapping("/{resumeId}")
    @Operation(summary = "Delete resume and associated parse history")
    public ResponseEntity<ApiResponse<Void>> deleteResume(
        @PathVariable UUID resumeId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        resumeService.deleteResume(resumeId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Resume deleted successfully", null));
    }
}
