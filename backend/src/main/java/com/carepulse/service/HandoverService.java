package com.carepulse.service;

import com.carepulse.ai.HandoverAgent;
import com.carepulse.ai.PatternDetectionAgent;
import com.carepulse.dto.HandoverDto;
import com.carepulse.dto.HandoverGenerateRequest;
import com.carepulse.entity.*;
import com.carepulse.exception.ResourceNotFoundException;
import com.carepulse.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HandoverService {

    private final HandoverRepository handoverRepository;
    private final PatientRepository patientRepository;
    private final ObservationRepository observationRepository;
    private final CareTaskRepository careTaskRepository;
    private final HandoverAgent handoverAgent;
    private final PatternDetectionAgent patternDetectionAgent;
    private final AuthService authService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public HandoverService(HandoverRepository handoverRepository,
                           PatientRepository patientRepository,
                           ObservationRepository observationRepository,
                           CareTaskRepository careTaskRepository,
                           HandoverAgent handoverAgent,
                           PatternDetectionAgent patternDetectionAgent,
                           AuthService authService) {
        this.handoverRepository = handoverRepository;
        this.patientRepository = patientRepository;
        this.observationRepository = observationRepository;
        this.careTaskRepository = careTaskRepository;
        this.handoverAgent = handoverAgent;
        this.patternDetectionAgent = patternDetectionAgent;
        this.authService = authService;
    }

    @Transactional
    public HandoverDto generateAndSaveHandover(HandoverGenerateRequest req) {
        User outgoing = authService.getCurrentUser();
        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        List<Observation> observations = observationRepository.findByPatientIdOrderByCreatedAtDesc(patient.getId());
        List<CareTask> tasks = careTaskRepository.findByPatientIdOrderByDueDateAsc(patient.getId());

        PatternDetectionAgent.PatternAnalysis pattern = patternDetectionAgent.detectPatterns(observations);
        HandoverAgent.HandoverSynthesis synthesis = handoverAgent.generateHandover(
                observations, tasks, pattern.getEmergingPattern()
        );

        Handover handover = new Handover();
        handover.setPatient(patient);
        handover.setOutgoingCaregiver(outgoing);
        handover.setShiftName(req.getShiftName() != null && !req.getShiftName().trim().isEmpty() ? req.getShiftName() : DashboardService.getCurrentShiftName());

        try {
            handover.setTopObservationsJson(objectMapper.writeValueAsString(synthesis.getTopObservations()));
            handover.setEmergingPattern(synthesis.getEmergingPattern());
            handover.setWatchItemsJson(objectMapper.writeValueAsString(synthesis.getWatchItems()));
            handover.setCompletedTasksJson(objectMapper.writeValueAsString(synthesis.getCompletedTasks()));
            handover.setPendingTasksJson(objectMapper.writeValueAsString(synthesis.getPendingTasks()));
        } catch (Exception e) {
            handover.setTopObservationsJson("[]");
            handover.setWatchItemsJson("[]");
            handover.setCompletedTasksJson("[]");
            handover.setPendingTasksJson("[]");
        }

        handover = handoverRepository.save(handover);
        return toDto(handover);
    }

    public List<HandoverDto> getHandoversForPatient(Long patientId) {
        return handoverRepository.findByPatientIdOrderByCreatedAtDesc(patientId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<HandoverDto> getAllRecent() {
        return handoverRepository.findAllByOrderByCreatedAtDesc()
                .stream().limit(15).map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public HandoverDto markReviewed(Long handoverId) {
        Handover h = handoverRepository.findById(handoverId)
                .orElseThrow(() -> new ResourceNotFoundException("Handover not found"));
        h.setReviewed(true);
        h.setReviewedAt(LocalDateTime.now());
        h.setIncomingCaregiver(authService.getCurrentUser());
        h = handoverRepository.save(h);
        return toDto(h);
    }

    public HandoverDto toDto(Handover h) {
        HandoverDto dto = new HandoverDto();
        dto.setId(h.getId());
        dto.setPatientId(h.getPatient().getId());
        dto.setPatientName(h.getPatient().getFullName());
        dto.setOutgoingCaregiverId(h.getOutgoingCaregiver().getId());
        dto.setOutgoingCaregiverName(h.getOutgoingCaregiver().getFullName());
        if (h.getIncomingCaregiver() != null) {
            dto.setIncomingCaregiverId(h.getIncomingCaregiver().getId());
            dto.setIncomingCaregiverName(h.getIncomingCaregiver().getFullName());
        }
        dto.setShiftName(h.getShiftName());
        dto.setEmergingPattern(h.getEmergingPattern());
        dto.setReviewed(h.isReviewed());
        dto.setReviewedAt(h.getReviewedAt());
        dto.setCreatedAt(h.getCreatedAt());

        try {
            dto.setTopObservations(objectMapper.readValue(h.getTopObservationsJson(), new TypeReference<List<String>>() {}));
            dto.setWatchItems(objectMapper.readValue(h.getWatchItemsJson(), new TypeReference<List<String>>() {}));
            dto.setCompletedTasks(objectMapper.readValue(h.getCompletedTasksJson(), new TypeReference<List<String>>() {}));
            dto.setPendingTasks(objectMapper.readValue(h.getPendingTasksJson(), new TypeReference<List<String>>() {}));
        } catch (Exception e) {
            dto.setTopObservations(new ArrayList<>());
            dto.setWatchItems(new ArrayList<>());
            dto.setCompletedTasks(new ArrayList<>());
            dto.setPendingTasks(new ArrayList<>());
        }
        return dto;
    }
}
