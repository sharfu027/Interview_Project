package com.interviewos.interview.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "interview_answers")
public class InterviewAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private InterviewQuestion question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private InterviewSession session;

    @Column(name = "answer_text", nullable = false, columnDefinition = "TEXT")
    private String answerText;

    @Column(name = "answer_duration_seconds")
    private int answerDurationSeconds = 0;

    @Column(precision = 5, scale = 1)
    private BigDecimal wpm = BigDecimal.ZERO;

    @Column(name = "filler_word_count")
    private int fillerWordCount = 0;

    @Column(name = "pause_count")
    private int pauseCount = 0;

    @Column(name = "audio_asset_url")
    private String audioAssetUrl;

    @Column(name = "submitted_at", nullable = false)
    private Instant submittedAt = Instant.now();

    @OneToOne(mappedBy = "answer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private InterviewFeedback feedback;

    @OneToMany(mappedBy = "answer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<InterviewScore> scores = new ArrayList<>();

    public InterviewAnswer() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public InterviewQuestion getQuestion() { return question; }
    public void setQuestion(InterviewQuestion question) { this.question = question; }
    public InterviewSession getSession() { return session; }
    public void setSession(InterviewSession session) { this.session = session; }
    public String getAnswerText() { return answerText; }
    public void setAnswerText(String answerText) { this.answerText = answerText; }
    public int getAnswerDurationSeconds() { return answerDurationSeconds; }
    public void setAnswerDurationSeconds(int answerDurationSeconds) { this.answerDurationSeconds = answerDurationSeconds; }
    public BigDecimal getWpm() { return wpm; }
    public void setWpm(BigDecimal wpm) { this.wpm = wpm; }
    public int getFillerWordCount() { return fillerWordCount; }
    public void setFillerWordCount(int fillerWordCount) { this.fillerWordCount = fillerWordCount; }
    public int getPauseCount() { return pauseCount; }
    public void setPauseCount(int pauseCount) { this.pauseCount = pauseCount; }
    public String getAudioAssetUrl() { return audioAssetUrl; }
    public void setAudioAssetUrl(String audioAssetUrl) { this.audioAssetUrl = audioAssetUrl; }
    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
    public InterviewFeedback getFeedback() { return feedback; }
    public void setFeedback(InterviewFeedback feedback) { this.feedback = feedback; }
    public List<InterviewScore> getScores() { return scores; }
    public void setScores(List<InterviewScore> scores) { this.scores = scores; }
}
