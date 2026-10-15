package com.interviewos.interview.entity;

import com.interviewos.job.entity.JobPosting;
import com.interviewos.resume.entity.Resume;
import com.interviewos.user.entity.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "interview_sessions")
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    private Resume resume;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id")
    private JobPosting job;

    @Column(nullable = false)
    private String title;

    @Column(name = "interview_type", nullable = false, length = 50)
    private String interviewType; // HR, TECHNICAL, SYSTEM_DESIGN, CODING, BEHAVIORAL, RESUME_GRILLING, ARCHITECT, MANAGER

    @Column(name = "job_family", nullable = false, length = 100)
    private String jobFamily = "BACKEND";

    @Column(nullable = false, length = 50)
    private String seniority = "MID";

    @Column(nullable = false, length = 50)
    private String difficulty = "MEDIUM";

    @Column(nullable = false, length = 50)
    private String mode = "AUDIO_VIDEO"; // TEXT, AUDIO, AUDIO_VIDEO, CODING

    @Column(name = "is_strict_simulation", nullable = false)
    private boolean isStrictSimulation = false;

    @Column(name = "feedback_timing", nullable = false, length = 50)
    private String feedbackTiming = "AFTER_SESSION"; // REAL_TIME, AFTER_QUESTION, AFTER_SESSION

    @Column(nullable = false, length = 50)
    private String status = "CREATED"; // CREATED, READY, IN_PROGRESS, AWAITING_ANSWER, PROCESSING_ANSWER, AWAITING_FOLLOWUP, COMPLETED

    @Column(name = "current_question_index", nullable = false)
    private int currentQuestionIndex = 0;

    @Column(name = "total_questions", nullable = false)
    private int totalQuestions = 5;

    @Column(name = "duration_minutes", nullable = false)
    private int durationMinutes = 45;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "ended_at")
    private Instant endedAt;

    @Column(name = "overall_score", precision = 5, scale = 2)
    private BigDecimal overallScore;

    @Column(name = "summary_feedback", columnDefinition = "TEXT")
    private String summaryFeedback;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("questionOrder ASC")
    private List<InterviewQuestion> questions = new ArrayList<>();

    public InterviewSession() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }
    public JobPosting getJob() { return job; }
    public void setJob(JobPosting job) { this.job = job; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getInterviewType() { return interviewType; }
    public void setInterviewType(String interviewType) { this.interviewType = interviewType; }
    public String getJobFamily() { return jobFamily; }
    public void setJobFamily(String jobFamily) { this.jobFamily = jobFamily; }
    public String getSeniority() { return seniority; }
    public void setSeniority(String seniority) { this.seniority = seniority; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public boolean isStrictSimulation() { return isStrictSimulation; }
    public void setStrictSimulation(boolean strictSimulation) { isStrictSimulation = strictSimulation; }
    public String getFeedbackTiming() { return feedbackTiming; }
    public void setFeedbackTiming(String feedbackTiming) { this.feedbackTiming = feedbackTiming; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public int getCurrentQuestionIndex() { return currentQuestionIndex; }
    public void setCurrentQuestionIndex(int currentQuestionIndex) { this.currentQuestionIndex = currentQuestionIndex; }
    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }
    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }
    public Instant getEndedAt() { return endedAt; }
    public void setEndedAt(Instant endedAt) { this.endedAt = endedAt; }
    public BigDecimal getOverallScore() { return overallScore; }
    public void setOverallScore(BigDecimal overallScore) { this.overallScore = overallScore; }
    public String getSummaryFeedback() { return summaryFeedback; }
    public void setSummaryFeedback(String summaryFeedback) { this.summaryFeedback = summaryFeedback; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public List<InterviewQuestion> getQuestions() { return questions; }
    public void setQuestions(List<InterviewQuestion> questions) { this.questions = questions; }
}
