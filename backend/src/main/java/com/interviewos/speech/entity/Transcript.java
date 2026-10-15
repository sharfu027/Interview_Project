package com.interviewos.speech.entity;

import com.interviewos.interview.entity.InterviewSession;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "transcripts")
public class Transcript {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private InterviewSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recording_id")
    private RecordingAsset recording;

    @Column(nullable = false, length = 50)
    private String status = "COMPLETED";

    @Column(length = 10)
    private String language = "en-US";

    @Column(name = "confidence_score", precision = 4, scale = 3)
    private BigDecimal confidenceScore = BigDecimal.valueOf(0.965);

    @Column(name = "full_text", nullable = false, columnDefinition = "TEXT")
    private String fullText;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Transcript() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public InterviewSession getSession() { return session; }
    public void setSession(InterviewSession session) { this.session = session; }
    public RecordingAsset getRecording() { return recording; }
    public void setRecording(RecordingAsset recording) { this.recording = recording; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public BigDecimal getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(BigDecimal confidenceScore) { this.confidenceScore = confidenceScore; }
    public String getFullText() { return fullText; }
    public void setFullText(String fullText) { this.fullText = fullText; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
