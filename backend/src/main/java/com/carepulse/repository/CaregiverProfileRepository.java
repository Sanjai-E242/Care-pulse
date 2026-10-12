package com.carepulse.repository;

import com.carepulse.entity.CaregiverProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CaregiverProfileRepository extends JpaRepository<CaregiverProfile, Long> {
    Optional<CaregiverProfile> findByUserId(Long userId);
}
