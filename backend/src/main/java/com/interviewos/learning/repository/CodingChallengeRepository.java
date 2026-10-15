package com.interviewos.learning.repository;

import com.interviewos.learning.entity.CodingChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CodingChallengeRepository extends JpaRepository<CodingChallenge, UUID> {
    List<CodingChallenge> findByIsActiveTrue();
    Optional<CodingChallenge> findBySlug(String slug);
}
