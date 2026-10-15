package com.interviewos.salary.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "salary_observations")
public class SalaryObservation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "job_family", nullable = false, length = 100)
    private String jobFamily;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(nullable = false, length = 50)
    private String seniority; // ENTRY, MID, SENIOR, LEAD, PRINCIPAL, STAFF

    @Column(nullable = false, length = 100)
    private String location;

    @Column(name = "base_salary_min", nullable = false, precision = 12, scale = 2)
    private BigDecimal baseSalaryMin;

    @Column(name = "base_salary_median", nullable = false, precision = 12, scale = 2)
    private BigDecimal baseSalaryMedian;

    @Column(name = "base_salary_max", nullable = false, precision = 12, scale = 2)
    private BigDecimal baseSalaryMax;

    @Column(name = "total_comp_median", precision = 12, scale = 2)
    private BigDecimal totalCompMedian;

    @Column(nullable = false, length = 10)
    private String currency = "USD";

    @Column(name = "sample_size")
    private int sampleSize = 1;

    @Column(name = "observation_year", nullable = false)
    private int observationYear = 2026;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public SalaryObservation() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getJobFamily() { return jobFamily; }
    public void setJobFamily(String jobFamily) { this.jobFamily = jobFamily; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getSeniority() { return seniority; }
    public void setSeniority(String seniority) { this.seniority = seniority; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public BigDecimal getBaseSalaryMin() { return baseSalaryMin; }
    public void setBaseSalaryMin(BigDecimal baseSalaryMin) { this.baseSalaryMin = baseSalaryMin; }
    public BigDecimal getBaseSalaryMedian() { return baseSalaryMedian; }
    public void setBaseSalaryMedian(BigDecimal baseSalaryMedian) { this.baseSalaryMedian = baseSalaryMedian; }
    public BigDecimal getBaseSalaryMax() { return baseSalaryMax; }
    public void setBaseSalaryMax(BigDecimal baseSalaryMax) { this.baseSalaryMax = baseSalaryMax; }
    public BigDecimal getTotalCompMedian() { return totalCompMedian; }
    public void setTotalCompMedian(BigDecimal totalCompMedian) { this.totalCompMedian = totalCompMedian; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public int getSampleSize() { return sampleSize; }
    public void setSampleSize(int sampleSize) { this.sampleSize = sampleSize; }
    public int getObservationYear() { return observationYear; }
    public void setObservationYear(int observationYear) { this.observationYear = observationYear; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
