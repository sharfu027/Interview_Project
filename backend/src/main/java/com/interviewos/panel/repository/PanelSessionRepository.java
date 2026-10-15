package com.interviewos.panel.repository;

import com.interviewos.panel.entity.PanelSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PanelSessionRepository extends JpaRepository<PanelSession, UUID> {
    Optional<PanelSession> findBySessionId(UUID sessionId);
}
