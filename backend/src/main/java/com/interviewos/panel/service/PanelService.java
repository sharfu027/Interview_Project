package com.interviewos.panel.service;

import com.interviewos.common.exception.ResourceNotFoundException;
import com.interviewos.interview.entity.InterviewSession;
import com.interviewos.interview.repository.InterviewSessionRepository;
import com.interviewos.panel.dto.*;
import com.interviewos.panel.entity.*;
import com.interviewos.panel.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PanelService {

    private final PanelPersonaRepository personaRepository;
    private final PanelSessionRepository panelSessionRepository;
    private final PanelTurnRepository panelTurnRepository;
    private final InterviewSessionRepository interviewSessionRepository;

    public PanelService(
        PanelPersonaRepository personaRepository,
        PanelSessionRepository panelSessionRepository,
        PanelTurnRepository panelTurnRepository,
        InterviewSessionRepository interviewSessionRepository
    ) {
        this.personaRepository = personaRepository;
        this.panelSessionRepository = panelSessionRepository;
        this.panelTurnRepository = panelTurnRepository;
        this.interviewSessionRepository = interviewSessionRepository;
    }

    @Transactional(readOnly = true)
    public List<PanelPersonaDto> getPersonas() {
        return personaRepository.findByIsActiveTrue().stream()
            .map(p -> new PanelPersonaDto(p.getId(), p.getDisplayName(), p.getRoleTitle(), p.getAvatarUrl(), p.getQuestioningStyle()))
            .collect(Collectors.toList());
    }

    @Transactional
    public PanelSessionDto getOrCreatePanelSession(UUID interviewSessionId, UUID userId) {
        InterviewSession interviewSession = interviewSessionRepository.findByIdAndUserId(interviewSessionId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Interview session not found"));

        PanelSession panelSession = panelSessionRepository.findBySessionId(interviewSessionId)
            .orElseGet(() -> {
                PanelSession ps = new PanelSession();
                ps.setSession(interviewSession);
                PanelPersona initialPersona = personaRepository.findById("HR").orElse(null);
                ps.setActivePersona(initialPersona);
                ps.setCurrentTurn(1);
                PanelSession saved = panelSessionRepository.save(ps);

                // Create initial question from Priya (HR)
                PanelTurn turn1 = new PanelTurn();
                turn1.setPanelSession(saved);
                turn1.setTurnNumber(1);
                turn1.setPersona(initialPersona);
                turn1.setActionType("QUESTION");
                turn1.setContent("Welcome to today's interview panel! I'm Priya, Director of Talent. To start us off, could you briefly introduce your background and what motivated you to pursue this engineering role?");
                panelTurnRepository.save(turn1);

                return saved;
            });

        return toDto(panelSession);
    }

    @Transactional
    public PanelSessionDto submitCandidateResponse(UUID panelSessionId, UUID userId, SubmitPanelTurnRequest req) {
        PanelSession panelSession = panelSessionRepository.findById(panelSessionId)
            .orElseThrow(() -> new ResourceNotFoundException("Panel session not found"));

        int currentTurn = panelSession.getCurrentTurn();

        // 1. Log candidate response
        PanelTurn candidateTurn = new PanelTurn();
        candidateTurn.setPanelSession(panelSession);
        candidateTurn.setTurnNumber(currentTurn + 1);
        candidateTurn.setPersona(panelSession.getActivePersona());
        candidateTurn.setActionType("ANSWER");
        candidateTurn.setContent(req.responseText().trim());
        panelTurnRepository.save(candidateTurn);

        // 2. Rotate persona and generate cross-interviewer challenge
        PanelPersona nextPersona;
        String actionType = "QUESTION";
        String promptText;

        int turnCount = currentTurn + 2;

        if (turnCount == 3) {
            nextPersona = personaRepository.findById("TECH_LEAD").orElse(panelSession.getActivePersona());
            promptText = "Thanks for that overview. I'm Alex, Principal Engineer. You mentioned backend microservices—let's dive deep into implementation. When your Spring Boot services handle concurrent database writes under high lock contention, how do you prevent thread starvation in your Hikari connection pool?";
        } else if (turnCount == 5) {
            nextPersona = personaRepository.findById("ARCHITECT").orElse(panelSession.getActivePersona());
            actionType = "CHALLENGE";
            promptText = "I'm Elena, Chief Architect. I'd like to challenge that approach. If we introduce distributed caching as you suggested, what happens during a network partition where the primary Redis replica fails? How do you maintain data consistency across decoupled regions without cascading outages?";
        } else if (turnCount == 7) {
            nextPersona = personaRepository.findById("HIRING_MGR").orElse(panelSession.getActivePersona());
            promptText = "Hello! I'm Marcus, VP of Engineering. While Elena focuses on resilience, I care deeply about delivery and team impact. When you're facing tight deadlines and technical debt, how do you negotiate with stakeholders when an architecture refactor is strictly necessary?";
        } else {
            nextPersona = personaRepository.findById("HR").orElse(panelSession.getActivePersona());
            promptText = "Priya here again. Looking back at our discussion today, how do you feel you performed, and do you have any closing questions for our panel regarding team culture or roadmaps?";
        }

        PanelTurn aiTurn = new PanelTurn();
        aiTurn.setPanelSession(panelSession);
        aiTurn.setTurnNumber(turnCount);
        aiTurn.setPersona(nextPersona);
        aiTurn.setActionType(actionType);
        aiTurn.setContent(promptText);
        panelTurnRepository.save(aiTurn);

        panelSession.setActivePersona(nextPersona);
        panelSession.setCurrentTurn(turnCount);
        panelSessionRepository.save(panelSession);

        return toDto(panelSession);
    }

    private PanelSessionDto toDto(PanelSession ps) {
        List<PanelTurn> turns = panelTurnRepository.findByPanelSessionIdOrderByTurnNumberAsc(ps.getId());
        List<PanelPersona> allPersonas = personaRepository.findByIsActiveTrue();

        var turnDtos = turns.stream()
            .map(t -> new PanelTurnDto(
                t.getId(),
                t.getTurnNumber(),
                t.getPersona().getId(),
                t.getPersona().getDisplayName(),
                t.getPersona().getRoleTitle(),
                t.getActionType(),
                t.getContent(),
                t.getCreatedAt()
            ))
            .collect(Collectors.toList());

        var personaDtos = allPersonas.stream()
            .map(p -> new PanelPersonaDto(p.getId(), p.getDisplayName(), p.getRoleTitle(), p.getAvatarUrl(), p.getQuestioningStyle()))
            .collect(Collectors.toList());

        return new PanelSessionDto(
            ps.getId(),
            ps.getSession().getId(),
            ps.getSession().getTitle(),
            ps.getActivePersona() != null ? ps.getActivePersona().getId() : "HR",
            ps.getActivePersona() != null ? ps.getActivePersona().getDisplayName() : "Priya Sharma",
            ps.getCurrentTurn(),
            personaDtos,
            turnDtos,
            ps.getConsensusNotes()
        );
    }
}
