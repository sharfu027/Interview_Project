package com.interviewos.speech.entity;

import com.interviewos.interview.entity.InterviewQuestion;
import com.interviewos.interview.entity.InterviewSession;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "speech_metrics")
public class SpeechMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private InterviewSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private InterviewQuestion question;

    @Column(name = "words_per_minute", nullable = false, precision = 5, scale = 1)
    private BigDecimal wordsPerMinute = BigDecimal.valueOf(135.0);

    @Column(name = "total_words", nullable = false)
    private int totalWords = 0;

    @Column(name = "filler_word_count", nullable = false)
    private int fillerWordCount = 0;

    @Column(name = "filler_words_breakdown", columnDefinition = "jsonb")
    private String fillerWordsBreakdown = "{}";

    @Column(name = "pause_count", nullable = false)
    private int pauseCount = 0;

    @Column(name = "long_pause_count", nullable = false)
    private int longPauseCount = 0;

    @Column(name = "speaking_duration_seconds", nullable = false, precision = 8, scale = 2)
    private BigDecimal speakingDurationSeconds = BigDecimal.ZERO;

    @Column(name = "clarity_score", precision = 4, scale = 2)
    private BigDecimal clarityScore = BigDecimal.valueOf(8.5);

    @Column(name = "structure_quality", length = 50)
    private String structureQuality = "GOOD"; // EXCELLENT, GOOD, RAMBLING, INCOMPLETE

    @Column(name = "feedback_notes", columnDefinition = "TEXT")
    private String feedbackNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public SpeechMetric() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public InterviewSession getSession() { return session; }
    public void setSession(InterviewSession session) { this.session = session; }
    public InterviewQuestion getQuestion() { return question; }
    public void setQuestion(InterviewQuestion question) { this.question = question; }
    public BigDecimal getWordsPerMinute() { return wordsPerMinute; }
    public void setWordsPerMinute(BigDecimal wordsPerMinute) { this.wordsPerMinute = wordsPerMinute; }
    public int getTotalWords() { return totalWords; }
    public void setTotalWords(int totalWords) { this.totalWords = totalWords; }
    public int getFillerWordCount() { return fillerWordCount; }
    public void setFillerWordCount(int fillerWordCount) { this.fillerWordCount = fillerWordCount; }
    public String getFillerWordsBreakdown() { return fillerWordsBreakdown; }
    public void setFillerWordsBreakdown(String fillerWordsBreakdown) { this.fillerWordsBreakdown = fillerWordsBreakdown; }
    public int getPauseCount() { return pauseCount; }
    public void setPauseCount(int pauseCount) { this.pauseCount = pauseCount; }
    public int getLongPauseCount() { return longPauseCount; }
    public void setLongPauseCount(int longPauseCount) { this.longPauseCount = longPauseCount; }
    public BigDecimal getSpeakingDurationSeconds() { return speakingDurationSeconds; }
    public void setSpeakingDurationSeconds(BigDecimal speakingDurationSeconds) { this.speakingDurationSeconds = speakingDurationSeconds; }
    public BigDecimal getClarityScore() { return clarityScore; }
    public void setClarityScore(BigDecimal clarityScore) { this.clarityScore = clarityScore; }
    public String getStructureQuality() { return structureQuality; }
    public void setStructureQuality(String structureQuality) { this.structureQuality = structureQuality; }
    public String getFeedbackNotes() { return feedbackNotes; }
    public void setFeedbackNotes(String feedbackNotes) { this.feedbackNotes = feedbackNotes; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
