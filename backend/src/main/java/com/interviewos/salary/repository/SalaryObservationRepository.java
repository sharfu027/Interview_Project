package com.interviewos.salary.repository;

import com.interviewos.salary.entity.SalaryObservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SalaryObservationRepository extends JpaRepository<SalaryObservation, UUID> {
    Optional<SalaryObservation> findFirstByJobFamilyAndSeniority(String jobFamily, String seniority);
    List<SalaryObservation> findByJobFamily(String jobFamily);
}
