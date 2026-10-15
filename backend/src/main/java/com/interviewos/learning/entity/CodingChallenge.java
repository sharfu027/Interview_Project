package com.interviewos.learning.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "coding_challenges")
public class CodingChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(nullable = false, length = 50)
    private String difficulty = "MEDIUM";

    @Column(nullable = false, length = 100)
    private String category; // DATA_STRUCTURES, ALGORITHMS, CONCURRENCY

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "starter_code", nullable = false, columnDefinition = "jsonb")
    private String starterCode = "{}";

    @Column(name = "test_cases", nullable = false, columnDefinition = "jsonb")
    private String testCases = "[]";

    @Column(name = "time_limit_ms", nullable = false)
    private int timeLimitMs = 2000;

    @Column(name = "memory_limit_mb", nullable = false)
    private int memoryLimitMb = 256;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public CodingChallenge() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStarterCode() { return starterCode; }
    public void setStarterCode(String starterCode) { this.starterCode = starterCode; }
    public String getTestCases() { return testCases; }
    public void setTestCases(String testCases) { this.testCases = testCases; }
    public int getTimeLimitMs() { return timeLimitMs; }
    public void setTimeLimitMs(int timeLimitMs) { this.timeLimitMs = timeLimitMs; }
    public int getMemoryLimitMb() { return memoryLimitMb; }
    public void setMemoryLimitMb(int memoryLimitMb) { this.memoryLimitMb = memoryLimitMb; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
