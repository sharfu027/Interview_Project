package com.interviewos.interview.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "interview_scores")
public class InterviewScore {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_id", nullable = false)
    private InterviewAnswer answer;

    @Column(nullable = false, length = 100)
    private String criterion; // TECHNICAL_CORRECTNESS, REASONING, COMPLETENESS, CLARITY, TRADE_OFFS

    @Column(nullable = false, precision = 4, scale = 2)
    private BigDecimal score;

    @Column(name = "max_score", nullable = false, precision = 4, scale = 2)
    private BigDecimal maxScore = BigDecimal.valueOf(10.0);

    @Column(name = "evaluator_notes", columnDefinition = "TEXT")
    private String evaluatorNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public InterviewScore() {}

    public InterviewScore(InterviewAnswer answer, String criterion, BigDecimal score, String evaluatorNotes) {
        this.answer = answer;
        this.criterion = criterion;
        this.score = score;
        this.evaluatorNotes = evaluatorNotes;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public InterviewAnswer getAnswer() { return answer; }
    public void setAnswer(InterviewAnswer answer) { this.answer = answer; }
    public String getCriterion() { return criterion; }
    public void setCriterion(String criterion) { this.criterion = criterion; }
    public BigDecimal getScore() { return score; }
    public void setScore(BigDecimal score) { this.score = score; }
    public BigDecimal getMaxScore() { return maxScore; }
    public void setMaxScore(BigDecimal maxScore) { this.maxScore = maxScore; }
    public String getEvaluatorNotes() { return evaluatorNotes; }
    public void setEvaluatorNotes(String evaluatorNotes) { this.evaluatorNotes = evaluatorNotes; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
