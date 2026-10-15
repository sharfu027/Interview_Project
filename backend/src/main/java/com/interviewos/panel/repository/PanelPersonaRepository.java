package com.interviewos.panel.repository;

import com.interviewos.panel.entity.PanelPersona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PanelPersonaRepository extends JpaRepository<PanelPersona, String> {
    List<PanelPersona> findByIsActiveTrue();
}
