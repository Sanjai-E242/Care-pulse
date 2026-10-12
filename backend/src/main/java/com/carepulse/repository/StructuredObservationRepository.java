package com.carepulse.repository;

import com.carepulse.entity.StructuredObservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StructuredObservationRepository extends JpaRepository<StructuredObservation, Long> {
    Optional<StructuredObservation> findByObservationId(Long observationId);
}
