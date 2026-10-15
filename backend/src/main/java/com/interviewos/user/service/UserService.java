package com.interviewos.user.service;

import com.interviewos.common.exception.ResourceNotFoundException;
import com.interviewos.user.dto.UserProfileDto;
import com.interviewos.user.dto.UserSettingsDto;
import com.interviewos.user.entity.User;
import com.interviewos.user.entity.UserProfile;
import com.interviewos.user.entity.UserSettings;
import com.interviewos.user.repository.UserProfileRepository;
import com.interviewos.user.repository.UserRepository;
import com.interviewos.user.repository.UserSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserSettingsRepository userSettingsRepository;

    public UserService(
        UserRepository userRepository,
        UserProfileRepository userProfileRepository,
        UserSettingsRepository userSettingsRepository
    ) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.userSettingsRepository = userSettingsRepository;
    }

    @Transactional(readOnly = true)
    public UserProfileDto getProfile(UUID userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        UserProfile profile = userProfileRepository.findByUserId(userId)
            .orElseGet(() -> {
                UserProfile p = new UserProfile();
                p.setUser(user);
                return userProfileRepository.save(p);
            });

        return new UserProfileDto(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            profile.getHeadline(),
            profile.getTargetRole(),
            profile.getExperienceLevel(),
            profile.getLocation(),
            profile.getBio(),
            profile.getGithubUrl(),
            profile.getLinkedinUrl(),
            profile.getPortfolioUrl(),
            profile.getAvatarUrl()
        );
    }

    @Transactional
    public UserProfileDto updateProfile(UUID userId, UserProfileDto dto) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        UserProfile profile = userProfileRepository.findByUserId(userId)
            .orElseGet(() -> {
                UserProfile p = new UserProfile();
                p.setUser(user);
                return p;
            });

        profile.setHeadline(dto.headline());
        profile.setTargetRole(dto.targetRole());
        profile.setExperienceLevel(dto.experienceLevel() != null ? dto.experienceLevel() : "MID");
        profile.setLocation(dto.location());
        profile.setBio(dto.bio());
        profile.setGithubUrl(dto.githubUrl());
        profile.setLinkedinUrl(dto.linkedinUrl());
        profile.setPortfolioUrl(dto.portfolioUrl());
        profile.setAvatarUrl(dto.avatarUrl());

        userProfileRepository.save(profile);
        return getProfile(userId);
    }

    @Transactional(readOnly = true)
    public UserSettingsDto getSettings(UUID userId) {
        UserSettings settings = userSettingsRepository.findByUserId(userId)
            .orElseGet(() -> {
                User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                UserSettings s = new UserSettings();
                s.setUser(user);
                return userSettingsRepository.save(s);
            });

        return new UserSettingsDto(
            settings.getTheme(),
            settings.getCameraDeviceId(),
            settings.getMicrophoneDeviceId(),
            settings.getSpeakerDeviceId(),
            settings.isSpeakingCoachLive(),
            settings.isSpeakingCoachFillerWords(),
            settings.isSpeakingCoachPaceTracking(),
            settings.isPrivacyShareRecruiter(),
            settings.isEmailNotificationsEnabled(),
            settings.getLanguageLocale()
        );
    }

    @Transactional
    public UserSettingsDto updateSettings(UUID userId, UserSettingsDto dto) {
        UserSettings settings = userSettingsRepository.findByUserId(userId)
            .orElseGet(() -> {
                User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                UserSettings s = new UserSettings();
                s.setUser(user);
                return s;
            });

        if (dto.theme() != null) settings.setTheme(dto.theme());
        settings.setCameraDeviceId(dto.cameraDeviceId());
        settings.setMicrophoneDeviceId(dto.microphoneDeviceId());
        settings.setSpeakerDeviceId(dto.speakerDeviceId());
        settings.setSpeakingCoachLive(dto.speakingCoachLive());
        settings.setSpeakingCoachFillerWords(dto.speakingCoachFillerWords());
        settings.setSpeakingCoachPaceTracking(dto.speakingCoachPaceTracking());
        settings.setPrivacyShareRecruiter(dto.privacyShareRecruiter());
        settings.setEmailNotificationsEnabled(dto.emailNotificationsEnabled());
        if (dto.languageLocale() != null) settings.setLanguageLocale(dto.languageLocale());

        userSettingsRepository.save(settings);
        return getSettings(userId);
    }
}
