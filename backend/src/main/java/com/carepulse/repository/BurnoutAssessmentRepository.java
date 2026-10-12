package com.carepulse.repository;

import com.carepulse.entity.BurnoutAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BurnoutAssessmentRepository extends JpaRepository<BurnoutAssessment, Long> {
    Optional<BurnoutAssessment> findFirstByCaregiverIdOrderByAssessedAtDesc(Long caregiverId);
    List<BurnoutAssessment> findByCaregiverIdOrderByAssessedAtDesc(Long caregiverId);
}
