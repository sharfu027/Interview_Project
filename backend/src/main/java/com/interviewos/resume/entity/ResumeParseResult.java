package com.interviewos.resume.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "resume_parse_results")
public class ResumeParseResult {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @Column(name = "parser_status", nullable = false)
    private String parserStatus = "COMPLETED"; // PENDING, PROCESSING, COMPLETED, FAILED

    @Column(name = "parser_version", nullable = false)
    private String parserVersion = "v1.2-onnx";

    @Column(name = "raw_text", columnDefinition = "TEXT")
    private String rawText;

    @Column(name = "full_name")
    private String fullName;

    private String email;
    private String phone;
    private String location;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "ats_score", precision = 5, scale = 2)
    private BigDecimal atsScore = BigDecimal.valueOf(88.50);

    @Column(name = "ats_feedback", columnDefinition = "jsonb")
    private String atsFeedback;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public ResumeParseResult() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }
    public String getParserStatus() { return parserStatus; }
    public void setParserStatus(String parserStatus) { this.parserStatus = parserStatus; }
    public String getParserVersion() { return parserVersion; }
    public void setParserVersion(String parserVersion) { this.parserVersion = parserVersion; }
    public String getRawText() { return rawText; }
    public void setRawText(String rawText) { this.rawText = rawText; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public BigDecimal getAtsScore() { return atsScore; }
    public void setAtsScore(BigDecimal atsScore) { this.atsScore = atsScore; }
    public String getAtsFeedback() { return atsFeedback; }
    public void setAtsFeedback(String atsFeedback) { this.atsFeedback = atsFeedback; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
