package com.interviewos.interview.repository;

import com.interviewos.interview.entity.InterviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, UUID> {
    List<InterviewQuestion> findBySessionIdOrderByQuestionOrderAsc(UUID sessionId);
    Optional<InterviewQuestion> findBySessionIdAndQuestionOrder(UUID sessionId, int questionOrder);
}
