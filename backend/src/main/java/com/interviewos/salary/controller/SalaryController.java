package com.interviewos.salary.controller;

import com.interviewos.common.ApiResponse;
import com.interviewos.salary.dto.SalaryEstimateDto;
import com.interviewos.salary.service.SalaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/salary")
@Tag(name = "Salary Intelligence", description = "Endpoints for statistical compensation estimates and negotiation insights")
public class SalaryController {

    private final SalaryService salaryService;

    public SalaryController(SalaryService salaryService) {
        this.salaryService = salaryService;
    }

    @GetMapping("/public/estimate")
    @Operation(summary = "Get compensation benchmarks by role, seniority, and location")
    public ResponseEntity<ApiResponse<SalaryEstimateDto>> getSalaryEstimate(
        @RequestParam(defaultValue = "BACKEND") String jobFamily,
        @RequestParam(defaultValue = "SENIOR") String seniority,
        @RequestParam(required = false) String location
    ) {
        SalaryEstimateDto estimate = salaryService.getSalaryEstimate(jobFamily, seniority, location);
        return ResponseEntity.ok(ApiResponse.success(estimate));
    }
}
