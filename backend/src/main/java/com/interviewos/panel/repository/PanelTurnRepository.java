package com.interviewos.panel.repository;

import com.interviewos.panel.entity.PanelTurn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PanelTurnRepository extends JpaRepository<PanelTurn, UUID> {
    List<PanelTurn> findByPanelSessionIdOrderByTurnNumberAsc(UUID panelSessionId);
}
