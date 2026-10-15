package com.interviewos.user.dto;

public record UserSettingsDto(
    String theme,
    String cameraDeviceId,
    String microphoneDeviceId,
    String speakerDeviceId,
    boolean speakingCoachLive,
    boolean speakingCoachFillerWords,
    boolean speakingCoachPaceTracking,
    boolean privacyShareRecruiter,
    boolean emailNotificationsEnabled,
    String languageLocale
) {}
