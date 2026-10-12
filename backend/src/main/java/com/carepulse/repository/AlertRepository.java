package com.carepulse.repository;

import com.carepulse.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByIsResolvedFalseOrderByCreatedAtDesc();
    List<Alert> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    List<Alert> findAllByOrderByCreatedAtDesc();
}
