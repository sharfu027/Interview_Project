package com.interviewos.job.repository;

import com.interviewos.job.entity.JobPosting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, UUID> {
    Page<JobPosting> findByIsActiveTrue(Pageable pageable);
    List<JobPosting> findByJobFamilyAndIsActiveTrue(String jobFamily);
    List<JobPosting> findTop6ByIsActiveTrueOrderByCreatedAtDesc();
}
