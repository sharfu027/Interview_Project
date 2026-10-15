package com.interviewos.recruiter.repository;

import com.interviewos.recruiter.entity.RecruiterJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RecruiterJobRepository extends JpaRepository<RecruiterJob, UUID> {
    List<RecruiterJob> findByOrganizationIdOrderByCreatedAtDesc(UUID organizationId);
}
