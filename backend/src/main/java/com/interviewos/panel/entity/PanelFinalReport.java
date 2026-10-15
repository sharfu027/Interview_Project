package com.interviewos.panel.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "panel_final_reports")
public class PanelFinalReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "panel_session_id", nullable = false)
    private PanelSession panelSession;

    @Column(name = "overall_recommendation", nullable = false, length = 50)
    private String overallRecommendation = "STRONG_HIRE";

    @Column(name = "overall_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal overallScore = BigDecimal.valueOf(8.75);

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "persona_breakdown", columnDefinition = "jsonb")
    private String personaBreakdown = "{}";

    @Column(name = "hiring_risk_analysis", columnDefinition = "TEXT")
    private String hiringRiskAnalysis;

    @Column(name = "actionable_roadmap_notes", columnDefinition = "TEXT")
    private String actionableRoadmapNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public PanelFinalReport() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public PanelSession getPanelSession() { return panelSession; }
    public void setPanelSession(PanelSession panelSession) { this.panelSession = panelSession; }
    public String getOverallRecommendation() { return overallRecommendation; }
    public void setOverallRecommendation(String overallRecommendation) { this.overallRecommendation = overallRecommendation; }
    public BigDecimal getOverallScore() { return overallScore; }
    public void setOverallScore(BigDecimal overallScore) { this.overallScore = overallScore; }
    public String getPersonaBreakdown() { return personaBreakdown; }
    public void setPersonaBreakdown(String personaBreakdown) { this.personaBreakdown = personaBreakdown; }
    public String getHiringRiskAnalysis() { return hiringRiskAnalysis; }
    public void setHiringRiskAnalysis(String hiringRiskAnalysis) { this.hiringRiskAnalysis = hiringRiskAnalysis; }
    public String getActionableRoadmapNotes() { return actionableRoadmapNotes; }
    public void setActionableRoadmapNotes(String actionableRoadmapNotes) { this.actionableRoadmapNotes = actionableRoadmapNotes; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
