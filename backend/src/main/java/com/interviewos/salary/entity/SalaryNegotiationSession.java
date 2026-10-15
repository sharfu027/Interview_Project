package com.interviewos.salary.entity;

import com.interviewos.user.entity.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "salary_negotiation_sessions")
public class SalaryNegotiationSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "target_role", nullable = false, length = 100)
    private String targetRole;

    @Column(name = "target_company", nullable = false)
    private String targetCompany;

    @Column(name = "initial_offer", nullable = false, precision = 12, scale = 2)
    private BigDecimal initialOffer;

    @Column(length = 10)
    private String currency = "USD";

    @Column(name = "counter_offer", precision = 12, scale = 2)
    private BigDecimal counterOffer;

    @Column(name = "outcome_status", length = 50)
    private String outcomeStatus = "IN_PROGRESS";

    @Column(name = "ai_negotiation_feedback", columnDefinition = "TEXT")
    private String aiNegotiationFeedback;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public SalaryNegotiationSession() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
    public String getTargetCompany() { return targetCompany; }
    public void setTargetCompany(String targetCompany) { this.targetCompany = targetCompany; }
    public BigDecimal getInitialOffer() { return initialOffer; }
    public void setInitialOffer(BigDecimal initialOffer) { this.initialOffer = initialOffer; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public BigDecimal getCounterOffer() { return counterOffer; }
    public void setCounterOffer(BigDecimal counterOffer) { this.counterOffer = counterOffer; }
    public String getOutcomeStatus() { return outcomeStatus; }
    public void setOutcomeStatus(String outcomeStatus) { this.outcomeStatus = outcomeStatus; }
    public String getAiNegotiationFeedback() { return aiNegotiationFeedback; }
    public void setAiNegotiationFeedback(String aiNegotiationFeedback) { this.aiNegotiationFeedback = aiNegotiationFeedback; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
