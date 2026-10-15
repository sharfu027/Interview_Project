package com.interviewos.learning.entity;

import com.interviewos.user.entity.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "identified_weaknesses")
public class IdentifiedWeakness {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String competency;

    @Column(name = "skill_id", length = 100)
    private String skillId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 50)
    private String severity = "MEDIUM"; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(name = "confidence_level", nullable = false, precision = 4, scale = 2)
    private BigDecimal confidenceLevel = BigDecimal.valueOf(0.85);

    @Column(nullable = false, columnDefinition = "TEXT")
    private String explanation;

    @Column(nullable = false, length = 50)
    private String status = "IDENTIFIED"; // IDENTIFIED, IN_PROGRESS, RESOLVED, VERIFIED

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public IdentifiedWeakness() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getCompetency() { return competency; }
    public void setCompetency(String competency) { this.competency = competency; }
    public String getSkillId() { return skillId; }
    public void setSkillId(String skillId) { this.skillId = skillId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public BigDecimal getConfidenceLevel() { return confidenceLevel; }
    public void setConfidenceLevel(BigDecimal confidenceLevel) { this.confidenceLevel = confidenceLevel; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
