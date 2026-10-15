package com.interviewos.auth;

import com.interviewos.auth.dto.AuthResponse;
import com.interviewos.auth.dto.RegisterRequest;
import com.interviewos.auth.service.AuthService;
import com.interviewos.common.exception.BadRequestException;
import com.interviewos.config.JwtTokenProvider;
import com.interviewos.user.entity.Role;
import com.interviewos.user.entity.User;
import com.interviewos.user.repository.RoleRepository;
import com.interviewos.user.repository.UserProfileRepository;
import com.interviewos.user.repository.UserRepository;
import com.interviewos.user.repository.UserSettingsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private UserProfileRepository userProfileRepository;
    @Mock private UserSettingsRepository userSettingsRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;

    private JwtTokenProvider tokenProvider;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        // Instantiate real token provider to avoid Java 25 bytecode modification limitations
        tokenProvider = new JwtTokenProvider(
            "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970",
            3600000L,
            604800000L
        );

        authService = new AuthService(
            userRepository,
            roleRepository,
            userProfileRepository,
            userSettingsRepository,
            passwordEncoder,
            authenticationManager,
            tokenProvider
        );
    }

    @Test
    void register_WhenEmailAlreadyExists_ThrowsBadRequestException() {
        RegisterRequest req = new RegisterRequest("test@interviewos.dev", "Password123!", "John", "Doe", "CANDIDATE");
        when(userRepository.existsByEmail("test@interviewos.dev")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any());
    }

    @Test
    void register_WhenValidRequest_CreatesUserAndReturnsTokens() {
        RegisterRequest req = new RegisterRequest("newuser@interviewos.dev", "Password123!", "Jane", "Doe", "CANDIDATE");
        when(userRepository.existsByEmail("newuser@interviewos.dev")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashedPassword");
        when(roleRepository.findById("ROLE_CANDIDATE")).thenReturn(Optional.of(new Role("ROLE_CANDIDATE", "Candidate", "Desc")));

        User mockUser = new User();
        mockUser.setId(UUID.randomUUID());
        mockUser.setEmail("newuser@interviewos.dev");
        mockUser.setFirstName("Jane");
        mockUser.setLastName("Doe");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        AuthResponse response = authService.register(req);

        assertNotNull(response);
        assertNotNull(response.accessToken());
        assertNotNull(response.refreshToken());
        assertEquals("newuser@interviewos.dev", response.email());
        verify(userProfileRepository, times(1)).save(any());
        verify(userSettingsRepository, times(1)).save(any());
    }

    @Test
    void login_WhenDemoModeDisabledAndDemoAccount_ThrowsUnauthorizedException() {
        authService.setDemoMode(false);
        com.interviewos.auth.dto.LoginRequest req = new com.interviewos.auth.dto.LoginRequest("candidate@interviewos.dev", "Password123!");
        assertThrows(com.interviewos.common.exception.UnauthorizedException.class, () -> authService.login(req));
        verify(authenticationManager, never()).authenticate(any());
    }
}
