package com.interviewos.panel.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "panel_turns")
public class PanelTurn {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "panel_session_id", nullable = false)
    private PanelSession panelSession;

    @Column(name = "turn_number", nullable = false)
    private int turnNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "persona_id", nullable = false)
    private PanelPersona persona;

    @Column(name = "action_type", nullable = false, length = 50)
    private String actionType = "QUESTION"; // QUESTION, CHALLENGE, FOLLOWUP, ACKNOWLEDGEMENT

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public PanelTurn() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public PanelSession getPanelSession() { return panelSession; }
    public void setPanelSession(PanelSession panelSession) { this.panelSession = panelSession; }
    public int getTurnNumber() { return turnNumber; }
    public void setTurnNumber(int turnNumber) { this.turnNumber = turnNumber; }
    public PanelPersona getPersona() { return persona; }
    public void setPersona(PanelPersona persona) { this.persona = persona; }
    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
