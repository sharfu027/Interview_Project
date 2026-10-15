package com.interviewos.learning.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "roadmap_milestones")
public class RoadmapMilestone {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roadmap_id", nullable = false)
    private CareerRoadmap roadmap;

    @Column(name = "milestone_order", nullable = false)
    private int milestoneOrder;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "skill_category", nullable = false, length = 100)
    private String skillCategory;

    @Column(name = "estimated_hours", nullable = false)
    private int estimatedHours = 15;

    @Column(name = "is_completed", nullable = false)
    private boolean isCompleted = false;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public RoadmapMilestone() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public CareerRoadmap getRoadmap() { return roadmap; }
    public void setRoadmap(CareerRoadmap roadmap) { this.roadmap = roadmap; }
    public int getMilestoneOrder() { return milestoneOrder; }
    public void setMilestoneOrder(int milestoneOrder) { this.milestoneOrder = milestoneOrder; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSkillCategory() { return skillCategory; }
    public void setSkillCategory(String skillCategory) { this.skillCategory = skillCategory; }
    public int getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(int estimatedHours) { this.estimatedHours = estimatedHours; }
    public boolean isCompleted() { return isCompleted; }
    public void setCompleted(boolean completed) { isCompleted = completed; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
