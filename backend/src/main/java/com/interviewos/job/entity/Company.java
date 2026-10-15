package com.interviewos.job.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(name = "logo_url")
    private String logoUrl;

    private String website;
    private String industry;
    private String headquarters;

    @Column(columnDefinition = "TEXT")
    private String overview;

    @Column(name = "interview_process_notes", columnDefinition = "TEXT")
    private String interviewProcessNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Company() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    public String getHeadquarters() { return headquarters; }
    public void setHeadquarters(String headquarters) { this.headquarters = headquarters; }
    public String getOverview() { return overview; }
    public void setOverview(String overview) { this.overview = overview; }
    public String getInterviewProcessNotes() { return interviewProcessNotes; }
    public void setInterviewProcessNotes(String interviewProcessNotes) { this.interviewProcessNotes = interviewProcessNotes; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
