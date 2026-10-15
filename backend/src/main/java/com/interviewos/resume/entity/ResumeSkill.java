package com.interviewos.resume.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "resume_skills")
public class ResumeSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @Column(name = "skill_name", nullable = false, length = 100)
    private String skillName;

    @Column(nullable = false, length = 50)
    private String category = "TECHNICAL";

    @Column(length = 50)
    private String proficiency = "INTERMEDIATE";

    @Column(name = "years_of_experience", precision = 4, scale = 1)
    private BigDecimal yearsOfExperience;

    @Column(name = "is_verified", nullable = false)
    private boolean isVerified = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public ResumeSkill() {}

    public ResumeSkill(Resume resume, String skillName, String category, String proficiency, BigDecimal yearsOfExperience) {
        this.resume = resume;
        this.skillName = skillName;
        this.category = category;
        this.proficiency = proficiency;
        this.yearsOfExperience = yearsOfExperience;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }
    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getProficiency() { return proficiency; }
    public void setProficiency(String proficiency) { this.proficiency = proficiency; }
    public BigDecimal getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(BigDecimal yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }
    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
