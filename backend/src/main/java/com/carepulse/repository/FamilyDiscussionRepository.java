package com.carepulse.repository;

import com.carepulse.entity.FamilyDiscussion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FamilyDiscussionRepository extends JpaRepository<FamilyDiscussion, Long> {
    List<FamilyDiscussion> findByFamilyGroupIdOrderByCreatedAtAsc(Long familyGroupId);
}
