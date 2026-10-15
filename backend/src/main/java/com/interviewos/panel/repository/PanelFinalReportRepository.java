package com.interviewos.panel.repository;

import com.interviewos.panel.entity.PanelFinalReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PanelFinalReportRepository extends JpaRepository<PanelFinalReport, UUID> {
    Optional<PanelFinalReport> findByPanelSessionId(UUID panelSessionId);
}
