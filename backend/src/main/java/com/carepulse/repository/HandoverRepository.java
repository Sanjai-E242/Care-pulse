package com.carepulse.repository;

import com.carepulse.entity.Handover;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HandoverRepository extends JpaRepository<Handover, Long> {
    List<Handover> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    List<Handover> findAllByOrderByCreatedAtDesc();
}
