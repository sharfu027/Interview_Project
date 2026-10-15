package com.interviewos.user.controller;

import com.interviewos.common.ApiResponse;
import com.interviewos.config.UserPrincipal;
import com.interviewos.user.dto.UserProfileDto;
import com.interviewos.user.dto.UserSettingsDto;
import com.interviewos.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "User Management", description = "Endpoints for managing user profile and settings")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me/profile")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        UserProfileDto profile = userService.getProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/me/profile")
    @Operation(summary = "Update current authenticated user profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateMyProfile(
        @AuthenticationPrincipal UserPrincipal principal,
        @RequestBody UserProfileDto dto
    ) {
        UserProfileDto updated = userService.updateProfile(principal.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/me/settings")
    @Operation(summary = "Get user settings and hardware preferences")
    public ResponseEntity<ApiResponse<UserSettingsDto>> getMySettings(@AuthenticationPrincipal UserPrincipal principal) {
        UserSettingsDto settings = userService.getSettings(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(settings));
    }

    @PutMapping("/me/settings")
    @Operation(summary = "Update user settings and hardware preferences")
    public ResponseEntity<ApiResponse<UserSettingsDto>> updateMySettings(
        @AuthenticationPrincipal UserPrincipal principal,
        @RequestBody UserSettingsDto dto
    ) {
        UserSettingsDto updated = userService.updateSettings(principal.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Settings updated successfully", updated));
    }
}
