package com.interviewos.salary.dto;

import java.math.BigDecimal;
import java.util.List;

public record SalaryEstimateDto(
    String jobFamily,
    String targetRole,
    String seniority,
    String location,
    BigDecimal baseSalaryMin,
    BigDecimal baseSalaryMedian,
    BigDecimal baseSalaryMax,
    BigDecimal totalCompMedian,
    String currency,
    int sampleSize,
    String dataSource,
    double confidenceScore,
    List<String> keyInfluencingFactors
) {}
