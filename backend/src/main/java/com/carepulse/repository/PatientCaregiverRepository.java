package com.carepulse.repository;

import com.carepulse.entity.PatientCaregiver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientCaregiverRepository extends JpaRepository<PatientCaregiver, Long> {
    List<PatientCaregiver> findByPatientId(Long patientId);
    List<PatientCaregiver> findByCaregiverId(Long caregiverId);
}
