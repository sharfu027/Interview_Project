package com.interviewos.salary.repository;

import com.interviewos.salary.entity.SalaryNegotiationSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SalaryNegotiationSessionRepository extends JpaRepository<SalaryNegotiationSession, UUID> {
    List<SalaryNegotiationSession> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
