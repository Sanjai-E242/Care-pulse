package com.carepulse.service;

import com.carepulse.ai.BurnoutAgent;
import com.carepulse.dto.BurnoutRiskDto;
import com.carepulse.dto.WellbeingCheckinRequest;
import com.carepulse.entity.*;
import com.carepulse.exception.ResourceNotFoundException;
import com.carepulse.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BurnoutService {

    private final UserRepository userRepository;
    private final CareTaskRepository careTaskRepository;
    private final ObservationRepository observationRepository;
    private final WellbeingCheckinRepository wellbeingCheckinRepository;
    private final BurnoutAssessmentRepository burnoutAssessmentRepository;
    private final CaregiverProfileRepository caregiverProfileRepository;
    private final BurnoutAgent burnoutAgent;
    private final AuthService authService;

    public BurnoutService(UserRepository userRepository,
                          CareTaskRepository careTaskRepository,
                          ObservationRepository observationRepository,
                          WellbeingCheckinRepository wellbeingCheckinRepository,
                          BurnoutAssessmentRepository burnoutAssessmentRepository,
                          CaregiverProfileRepository caregiverProfileRepository,
                          BurnoutAgent burnoutAgent,
                          AuthService authService) {
        this.userRepository = userRepository;
        this.careTaskRepository = careTaskRepository;
        this.observationRepository = observationRepository;
        this.wellbeingCheckinRepository = wellbeingCheckinRepository;
        this.burnoutAssessmentRepository = burnoutAssessmentRepository;
        this.caregiverProfileRepository = caregiverProfileRepository;
        this.burnoutAgent = burnoutAgent;
        this.authService = authService;
    }

    public BurnoutRiskDto getBurnoutRisk(Long caregiverId) {
        User caregiver = caregiverId != null
                ? userRepository.findById(caregiverId).orElseThrow(() -> new ResourceNotFoundException("Caregiver not found"))
                : authService.getCurrentUser();

        List<CareTask> tasks = careTaskRepository.findByAssignedCaregiverId(caregiver.getId());
        List<Observation> observations = observationRepository.findByCaregiverIdOrderByCreatedAtDesc(caregiver.getId());
        List<WellbeingCheckin> checkins = wellbeingCheckinRepository.findByCaregiverIdOrderByCreatedAtDesc(caregiver.getId());
        WellbeingCheckin latestCheckin = checkins.isEmpty() ? null : checkins.get(0);

        BurnoutRiskDto risk = burnoutAgent.calculateBurnoutRisk(caregiver, tasks, observations, latestCheckin);

        // Update profile
        caregiverProfileRepository.findByUserId(caregiver.getId()).ifPresent(p -> {
            p.setCurrentBurnoutScore(risk.getScore());
            p.setCurrentBurnoutLevel(risk.getLevel());
            p.setUpdatedAt(LocalDateTime.now());
            caregiverProfileRepository.save(p);
        });

        return risk;
    }

    @Transactional
    public BurnoutRiskDto recordWellbeingCheckin(WellbeingCheckinRequest req) {
        User caregiver = req.getCaregiverId() != null
                ? userRepository.findById(req.getCaregiverId()).orElseThrow(() -> new ResourceNotFoundException("Caregiver not found"))
                : authService.getCurrentUser();

        WellbeingCheckin checkin = new WellbeingCheckin();
        checkin.setCaregiver(caregiver);
        checkin.setMoodRating(req.getMoodRating());
        checkin.setNotes(req.getNotes());
        wellbeingCheckinRepository.save(checkin);

        return getBurnoutRisk(caregiver.getId());
    }

    public List<WellbeingCheckin> getWellbeingHistory(Long caregiverId) {
        User caregiver = caregiverId != null
                ? userRepository.findById(caregiverId).orElseThrow(() -> new ResourceNotFoundException("Caregiver not found"))
                : authService.getCurrentUser();
        return wellbeingCheckinRepository.findByCaregiverIdOrderByCreatedAtDesc(caregiver.getId());
    }
}
