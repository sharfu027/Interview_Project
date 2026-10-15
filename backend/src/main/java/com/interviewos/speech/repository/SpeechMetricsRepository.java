package com.interviewos.speech.repository;

import com.interviewos.speech.entity.SpeechMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SpeechMetricsRepository extends JpaRepository<SpeechMetric, UUID> {
    List<SpeechMetric> findBySessionIdOrderByCreatedAtAsc(UUID sessionId);
}
