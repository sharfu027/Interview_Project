package com.interviewos.recruiter.repository;

import com.interviewos.recruiter.entity.EvaluationScorecard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EvaluationScorecardRepository extends JpaRepository<EvaluationScorecard, UUID> {
    List<EvaluationScorecard> findByCandidateLinkId(UUID candidateLinkId);
}
