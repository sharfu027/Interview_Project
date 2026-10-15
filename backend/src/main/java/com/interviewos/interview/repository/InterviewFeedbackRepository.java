package com.interviewos.interview.repository;

import com.interviewos.interview.entity.InterviewFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InterviewFeedbackRepository extends JpaRepository<InterviewFeedback, UUID> {
    Optional<InterviewFeedback> findByAnswerId(UUID answerId);
}
