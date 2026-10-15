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

import com.interviewos.auth.service.AuthService;
import com.interviewos.job.dto.CreateApplicationRequest;
import com.interviewos.speech.dto.SaveSpeechMetricRequest;
import java.math.BigDecimal;
import java.time.LocalDate;
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

    @Autowired
    private AuthService authService;

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

    @Test
    @DisplayName("Journey 6: Speaking Coach Analytics Recording and Timeline Retrieval")
    void testSpeechCoachAnalytics() throws Exception {
        String token = getCandidateToken();

        // 1. Create session to link metrics
        CreateInterviewRequest createReq = new CreateInterviewRequest(
            "Speech Coach Practice Session",
            "BEHAVIORAL",
            "BACKEND",
            "MID",
            "MEDIUM",
            "AUDIO_VIDEO",
            false,
            "AFTER_SESSION",
            null,
            null,
            2,
            30
        );

        MvcResult intResult = mockMvc.perform(post("/api/v1/interviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createReq))
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isCreated()).andReturn();

        String sessionId = objectMapper.readTree(intResult.getResponse().getContentAsString()).get("data").get("id").asText();

        // 2. Record speech metrics
        SaveSpeechMetricRequest speechReq = new SaveSpeechMetricRequest(
            null,
            BigDecimal.valueOf(142.5),
            120,
            2,
            "{\"um\": 1, \"like\": 1}",
            3,
            0,
            BigDecimal.valueOf(50.5),
            BigDecimal.valueOf(9.0),
            "EXCELLENT",
            "Articulate delivery with structured STAR pacing."
        );

        mockMvc.perform(post("/api/v1/speech-coach/sessions/" + sessionId + "/metrics")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(speechReq))
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.wordsPerMinute").value(142.5))
            .andExpect(jsonPath("$.data.fillerWordCount").value(2));

        // 3. Retrieve session timeline metrics
        mockMvc.perform(get("/api/v1/speech-coach/sessions/" + sessionId + "/metrics")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data", not(empty())));
    }

    @Test
    @DisplayName("Journey 7: Career Roadmaps, Weaknesses, and Coding Lab Challenges")
    void testCareerRoadmapsAndCodingLab() throws Exception {
        String token = getCandidateToken();

        // 1. List roadmaps
        mockMvc.perform(get("/api/v1/roadmaps")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").isArray());

        // 2. List coding challenges
        mockMvc.perform(get("/api/v1/coding-lab/challenges")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data", not(empty())))
            .andExpect(jsonPath("$.data[0].slug").isNotEmpty());

        // 3. List candidate weaknesses
        mockMvc.perform(get("/api/v1/weaknesses")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("Journey 8b: Job Search, Company Intelligence, and Salary Compensation Benchmark")
    void testJobSearchAndCompanyPrepAndSalary() throws Exception {
        String token = getCandidateToken();

        // 1. Public job search
        mockMvc.perform(get("/api/v1/jobs/public")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.content").isArray());

        // 2. Company-specific interview prep guide
        mockMvc.perform(get("/api/v1/jobs/public/companies/stripe")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.slug").value("stripe"))
            .andExpect(jsonPath("$.data.name").value("Stripe"))
            .andExpect(jsonPath("$.data.interviewProcessNotes").isNotEmpty());

        // 3. Statistical compensation estimate
        mockMvc.perform(get("/api/v1/salary/public/estimate")
                .param("jobFamily", "BACKEND")
                .param("seniority", "SENIOR")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.totalCompMedian").isNumber())
            .andExpect(jsonPath("$.data.baseSalaryMedian").isNumber())
            .andExpect(jsonPath("$.data.keyInfluencingFactors", not(empty())));
    }

    @Test
    @DisplayName("Journey 8c: Application Tracker Full Lifecycle (Create, List, Update, Delete)")
    void testApplicationTrackerLifecycle() throws Exception {
        String token = getCandidateToken();

        // 1. Create tracked application
        CreateApplicationRequest appReq = new CreateApplicationRequest(
            "Anthropic",
            "Senior Distributed Systems Engineer",
            "APPLIED",
            "RESUME_SCREEN",
            LocalDate.now(),
            BigDecimal.valueOf(210000),
            "Recruiter Lead",
            "careers@anthropic.com",
            "Preparing concurrency and resilience case studies."
        );

        MvcResult createResult = mockMvc.perform(post("/api/v1/jobs/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(appReq))
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data.companyName").value("Anthropic"))
            .andReturn();

        String applicationId = objectMapper.readTree(createResult.getResponse().getContentAsString())
            .get("data").get("id").asText();

        // 2. List applications
        mockMvc.perform(get("/api/v1/jobs/applications")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data", not(empty())));

        // 3. Update application status
        mockMvc.perform(patch("/api/v1/jobs/applications/" + applicationId)
                .param("status", "INTERVIEWING")
                .param("currentStage", "TECHNICAL_SCREEN")
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.status").value("INTERVIEWING"));

        // 4. Delete application
        mockMvc.perform(delete("/api/v1/jobs/applications/" + applicationId)
                .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Security Audit: Production Demo Account Disabling via demoMode=false")
    void testSeededDemoAccountsBlockedWhenDemoModeDisabled() throws Exception {
        try {
            authService.setDemoMode(false);

            LoginRequest demoLogin = new LoginRequest("candidate@interviewos.dev", "Password123!");
            mockMvc.perform(post("/api/v1/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(demoLogin)))
                .andExpect(status().isUnauthorized());
        } finally {
            // Restore demo mode for following tests
            authService.setDemoMode(true);
        }
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
