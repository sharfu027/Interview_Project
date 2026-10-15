package com.interviewos.speech.controller;

import com.interviewos.common.ApiResponse;
import com.interviewos.config.UserPrincipal;
import com.interviewos.speech.dto.RecordingAssetDto;
import com.interviewos.speech.dto.SaveSpeechMetricRequest;
import com.interviewos.speech.dto.SpeechMetricDto;
import com.interviewos.speech.service.SpeechService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/speech-coach")
@Tag(name = "Speaking Coach & Audio Intelligence", description = "Endpoints for real-time speech analytics, filler-word counters, and pace metrics")
public class SpeechController {

    private final SpeechService speechService;

    public SpeechController(SpeechService speechService) {
        this.speechService = speechService;
    }

    @PostMapping("/sessions/{sessionId}/metrics")
    @Operation(summary = "Persist speech coach metrics for an interview question answer")
    public ResponseEntity<ApiResponse<SpeechMetricDto>> saveMetric(
        @PathVariable UUID sessionId,
        @RequestBody SaveSpeechMetricRequest request,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        SpeechMetricDto metric = speechService.recordSpeechMetric(sessionId, principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Speech metrics recorded", metric));
    }

    @GetMapping("/sessions/{sessionId}/metrics")
    @Operation(summary = "Get speech coach analytics timeline for an interview session")
    public ResponseEntity<ApiResponse<List<SpeechMetricDto>>> getSessionMetrics(
        @PathVariable UUID sessionId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<SpeechMetricDto> metrics = speechService.getSessionMetrics(sessionId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(metrics));
    }

    @GetMapping("/recordings")
    @Operation(summary = "List candidate recordings with secure metadata")
    public ResponseEntity<ApiResponse<List<RecordingAssetDto>>> listRecordings(@AuthenticationPrincipal UserPrincipal principal) {
        List<RecordingAssetDto> recordings = speechService.listRecordings(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(recordings));
    }

    @DeleteMapping("/recordings/{recordingId}")
    @Operation(summary = "Soft-delete private interview recording")
    public ResponseEntity<ApiResponse<Void>> deleteRecording(
        @PathVariable UUID recordingId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        speechService.deleteRecording(recordingId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Recording deleted", null));
    }
}
