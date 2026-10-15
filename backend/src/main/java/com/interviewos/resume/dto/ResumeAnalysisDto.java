package com.interviewos.resume.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ResumeAnalysisDto(
    UUID resumeId,
    String parserStatus,
    String fullName,
    String email,
    String phone,
    String location,
    String summary,
    BigDecimal atsScore,
    String atsRubricFeedback,
    List<SkillItemDto> skills,
    List<ProjectItemDto> projects,
    List<String> suggestedImprovements
) {
    public record SkillItemDto(String name, String category, String proficiency, BigDecimal years) {}
    public record ProjectItemDto(String title, String role, String description, String url) {}
}
