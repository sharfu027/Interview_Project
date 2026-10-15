package com.interviewos.job.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "job_postings")
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String title;

    @Column(name = "job_family", nullable = false, length = 100)
    private String jobFamily;

    @Column(nullable = false, length = 50)
    private String seniority = "MID";

    private String location;

    @Column(name = "employment_type", length = 50)
    private String employmentType = "FULL_TIME";

    @Column(name = "remote_policy", length = 50)
    private String remotePolicy = "HYBRID";

    @Column(name = "raw_description", nullable = false, columnDefinition = "TEXT")
    private String rawDescription;

    @Column(name = "salary_min", precision = 12, scale = 2)
    private BigDecimal salaryMin;

    @Column(name = "salary_max", precision = 12, scale = 2)
    private BigDecimal salaryMax;

    @Column(length = 10)
    private String currency = "USD";

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "external_url")
    private String externalUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public JobPosting() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getJobFamily() { return jobFamily; }
    public void setJobFamily(String jobFamily) { this.jobFamily = jobFamily; }
    public String getSeniority() { return seniority; }
    public void setSeniority(String seniority) { this.seniority = seniority; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }
    public String getRemotePolicy() { return remotePolicy; }
    public void setRemotePolicy(String remotePolicy) { this.remotePolicy = remotePolicy; }
    public String getRawDescription() { return rawDescription; }
    public void setRawDescription(String rawDescription) { this.rawDescription = rawDescription; }
    public BigDecimal getSalaryMin() { return salaryMin; }
    public void setSalaryMin(BigDecimal salaryMin) { this.salaryMin = salaryMin; }
    public BigDecimal getSalaryMax() { return salaryMax; }
    public void setSalaryMax(BigDecimal salaryMax) { this.salaryMax = salaryMax; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    public String getExternalUrl() { return externalUrl; }
    public void setExternalUrl(String externalUrl) { this.externalUrl = externalUrl; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
