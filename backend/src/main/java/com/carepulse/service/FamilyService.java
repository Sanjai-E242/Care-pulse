package com.carepulse.service;

import com.carepulse.ai.FamilyCoordinationAgent;
import com.carepulse.dto.FamilyDiscussionDto;
import com.carepulse.dto.FamilyDiscussionRequest;
import com.carepulse.dto.FamilySummaryDto;
import com.carepulse.entity.*;
import com.carepulse.exception.ResourceNotFoundException;
import com.carepulse.repository.FamilyDiscussionRepository;
import com.carepulse.repository.FamilyGroupRepository;
import com.carepulse.repository.FamilyMemberRepository;
import com.carepulse.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FamilyService {

    private final FamilyGroupRepository familyGroupRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final FamilyDiscussionRepository familyDiscussionRepository;
    private final PatientRepository patientRepository;
    private final FamilyCoordinationAgent familyCoordinationAgent;
    private final AuthService authService;

    public FamilyService(FamilyGroupRepository familyGroupRepository,
                         FamilyMemberRepository familyMemberRepository,
                         FamilyDiscussionRepository familyDiscussionRepository,
                         PatientRepository patientRepository,
                         FamilyCoordinationAgent familyCoordinationAgent,
                         AuthService authService) {
        this.familyGroupRepository = familyGroupRepository;
        this.familyMemberRepository = familyMemberRepository;
        this.familyDiscussionRepository = familyDiscussionRepository;
        this.patientRepository = patientRepository;
        this.familyCoordinationAgent = familyCoordinationAgent;
        this.authService = authService;
    }

    public FamilyGroup getOrCreateFamilyGroup(Long patientId) {
        return familyGroupRepository.findByPatientId(patientId).orElseGet(() -> {
            Patient p = patientRepository.findById(patientId)
                    .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
            FamilyGroup fg = new FamilyGroup(p, p.getFullName() + "'s Care Circle");
            return familyGroupRepository.save(fg);
        });
    }

    public List<FamilyMember> getMembers(Long patientId) {
        FamilyGroup fg = getOrCreateFamilyGroup(patientId);
        return familyMemberRepository.findByFamilyGroupId(fg.getId());
    }

    public List<FamilyDiscussionDto> getDiscussions(Long patientId) {
        FamilyGroup fg = getOrCreateFamilyGroup(patientId);
        return familyDiscussionRepository.findByFamilyGroupIdOrderByCreatedAtAsc(fg.getId())
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public FamilyDiscussionDto postMessage(FamilyDiscussionRequest req) {
        User author = authService.getCurrentUser();
        FamilyGroup fg = getOrCreateFamilyGroup(req.getPatientId());

        FamilyDiscussion fd = new FamilyDiscussion();
        fd.setFamilyGroup(fg);
        fd.setUser(author);
        fd.setMessage(req.getMessage());
        fd.setCategory(req.getCategory() != null ? req.getCategory() : "UPDATE");
        fd.setParentMessageId(req.getParentMessageId());
        fd = familyDiscussionRepository.save(fd);

        return toDto(fd);
    }

    public FamilySummaryDto getAiDiscussionSummary(Long patientId) {
        Patient p = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        FamilyGroup fg = getOrCreateFamilyGroup(patientId);
        List<FamilyDiscussion> discussions = familyDiscussionRepository.findByFamilyGroupIdOrderByCreatedAtAsc(fg.getId());
        return familyCoordinationAgent.summarizeDiscussion(p.getFullName(), discussions);
    }

    public FamilyDiscussionDto toDto(FamilyDiscussion d) {
        FamilyDiscussionDto dto = new FamilyDiscussionDto();
        dto.setId(d.getId());
        dto.setFamilyGroupId(d.getFamilyGroup().getId());
        dto.setUserId(d.getUser().getId());
        dto.setUserName(d.getUser().getFullName());
        dto.setUserRole(d.getUser().getRole().name());
        dto.setMessage(d.getMessage());
        dto.setCategory(d.getCategory());
        dto.setParentMessageId(d.getParentMessageId());
        dto.setCreatedAt(d.getCreatedAt());
        return dto;
    }
}
