package com.carepulse.repository;

import com.carepulse.entity.WellbeingCheckin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WellbeingCheckinRepository extends JpaRepository<WellbeingCheckin, Long> {
    List<WellbeingCheckin> findByCaregiverIdOrderByCreatedAtDesc(Long caregiverId);
}
