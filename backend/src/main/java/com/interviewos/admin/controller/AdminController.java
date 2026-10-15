package com.interviewos.admin.controller;

import com.interviewos.admin.dto.SystemHealthDto;
import com.interviewos.admin.service.AdminService;
import com.interviewos.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Platform Administration", description = "Endpoints for platform health, service status, and operational metrics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/system-health")
    @Operation(summary = "Get end-to-end system and AI provider health metrics")
    public ResponseEntity<ApiResponse<SystemHealthDto>> getSystemHealth() {
        SystemHealthDto health = adminService.getSystemHealth();
        return ResponseEntity.ok(ApiResponse.success(health));
    }
}
