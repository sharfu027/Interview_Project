package com.interviewos.resume.repository;

import com.interviewos.resume.entity.ResumeParseResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResumeParseResultRepository extends JpaRepository<ResumeParseResult, UUID> {
    Optional<ResumeParseResult> findByResumeId(UUID resumeId);
}
