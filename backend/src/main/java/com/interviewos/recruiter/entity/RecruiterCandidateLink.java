package com.interviewos.recruiter.entity;

import com.interviewos.user.entity.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "recruiter_candidate_links")
public class RecruiterCandidateLink {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private RecruiterJob job;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "candidate_user_id", nullable = false)
    private User candidate;

    @Column(nullable = false, length = 50)
    private String status = "ACTIVE"; // ACTIVE, HIRED, REJECTED, WITHDRAWN

    @Column(name = "candidate_consented_share", nullable = false)
    private boolean candidateConsentedShare = true;

    @Column(name = "recruiter_rating", precision = 3, scale = 2)
    private BigDecimal recruiterRating = BigDecimal.valueOf(4.5);

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public RecruiterCandidateLink() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getOrganizationId() { return organizationId; }
    public void setOrganizationId(UUID organizationId) { this.organizationId = organizationId; }
    public RecruiterJob getJob() { return job; }
    public void setJob(RecruiterJob job) { this.job = job; }
    public User getCandidate() { return candidate; }
    public void setCandidate(User candidate) { this.candidate = candidate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public boolean isCandidateConsentedShare() { return candidateConsentedShare; }
    public void setCandidateConsentedShare(boolean candidateConsentedShare) { this.candidateConsentedShare = candidateConsentedShare; }
    public BigDecimal getRecruiterRating() { return recruiterRating; }
    public void setRecruiterRating(BigDecimal recruiterRating) { this.recruiterRating = recruiterRating; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
