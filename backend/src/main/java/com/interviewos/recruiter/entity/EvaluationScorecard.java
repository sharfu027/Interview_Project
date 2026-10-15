package com.interviewos.recruiter.entity;

import com.interviewos.user.entity.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "evaluation_scorecards")
public class EvaluationScorecard {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_link_id", nullable = false)
    private RecruiterCandidateLink candidateLink;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interviewer_user_id", nullable = false)
    private User interviewer;

    @Column(nullable = false, length = 50)
    private String recommendation = "STRONG_HIRE"; // STRONG_HIRE, HIRE, NO_HIRE, STRONG_NO_HIRE

    @Column(name = "overall_score", nullable = false, precision = 4, scale = 2)
    private BigDecimal overallScore = BigDecimal.valueOf(9.0);

    @Column(name = "general_notes", columnDefinition = "TEXT")
    private String generalNotes;

    @Column(name = "submitted_at", nullable = false)
    private Instant submittedAt = Instant.now();

    public EvaluationScorecard() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public RecruiterCandidateLink getCandidateLink() { return candidateLink; }
    public void setCandidateLink(RecruiterCandidateLink candidateLink) { this.candidateLink = candidateLink; }
    public User getInterviewer() { return interviewer; }
    public void setInterviewer(User interviewer) { this.interviewer = interviewer; }
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
    public BigDecimal getOverallScore() { return overallScore; }
    public void setOverallScore(BigDecimal overallScore) { this.overallScore = overallScore; }
    public String getGeneralNotes() { return generalNotes; }
    public void setGeneralNotes(String generalNotes) { this.generalNotes = generalNotes; }
    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
}
