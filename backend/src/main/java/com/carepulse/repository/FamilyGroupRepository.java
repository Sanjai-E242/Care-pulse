package com.carepulse.repository;

import com.carepulse.entity.FamilyGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FamilyGroupRepository extends JpaRepository<FamilyGroup, Long> {
    Optional<FamilyGroup> findByPatientId(Long patientId);
}
