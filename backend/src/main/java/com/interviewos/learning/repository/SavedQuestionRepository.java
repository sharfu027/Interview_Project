package com.interviewos.learning.repository;

import com.interviewos.learning.entity.SavedQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SavedQuestionRepository extends JpaRepository<SavedQuestion, UUID> {
    List<SavedQuestion> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
