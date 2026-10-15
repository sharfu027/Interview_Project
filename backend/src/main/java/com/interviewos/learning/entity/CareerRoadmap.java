package com.interviewos.learning.entity;

import com.interviewos.user.entity.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "career_roadmaps")
public class CareerRoadmap {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(name = "target_role", nullable = false, length = 100)
    private String targetRole;

    @Column(name = "target_seniority", nullable = false, length = 50)
    private String targetSeniority = "SENIOR";

    @Column(name = "target_completion_date")
    private LocalDate targetCompletionDate;

    @Column(name = "weekly_study_hours", nullable = false)
    private int weeklyStudyHours = 10;

    @Column(name = "progress_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal progressPercentage = BigDecimal.ZERO;

    @Column(nullable = false, length = 50)
    private String status = "ACTIVE"; // ACTIVE, PAUSED, COMPLETED

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "roadmap", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("milestoneOrder ASC")
    private List<RoadmapMilestone> milestones = new ArrayList<>();

    public CareerRoadmap() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
    public String getTargetSeniority() { return targetSeniority; }
    public void setTargetSeniority(String targetSeniority) { this.targetSeniority = targetSeniority; }
    public LocalDate getTargetCompletionDate() { return targetCompletionDate; }
    public void setTargetCompletionDate(LocalDate targetCompletionDate) { this.targetCompletionDate = targetCompletionDate; }
    public int getWeeklyStudyHours() { return weeklyStudyHours; }
    public void setWeeklyStudyHours(int weeklyStudyHours) { this.weeklyStudyHours = weeklyStudyHours; }
    public BigDecimal getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(BigDecimal progressPercentage) { this.progressPercentage = progressPercentage; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public List<RoadmapMilestone> getMilestones() { return milestones; }
    public void setMilestones(List<RoadmapMilestone> milestones) { this.milestones = milestones; }
}
