package com.interviewos.speech.repository;

import com.interviewos.speech.entity.RecordingAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RecordingAssetRepository extends JpaRepository<RecordingAsset, UUID> {
    List<RecordingAsset> findByUserIdAndIsDeletedFalseOrderByCreatedAtDesc(UUID userId);
    Optional<RecordingAsset> findByIdAndUserId(UUID id, UUID userId);
}
