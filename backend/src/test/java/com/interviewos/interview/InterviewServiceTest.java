package com.interviewos.interview;

import com.interviewos.interview.dto.CreateInterviewRequest;
import com.interviewos.interview.dto.InterviewSessionDto;
import com.interviewos.interview.entity.InterviewQuestion;
import com.interviewos.interview.entity.InterviewSession;
import com.interviewos.interview.repository.*;
import com.interviewos.interview.service.InterviewService;
import com.interviewos.job.repository.JobPostingRepository;
import com.interviewos.resume.repository.ResumeRepository;
import com.interviewos.user.entity.User;
import com.interviewos.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InterviewServiceTest {

    @Mock private InterviewSessionRepository sessionRepository;
    @Mock private InterviewQuestionRepository questionRepository;
    @Mock private InterviewAnswerRepository answerRepository;
    @Mock private InterviewScoreRepository scoreRepository;
    @Mock private InterviewFeedbackRepository feedbackRepository;
    @Mock private UserRepository userRepository;
    @Mock private ResumeRepository resumeRepository;
    @Mock private JobPostingRepository jobPostingRepository;

    private InterviewService interviewService;

    @BeforeEach
    void setUp() {
        interviewService = new InterviewService(
            sessionRepository,
            questionRepository,
            answerRepository,
            scoreRepository,
            feedbackRepository,
            userRepository,
            resumeRepository,
            jobPostingRepository
        );
    }

    @Test
    void createSession_InitializesSessionWithQuestionsAndReadyStatus() {
        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setId(userId);
        user.setEmail("test@interviewos.dev");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        InterviewSession savedMock = new InterviewSession();
        savedMock.setId(UUID.randomUUID());
        savedMock.setUser(user);
        savedMock.setTitle("System Architecture Simulation");
        savedMock.setInterviewType("TECHNICAL");
        savedMock.setStatus("READY");
        savedMock.setTotalQuestions(5);
        savedMock.setDurationMinutes(45);

        InterviewQuestion q1 = new InterviewQuestion();
        q1.setId(UUID.randomUUID());
        q1.setSession(savedMock);
        q1.setQuestionOrder(1);
        q1.setQuestionText("Explain the Java Memory Model");
        q1.setStatus("PENDING");
        savedMock.setQuestions(List.of(q1));

        when(sessionRepository.save(any(InterviewSession.class))).thenReturn(savedMock);
        when(sessionRepository.findByIdAndUserId(savedMock.getId(), userId)).thenReturn(Optional.of(savedMock));

        CreateInterviewRequest req = new CreateInterviewRequest(
            "System Architecture Simulation",
            "TECHNICAL",
            "BACKEND",
            "SENIOR",
            "HARD",
            "AUDIO_VIDEO",
            false,
            "AFTER_SESSION",
            null,
            null,
            5,
            45
        );

        InterviewSessionDto sessionDto = interviewService.createSession(userId, req);

        assertNotNull(sessionDto);
        assertEquals("READY", sessionDto.status());
        assertEquals("System Architecture Simulation", sessionDto.title());
        verify(questionRepository, times(1)).saveAll(any());
    }
}
