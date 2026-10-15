package com.interviewos.learning.repository;

import com.interviewos.learning.entity.CareerRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CareerRoadmapRepository extends JpaRepository<CareerRoadmap, UUID> {
    List<CareerRoadmap> findByUserIdOrderByCreatedAtDesc(UUID userId);
    Optional<CareerRoadmap> findByIdAndUserId(UUID id, UUID userId);
}
