package com.interviewos.user.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_settings")
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 20)
    private String theme = "light";

    @Column(name = "camera_device_id")
    private String cameraDeviceId;

    @Column(name = "microphone_device_id")
    private String microphoneDeviceId;

    @Column(name = "speaker_device_id")
    private String speakerDeviceId;

    @Column(name = "speaking_coach_live", nullable = false)
    private boolean speakingCoachLive = true;

    @Column(name = "speaking_coach_filler_words", nullable = false)
    private boolean speakingCoachFillerWords = true;

    @Column(name = "speaking_coach_pace_tracking", nullable = false)
    private boolean speakingCoachPaceTracking = true;

    @Column(name = "privacy_share_recruiter", nullable = false)
    private boolean privacyShareRecruiter = false;

    @Column(name = "email_notifications_enabled", nullable = false)
    private boolean emailNotificationsEnabled = true;

    @Column(name = "language_locale", nullable = false, length = 10)
    private String languageLocale = "en-US";

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public UserSettings() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
    public String getCameraDeviceId() { return cameraDeviceId; }
    public void setCameraDeviceId(String cameraDeviceId) { this.cameraDeviceId = cameraDeviceId; }
    public String getMicrophoneDeviceId() { return microphoneDeviceId; }
    public void setMicrophoneDeviceId(String microphoneDeviceId) { this.microphoneDeviceId = microphoneDeviceId; }
    public String getSpeakerDeviceId() { return speakerDeviceId; }
    public void setSpeakerDeviceId(String speakerDeviceId) { this.speakerDeviceId = speakerDeviceId; }
    public boolean isSpeakingCoachLive() { return speakingCoachLive; }
    public void setSpeakingCoachLive(boolean speakingCoachLive) { this.speakingCoachLive = speakingCoachLive; }
    public boolean isSpeakingCoachFillerWords() { return speakingCoachFillerWords; }
    public void setSpeakingCoachFillerWords(boolean speakingCoachFillerWords) { this.speakingCoachFillerWords = speakingCoachFillerWords; }
    public boolean isSpeakingCoachPaceTracking() { return speakingCoachPaceTracking; }
    public void setSpeakingCoachPaceTracking(boolean speakingCoachPaceTracking) { this.speakingCoachPaceTracking = speakingCoachPaceTracking; }
    public boolean isPrivacyShareRecruiter() { return privacyShareRecruiter; }
    public void setPrivacyShareRecruiter(boolean privacyShareRecruiter) { this.privacyShareRecruiter = privacyShareRecruiter; }
    public boolean isEmailNotificationsEnabled() { return emailNotificationsEnabled; }
    public void setEmailNotificationsEnabled(boolean emailNotificationsEnabled) { this.emailNotificationsEnabled = emailNotificationsEnabled; }
    public String getLanguageLocale() { return languageLocale; }
    public void setLanguageLocale(String languageLocale) { this.languageLocale = languageLocale; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
