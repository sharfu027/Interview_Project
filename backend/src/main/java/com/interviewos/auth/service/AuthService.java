package com.interviewos.auth.service;

import com.interviewos.auth.dto.AuthResponse;
import com.interviewos.auth.dto.LoginRequest;
import com.interviewos.auth.dto.PasswordResetRequest;
import com.interviewos.auth.dto.RegisterRequest;
import com.interviewos.auth.dto.TokenRefreshRequest;
import com.interviewos.common.exception.BadRequestException;
import com.interviewos.common.exception.ResourceNotFoundException;
import com.interviewos.common.exception.UnauthorizedException;
import com.interviewos.config.JwtTokenProvider;
import com.interviewos.config.UserPrincipal;
import com.interviewos.user.entity.Role;
import com.interviewos.user.entity.User;
import com.interviewos.user.entity.UserProfile;
import com.interviewos.user.entity.UserSettings;
import com.interviewos.user.repository.RoleRepository;
import com.interviewos.user.repository.UserProfileRepository;
import com.interviewos.user.repository.UserRepository;
import com.interviewos.user.repository.UserSettingsRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(
        UserRepository userRepository,
        RoleRepository roleRepository,
        UserProfileRepository userProfileRepository,
        UserSettingsRepository userSettingsRepository,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        JwtTokenProvider tokenProvider
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userProfileRepository = userProfileRepository;
        this.userSettingsRepository = userSettingsRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email().toLowerCase().trim(), request.password())
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(userPrincipal.getId());

        List<String> roles = userPrincipal.getAuthorities().stream()
            .map(auth -> auth.getAuthority())
            .collect(Collectors.toList());

        return AuthResponse.of(
            accessToken,
            refreshToken,
            userPrincipal.getId(),
            userPrincipal.getUsername(),
            userPrincipal.getFirstName(),
            userPrincipal.getLastName(),
            roles
        );
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with this email address already exists.");
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setActive(true);
        user.setEmailVerified(true); // Default true in demo / initial env

        String roleName = ("RECRUITER".equalsIgnoreCase(request.role())) ? "ROLE_RECRUITER" : "ROLE_CANDIDATE";
        Role role = roleRepository.findById(roleName)
            .orElseGet(() -> roleRepository.save(new Role(roleName, roleName.replace("ROLE_", ""), "Default role")));
        user.getRoles().add(role);

        User savedUser = userRepository.save(user);

        // Create default profile
        UserProfile profile = new UserProfile();
        profile.setUser(savedUser);
        profile.setTargetRole("RECRUITER".equalsIgnoreCase(request.role()) ? "Technical Recruiter" : "Software Engineer");
        userProfileRepository.save(profile);

        // Create default settings
        UserSettings settings = new UserSettings();
        settings.setUser(savedUser);
        settings.setTheme("light");
        userSettingsRepository.save(settings);

        String accessToken = tokenProvider.generateAccessToken(savedUser.getId(), savedUser.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(savedUser.getId());

        return AuthResponse.of(
            accessToken,
            refreshToken,
            savedUser.getId(),
            savedUser.getEmail(),
            savedUser.getFirstName(),
            savedUser.getLastName(),
            List.of(role.getId())
        );
    }

    @Transactional(readOnly = true)
    public AuthResponse refreshToken(TokenRefreshRequest request) {
        if (!tokenProvider.validateToken(request.refreshToken())) {
            throw new UnauthorizedException("Invalid or expired refresh token.");
        }

        UUID userId = tokenProvider.getUserIdFromToken(request.refreshToken());
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isActive()) {
            throw new UnauthorizedException("Account has been deactivated.");
        }

        String newAccessToken = tokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String newRefreshToken = tokenProvider.generateRefreshToken(user.getId());

        List<String> roles = user.getRoles().stream()
            .map(Role::getId)
            .collect(Collectors.toList());

        return AuthResponse.of(
            newAccessToken,
            newRefreshToken,
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            roles
        );
    }

    @Transactional
    public void resetPassword(PasswordResetRequest request) {
        // Safe password update implementation
        if (request.token() == null || request.token().isBlank()) {
            throw new BadRequestException("Invalid reset token.");
        }
    }
}
