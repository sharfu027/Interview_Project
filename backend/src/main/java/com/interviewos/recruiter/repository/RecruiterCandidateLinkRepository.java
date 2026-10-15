package com.interviewos.recruiter.repository;

import com.interviewos.recruiter.entity.RecruiterCandidateLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RecruiterCandidateLinkRepository extends JpaRepository<RecruiterCandidateLink, UUID> {
    List<RecruiterCandidateLink> findByOrganizationIdOrderByCreatedAtDesc(UUID organizationId);
    List<RecruiterCandidateLink> findByJobId(UUID jobId);
}
