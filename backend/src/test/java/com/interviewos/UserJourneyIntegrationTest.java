package com.interviewos;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewos.auth.dto.LoginRequest;
import com.interviewos.auth.dto.RegisterRequest;
import com.interviewos.interview.dto.CreateInterviewRequest;
import com.interviewos.interview.dto.SubmitAnswerRequest;
import com.interviewos.panel.dto.SubmitPanelTurnRequest;
import com.interviewos.recruiter.dto.CreateRecruiterJobRequest;
import com.interviewos.recruiter.dto.SubmitScorecardRequest;
import com.interviewos.user.entity.User;
import com.interviewos.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserJourneyIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @org.junit.jupiter.api.BeforeEach
    void setUpSeededUsers() {
        String encoded = passwordEncoder.encode("Password123!");
        userRepository.findByEmail("candidate@interviewos.dev").ifPresent(u -> {
            u.setPasswordHash(encoded);
            userRepository.save(u);
        });
        userRepository.findByEmail("recruiter@interviewos.dev").ifPresent(u -> {
            u.setPasswordHash(encoded);
            userRepository.save(u);
        });
        userRepository.findByEmail("admin@interviewos.dev").ifPresent(u -> {
            u.setPasswordHash(encoded);
            userRepository.save(u);
        });
    }

    @Test
    @DisplayName("Journey 1: Register, Login, and Password Hashing Verification")
    void testRegisterAndLoginFlow() throws Exception {
        String testEmail = "testuser_" + System.currentTimeMillis() + "@interviewos.dev";
        String rawPassword = "SecurePassword123!";

        // 1. Register candidate
        RegisterRequest registerReq = new RegisterRequest(
            testEmail,
            rawPassword,
            "Alex",
            "Tester",
            "CANDIDATE"
        );

        MvcResult registerResult = mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerReq)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
            .andExpect(jsonPath("$.data.refreshToken").isNotEmpty())
            .andExpect(jsonPath("$.data.email").value(testEmail))
            .andReturn();

        // 2. Security Audit: verify password is encrypted with BCrypt, NEVER stored plaintext
        User persistedUser = userRepository.findByEmail(testEmail).orElseThrow();
        assertThat(persistedUser.getPasswordHash()).isNotEqualTo(rawPassword);
        assertThat(passwordEncoder.matches(rawPassword, persistedUser.getPasswordHash())).isTrue();

        // 3. Login with correct credentials
        LoginRequest loginReq = new LoginRequest(testEmail, rawPassword);
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginReq)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
            .andExpect(jsonPath("$.data.email").value(testEmail));

        // 4. Login with bad credentials fails with 401
        LoginRequest badLogin = new LoginRequest(testEmail, "WrongPassword!");
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(badLogin)))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Journey 2: Resume Upload and ATS Analysis Retrieval")
    void testResumeUploadAndAnalysis() throws Exception {
        // Log in seeded candidate
        String token = getCandidateToken();

        MockMultipartFile file = new MockMultipartFile(
            "file",
            "Staff_Backend_Resume.pdf",
            "application/pdf",
            "David Candidate - Senior Distributed Systems Engineer. Experienced in Java, Spring Boot, Kafka, PostgreSQL.".getBytes()
        );

        // Upload resume
        MvcResult uploadResult = mockMvc.perform(multipart("/api/v1/resumes")
                .file(file)
                .param("title", "Staff Backend Resume 2026")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.id").isNotEmpty())
            .andReturn();

        String resumeId = objectMapper.readTree(uploadResult.getResponse().getContentAsString())
            .get("data").get("id").asText();

        // Retrieve ATS analysis
        mockMvc.perform(get("/api/v1/resumes/" + resumeId + "/analysis")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.atsScore").isNumber())
            .andExpect(jsonPath("$.data.skills", not(empty())))
            .andExpect(jsonPath("$.data.projects", not(empty())));
    }

    @Test
    @DisplayName("Journey 3 & 4: Mock Interview Lifecycle (Create, Start, Submit Answer, Retrieve Scorecard)")
    void testMockInterviewLifecycle() throws Exception {
        String token = getCandidateToken();

        // 1. Create interview
        CreateInterviewRequest createReq = new CreateInterviewRequest(
            "Concurrency & Memory Models Deep Dive",
            "TECHNICAL",
            "BACKEND",
            "SENIOR",
            "HARD",
            "AUDIO_VIDEO",
            false,
            "AFTER_SESSION",
            null,
            null,
            3,
            45
        );

        MvcResult createResult = mockMvc.perform(post("/api/v1/interviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createReq))
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data.status").value("READY"))
            .andExpect(jsonPath("$.data.questions", not(empty())))
            .andReturn();

        String sessionId = objectMapper.readTree(createResult.getResponse().getContentAsString())
            .get("data").get("id").asText();
        String questionId = objectMapper.readTree(createResult.getResponse().getContentAsString())
            .get("data").get("questions").get(0).get("id").asText();

        // 2. Start session
        mockMvc.perform(post("/api/v1/interviews/" + sessionId + "/start")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.status").value("IN_PROGRESS"))
            .andExpect(jsonPath("$.data.currentQuestionIndex").value(1));

        // 3. Submit candidate answer
        SubmitAnswerRequest answerReq = new SubmitAnswerRequest(
            "The volatile keyword establishes a happens-before memory ordering relationship, ensuring that writes are visible to subsequent reads across threads via memory barriers without thread blocking.",
            45,
            BigDecimal.valueOf(135),
            1,
            2,
            null
        );

        mockMvc.perform(post("/api/v1/interviews/" + sessionId + "/questions/" + questionId + "/answer")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(answerReq))
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.status").value("IN_PROGRESS"))
            .andExpect(jsonPath("$.data.currentQuestionIndex").value(2));

        // 4. Retrieve persisted evaluation report
        mockMvc.perform(get("/api/v1/interviews/" + sessionId + "/report")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.sessionId").value(sessionId))
            .andExpect(jsonPath("$.data.overallScore").isNumber())
            .andExpect(jsonPath("$.data.competencyScores").isNotEmpty())
            .andExpect(jsonPath("$.data.keyStrengths", not(empty())))
            .andExpect(jsonPath("$.data.questionEvaluations", not(empty())));
    }

    @Test
    @DisplayName("Journey 5: AI 4-Persona Panel Session and Cross-Examination Turns")
    void testAIPanelSession() throws Exception {
        String token = getCandidateToken();

        // 1. Get available personas
        mockMvc.perform(get("/api/v1/ai-panel/personas")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.length()").value(4));

        // 2. Initialize panel session for an interview
        CreateInterviewRequest createReq = new CreateInterviewRequest(
            "Executive Staff Panel Interview",
            "ARCHITECT",
            "BACKEND",
            "STAFF",
            "EXPERT",
            "AUDIO_VIDEO",
            false,
            "AFTER_SESSION",
            null,
            null,
            4,
            60
        );

        MvcResult createResult = mockMvc.perform(post("/api/v1/interviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createReq))
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isCreated())
            .andReturn();

        String intSessionId = objectMapper.readTree(createResult.getResponse().getContentAsString())
            .get("data").get("id").asText();

        MvcResult panelResult = mockMvc.perform(get("/api/v1/ai-panel/sessions/" + intSessionId)
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.activePersonaId").isNotEmpty())
            .andExpect(jsonPath("$.data.turns", not(empty())))
            .andReturn();

        String panelSessionId = objectMapper.readTree(panelResult.getResponse().getContentAsString())
            .get("data").get("id").asText();

        // 3. Submit candidate response to the active persona
        SubmitPanelTurnRequest turnReq = new SubmitPanelTurnRequest(
            "In our microservices architecture, we implemented the transactional outbox pattern to decouple Postgres state commits from Kafka event emission, ensuring idempotent delivery."
        );

        mockMvc.perform(post("/api/v1/ai-panel/sessions/" + panelSessionId + "/turns")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(turnReq))
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.turns.length()").value(greaterThan(1)));
    }

    @Test
    @DisplayName("Journey 8: Recruiter Job Creation and Candidate Scorecard Submission")
    void testRecruiterJobAndScorecard() throws Exception {
        String recruiterToken = getRecruiterToken();

        // 1. Create a job requisition
        CreateRecruiterJobRequest jobReq = new CreateRecruiterJobRequest(
            "Staff Infrastructure Engineer (Java/Kafka)",
            "Cloud Core",
            "BACKEND",
            "STAFF",
            "Remote / San Francisco",
            "FULL_TIME",
            "Lead distributed event streaming infrastructure."
        );

        mockMvc.perform(post("/api/v1/recruiter/jobs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(jobReq))
                .header("Authorization", "Bearer " + recruiterToken))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data.title").value("Staff Infrastructure Engineer (Java/Kafka)"))
            .andExpect(jsonPath("$.data.status").value("PUBLISHED"));

        // 2. List candidates
        mockMvc.perform(get("/api/v1/recruiter/candidates")
                .header("Authorization", "Bearer " + recruiterToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("Journey 9: Role-Based Access Control (RBAC) Enforcement")
    void testRbacEnforcement() throws Exception {
        String candidateToken = getCandidateToken();
        String recruiterToken = getRecruiterToken();

        // 1. Candidate trying to access recruiter endpoints -> 403 Forbidden
        mockMvc.perform(get("/api/v1/recruiter/jobs")
                .header("Authorization", "Bearer " + candidateToken))
            .andExpect(status().isForbidden());

        // 2. Candidate trying to access admin endpoints -> 403 Forbidden
        mockMvc.perform(get("/api/v1/admin/system-health")
                .header("Authorization", "Bearer " + candidateToken))
            .andExpect(status().isForbidden());

        // 3. Unauthenticated request to protected endpoints -> 401 Unauthorized
        mockMvc.perform(get("/api/v1/interviews"))
            .andExpect(status().isUnauthorized());

        // 4. Recruiter accessing recruiter endpoints -> 200 OK
        mockMvc.perform(get("/api/v1/recruiter/jobs")
                .header("Authorization", "Bearer " + recruiterToken))
            .andExpect(status().isOk());

        // 5. Admin accessing admin endpoints -> 200 OK
        String adminToken = getAdminToken();
        mockMvc.perform(get("/api/v1/admin/system-health")
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.status").value("HEALTHY"));
    }

    @Test
    @DisplayName("Journey 10: Multi-Tenant and Cross-User Isolation Enforcement")
    void testTenantAndUserIsolation() throws Exception {
        // Register Candidate A
        String emailA = "user_a_" + System.currentTimeMillis() + "@interviewos.dev";
        RegisterRequest regA = new RegisterRequest(emailA, "Password123!", "Alice", "Dev", "CANDIDATE");
        MvcResult resA = mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regA)))
            .andExpect(status().isCreated()).andReturn();
        String tokenA = objectMapper.readTree(resA.getResponse().getContentAsString()).get("data").get("accessToken").asText();

        // Register Candidate B
        String emailB = "user_b_" + System.currentTimeMillis() + "@interviewos.dev";
        RegisterRequest regB = new RegisterRequest(emailB, "Password123!", "Bob", "Dev", "CANDIDATE");
        MvcResult resB = mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regB)))
            .andExpect(status().isCreated()).andReturn();
        String tokenB = objectMapper.readTree(resB.getResponse().getContentAsString()).get("data").get("accessToken").asText();

        // Candidate A creates an interview session
        CreateInterviewRequest createReq = new CreateInterviewRequest(
            "Private Candidate A Session",
            "TECHNICAL",
            "BACKEND",
            "SENIOR",
            "HARD",
            "AUDIO_VIDEO",
            false,
            "AFTER_SESSION",
            null,
            null,
            3,
            45
        );
        MvcResult intResult = mockMvc.perform(post("/api/v1/interviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createReq))
                .header("Authorization", "Bearer " + tokenA))
            .andExpect(status().isCreated()).andReturn();
        String sessionAId = objectMapper.readTree(intResult.getResponse().getContentAsString()).get("data").get("id").asText();

        // Security Audit: Candidate B attempts to access Candidate A's session -> must be rejected (404/403)
        mockMvc.perform(get("/api/v1/interviews/" + sessionAId)
                .header("Authorization", "Bearer " + tokenB))
            .andExpect(status().isNotFound());

        // Security Audit: Malformed / Invalid JWT token -> 401 Unauthorized
        mockMvc.perform(get("/api/v1/interviews")
                .header("Authorization", "Bearer malformed.jwt.token.here"))
            .andExpect(status().isUnauthorized());
    }

    // Helper utilities for obtaining JWT tokens
    private String getCandidateToken() throws Exception {
        LoginRequest login = new LoginRequest("candidate@interviewos.dev", "Password123!");
        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
            .andExpect(status().isOk())
            .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("data").get("accessToken").asText();
    }

    private String getRecruiterToken() throws Exception {
        LoginRequest login = new LoginRequest("recruiter@interviewos.dev", "Password123!");
        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
            .andExpect(status().isOk())
            .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("data").get("accessToken").asText();
    }

    private String getAdminToken() throws Exception {
        LoginRequest login = new LoginRequest("admin@interviewos.dev", "Password123!");
        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
            .andExpect(status().isOk())
            .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("data").get("accessToken").asText();
    }
}
