package com.carepulse.repository;

import com.carepulse.entity.CareTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareTaskRepository extends JpaRepository<CareTask, Long> {
    List<CareTask> findByPatientIdOrderByDueDateAsc(Long patientId);
    List<CareTask> findByAssignedCaregiverIdOrderByDueDateAsc(Long caregiverId);
    List<CareTask> findByAssignedCaregiverId(Long caregiverId);
    long countByAssignedCaregiverIdAndStatus(Long caregiverId, String status);
    List<CareTask> findByStatus(String status);
}
