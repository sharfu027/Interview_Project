package com.interviewos.interview.repository;

import com.interviewos.interview.entity.InterviewScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InterviewScoreRepository extends JpaRepository<InterviewScore, UUID> {
    List<InterviewScore> findByAnswerId(UUID answerId);
}
