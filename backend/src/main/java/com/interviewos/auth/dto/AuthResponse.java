package com.interviewos.auth.dto;

import java.util.List;
import java.util.UUID;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    UUID userId,
    String email,
    String firstName,
    String lastName,
    List<String> roles
) {
    public static AuthResponse of(String accessToken, String refreshToken, UUID userId, String email, String firstName, String lastName, List<String> roles) {
        return new AuthResponse(accessToken, refreshToken, "Bearer", userId, email, firstName, lastName, roles);
    }
}
