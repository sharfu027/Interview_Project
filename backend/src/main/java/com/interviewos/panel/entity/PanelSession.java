package com.interviewos.panel.entity;

import com.interviewos.interview.entity.InterviewSession;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "panel_sessions")
public class PanelSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private InterviewSession session;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "active_persona_id")
    private PanelPersona activePersona;

    @Column(name = "current_turn", nullable = false)
    private int currentTurn = 1;

    @Column(name = "consensus_notes", columnDefinition = "TEXT")
    private String consensusNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "panelSession", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("turnNumber ASC")
    private List<PanelTurn> turns = new ArrayList<>();

    public PanelSession() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public InterviewSession getSession() { return session; }
    public void setSession(InterviewSession session) { this.session = session; }
    public PanelPersona getActivePersona() { return activePersona; }
    public void setActivePersona(PanelPersona activePersona) { this.activePersona = activePersona; }
    public int getCurrentTurn() { return currentTurn; }
    public void setCurrentTurn(int currentTurn) { this.currentTurn = currentTurn; }
    public String getConsensusNotes() { return consensusNotes; }
    public void setConsensusNotes(String consensusNotes) { this.consensusNotes = consensusNotes; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public List<PanelTurn> getTurns() { return turns; }
    public void setTurns(List<PanelTurn> turns) { this.turns = turns; }
}
