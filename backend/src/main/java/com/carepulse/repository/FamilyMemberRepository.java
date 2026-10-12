package com.carepulse.repository;

import com.carepulse.entity.FamilyMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Long> {
    List<FamilyMember> findByFamilyGroupId(Long familyGroupId);
}
