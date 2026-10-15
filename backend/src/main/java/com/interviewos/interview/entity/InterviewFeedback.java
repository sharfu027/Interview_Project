package com.interviewos.interview.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "interview_feedback")
public class InterviewFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_id", nullable = false)
    private InterviewAnswer answer;

    @Column(name = "concrete_improvement", columnDefinition = "TEXT")
    private String concreteImprovement;

    @Column(name = "sample_ideal_response", columnDefinition = "TEXT")
    private String sampleIdealResponse;

    @Column(name = "evaluated_at", nullable = false)
    private Instant evaluatedAt = Instant.now();

    public InterviewFeedback() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public InterviewAnswer getAnswer() { return answer; }
    public void setAnswer(InterviewAnswer answer) { this.answer = answer; }
    public String getConcreteImprovement() { return concreteImprovement; }
    public void setConcreteImprovement(String concreteImprovement) { this.concreteImprovement = concreteImprovement; }
    public String getSampleIdealResponse() { return sampleIdealResponse; }
    public void setSampleIdealResponse(String sampleIdealResponse) { this.sampleIdealResponse = sampleIdealResponse; }
    public Instant getEvaluatedAt() { return evaluatedAt; }
    public void setEvaluatedAt(Instant evaluatedAt) { this.evaluatedAt = evaluatedAt; }
}
