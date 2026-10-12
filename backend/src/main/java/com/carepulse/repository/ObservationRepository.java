package com.carepulse.repository;

import com.carepulse.entity.Observation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ObservationRepository extends JpaRepository<Observation, Long> {
    List<Observation> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    List<Observation> findByCaregiverIdOrderByCreatedAtDesc(Long caregiverId);
    List<Observation> findAllByOrderByCreatedAtDesc();
    List<Observation> findByPatientIdAndCreatedAtAfterOrderByCreatedAtDesc(Long patientId, LocalDateTime after);
}
