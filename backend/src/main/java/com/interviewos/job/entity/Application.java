package com.interviewos.job.entity;

import com.interviewos.user.entity.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id")
    private JobPosting job;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(nullable = false, length = 50)
    private String status = "APPLIED"; // SAVED, APPLIED, SCREENING, INTERVIEWING, OFFER, REJECTED, WITHDRAWN

    @Column(name = "current_stage", length = 100)
    private String currentStage = "Application Submitted";

    @Column(name = "applied_date", nullable = false)
    private LocalDate appliedDate = LocalDate.now();

    @Column(name = "salary_offered", precision = 12, scale = 2)
    private BigDecimal salaryOffered;

    @Column(name = "contact_person")
    private String contactPerson;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public Application() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public JobPosting getJob() { return job; }
    public void setJob(JobPosting job) { this.job = job; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCurrentStage() { return currentStage; }
    public void setCurrentStage(String currentStage) { this.currentStage = currentStage; }
    public LocalDate getAppliedDate() { return appliedDate; }
    public void setAppliedDate(LocalDate appliedDate) { this.appliedDate = appliedDate; }
    public BigDecimal getSalaryOffered() { return salaryOffered; }
    public void setSalaryOffered(BigDecimal salaryOffered) { this.salaryOffered = salaryOffered; }
    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
