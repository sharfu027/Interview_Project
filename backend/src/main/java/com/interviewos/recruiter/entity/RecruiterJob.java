package com.interviewos.recruiter.entity;

import com.interviewos.user.entity.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "recruiter_jobs")
public class RecruiterJob {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdBy;

    @Column(nullable = false)
    private String title;

    private String department;

    @Column(name = "job_family", nullable = false, length = 100)
    private String jobFamily;

    @Column(nullable = false, length = 50)
    private String seniority = "MID";

    private String location;

    @Column(name = "employment_type", length = 50)
    private String employmentType = "FULL_TIME";

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String status = "PUBLISHED"; // DRAFT, PUBLISHED, PAUSED, CLOSED

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public RecruiterJob() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getOrganizationId() { return organizationId; }
    public void setOrganizationId(UUID organizationId) { this.organizationId = organizationId; }
    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getJobFamily() { return jobFamily; }
    public void setJobFamily(String jobFamily) { this.jobFamily = jobFamily; }
    public String getSeniority() { return seniority; }
    public void setSeniority(String seniority) { this.seniority = seniority; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
