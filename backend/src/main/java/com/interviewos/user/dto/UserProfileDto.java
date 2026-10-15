package com.interviewos.user.dto;

import java.util.UUID;

public record UserProfileDto(
    UUID userId,
    String email,
    String firstName,
    String lastName,
    String headline,
    String targetRole,
    String experienceLevel,
    String location,
    String bio,
    String githubUrl,
    String linkedinUrl,
    String portfolioUrl,
    String avatarUrl
) {}
