package com.interviewos.learning.controller;

import com.interviewos.common.ApiResponse;
import com.interviewos.config.UserPrincipal;
import com.interviewos.learning.dto.CareerRoadmapDto;
import com.interviewos.learning.dto.CodingChallengeDto;
import com.interviewos.learning.dto.SavedQuestionDto;
import com.interviewos.learning.dto.WeaknessDto;
import com.interviewos.learning.service.LearningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Career Intelligence & Learning", description = "Endpoints for weakness tracking, personalized roadmaps, coding lab, and question bank")
public class LearningController {

    private final LearningService learningService;

    public LearningController(LearningService learningService) {
        this.learningService = learningService;
    }

    @GetMapping("/weaknesses")
    @Operation(summary = "List candidate identified skill weaknesses and evidence history")
    public ResponseEntity<ApiResponse<List<WeaknessDto>>> listWeaknesses(@AuthenticationPrincipal UserPrincipal principal) {
        List<WeaknessDto> weaknesses = learningService.listWeaknesses(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(weaknesses));
    }

    @PatchMapping("/weaknesses/{weaknessId}/resolve")
    @Operation(summary = "Mark identified weakness as resolved")
    public ResponseEntity<ApiResponse<WeaknessDto>> resolveWeakness(
        @PathVariable UUID weaknessId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        WeaknessDto updated = learningService.resolveWeakness(weaknessId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Weakness marked as resolved", updated));
    }

    @GetMapping("/roadmaps")
    @Operation(summary = "List candidate personalized career roadmaps")
    public ResponseEntity<ApiResponse<List<CareerRoadmapDto>>> listRoadmaps(@AuthenticationPrincipal UserPrincipal principal) {
        List<CareerRoadmapDto> roadmaps = learningService.listRoadmaps(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(roadmaps));
    }

    @GetMapping("/roadmaps/{roadmapId}")
    @Operation(summary = "Get specific roadmap with ordered milestone breakdown")
    public ResponseEntity<ApiResponse<CareerRoadmapDto>> getRoadmap(
        @PathVariable UUID roadmapId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        CareerRoadmapDto roadmap = learningService.getRoadmap(roadmapId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(roadmap));
    }

    @PatchMapping("/roadmaps/{roadmapId}/milestones/{milestoneId}/complete")
    @Operation(summary = "Mark a roadmap milestone as completed and recalculate progress")
    public ResponseEntity<ApiResponse<CareerRoadmapDto>> completeMilestone(
        @PathVariable UUID roadmapId,
        @PathVariable UUID milestoneId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        CareerRoadmapDto updated = learningService.completeMilestone(roadmapId, milestoneId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Milestone completed", updated));
    }

    @GetMapping("/coding-lab/challenges")
    @Operation(summary = "List active coding challenges for hands-on interview coding practice")
    public ResponseEntity<ApiResponse<List<CodingChallengeDto>>> listCodingChallenges() {
        List<CodingChallengeDto> challenges = learningService.listCodingChallenges();
        return ResponseEntity.ok(ApiResponse.success(challenges));
    }

    @GetMapping("/coding-lab/challenges/{slug}")
    @Operation(summary = "Get specific coding challenge description and starter code")
    public ResponseEntity<ApiResponse<CodingChallengeDto>> getCodingChallenge(@PathVariable String slug) {
        CodingChallengeDto challenge = learningService.getCodingChallenge(slug);
        return ResponseEntity.ok(ApiResponse.success(challenge));
    }

    @GetMapping("/question-bank/saved")
    @Operation(summary = "List candidate bookmarked questions and interview reference answers")
    public ResponseEntity<ApiResponse<List<SavedQuestionDto>>> listSavedQuestions(@AuthenticationPrincipal UserPrincipal principal) {
        List<SavedQuestionDto> questions = learningService.listSavedQuestions(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(questions));
    }
}
