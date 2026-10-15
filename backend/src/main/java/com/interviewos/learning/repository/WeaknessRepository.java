package com.interviewos.learning.repository;

import com.interviewos.learning.entity.IdentifiedWeakness;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WeaknessRepository extends JpaRepository<IdentifiedWeakness, UUID> {
    List<IdentifiedWeakness> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
