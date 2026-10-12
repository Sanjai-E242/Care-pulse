package com.carepulse.repository;

import com.carepulse.entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {
    List<Shift> findByCaregiverIdAndStatus(Long caregiverId, String status);
    Optional<Shift> findFirstByCaregiverIdOrderByStartTimeDesc(Long caregiverId);
}
