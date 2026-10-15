package com.interviewos.auth.controller;

import com.interviewos.auth.dto.AuthResponse;
import com.interviewos.auth.dto.LoginRequest;
import com.interviewos.auth.dto.PasswordResetRequest;
import com.interviewos.auth.dto.RegisterRequest;
import com.interviewos.auth.dto.TokenRefreshRequest;
import com.interviewos.auth.service.AuthService;
import com.interviewos.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Endpoints for user registration, authentication, and session handling")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and return JWT tokens")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Authentication successful", response));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new candidate or recruiter account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Registration successful", response));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh expired access token using valid refresh token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using single-use reset token")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password has been reset successfully", null));
    }
}
