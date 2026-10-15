package com.interviewos.interview.repository;

import com.interviewos.interview.entity.InterviewAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InterviewAnswerRepository extends JpaRepository<InterviewAnswer, UUID> {
    Optional<InterviewAnswer> findByQuestionId(UUID questionId);
    List<InterviewAnswer> findBySessionId(UUID sessionId);
}
