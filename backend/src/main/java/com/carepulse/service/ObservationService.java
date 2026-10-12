package com.carepulse.service;

import com.carepulse.ai.GuidanceAgent;
import com.carepulse.ai.ObservationAgent;
import com.carepulse.ai.PatternDetectionAgent;
import com.carepulse.dto.*;
import com.carepulse.entity.*;
import com.carepulse.exception.ResourceNotFoundException;
import com.carepulse.repository.AlertRepository;
import com.carepulse.repository.ObservationRepository;
import com.carepulse.repository.PatientRepository;
import com.carepulse.repository.StructuredObservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ObservationService {

    private final ObservationRepository observationRepository;
    private final StructuredObservationRepository structuredObservationRepository;
    private final PatientRepository patientRepository;
    private final ObservationAgent observationAgent;
    private final PatternDetectionAgent patternDetectionAgent;
    private final AlertRepository alertRepository;
    private final AuthService authService;

    public ObservationService(ObservationRepository observationRepository,
                              StructuredObservationRepository structuredObservationRepository,
                              PatientRepository patientRepository,
                              ObservationAgent observationAgent,
                              PatternDetectionAgent patternDetectionAgent,
                              AlertRepository alertRepository,
                              AuthService authService) {
        this.observationRepository = observationRepository;
        this.structuredObservationRepository = structuredObservationRepository;
        this.patientRepository = patientRepository;
        this.observationAgent = observationAgent;
        this.patternDetectionAgent = patternDetectionAgent;
        this.alertRepository = alertRepository;
        this.authService = authService;
    }

    public ObservationExtractionResult analyzeObservation(ObservationRequest request) {
        return observationAgent.extractStructuredSignals(request.getRawText());
    }

    @Transactional
    public ObservationDto confirmAndSave(ObservationConfirmRequest req) {
        User caregiver = authService.getCurrentUser();
        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        Observation obs = new Observation();
        obs.setPatient(patient);
        obs.setCaregiver(caregiver);
        obs.setRawText(req.getRawText());
        obs.setInputMethod(req.getInputMethod() != null ? req.getInputMethod() : "TEXT");
        obs.setAudioDurationSeconds(req.getAudioDurationSeconds());
        obs.setStatus("CONFIRMED");
        obs = observationRepository.save(obs);

        ObservationExtractionResult ext = req.getExtractedData();
        if (ext == null) {
            ext = observationAgent.extractStructuredSignals(req.getRawText());
        }

        StructuredObservation structured = new StructuredObservation();
        structured.setObservation(obs);
        structured.setCategory(ext.getCategory());
        structured.setSeverity(ext.getSeverity());
        structured.setSentiment(ext.getSentiment());
        structured.setAppetite(ext.getAppetite());
        structured.setCognitiveChange(ext.getCognitiveChange());
        structured.setMobilityChange(ext.getMobilityChange());
        structured.setTimeReference(ext.getTimeReference());
        structured.setRecommendedAction(ext.getRecommendedAction());
        structured.setEscalationLevel(ext.getEscalationLevel());
        structured.setEmergency(ext.isEmergency());
        structured.setSummaryText(ext.getSummaryText());
        structuredObservationRepository.save(structured);
        obs.setStructuredObservation(structured);

        // Update patient visual card status
        if (ext.getAppetite() != null && !"NORMAL".equalsIgnoreCase(ext.getAppetite())) {
            patient.setCurrentAppetite(ext.getAppetite());
        }
        if (ext.getCognitiveChange() != null && !"NONE".equalsIgnoreCase(ext.getCognitiveChange())) {
            patient.setCognitiveStatus(ext.getCognitiveChange().replace("_", " "));
            patient.setCurrentBehavior(ext.getCognitiveChange().replace("_", " "));
        }
        if ("FALL".equalsIgnoreCase(ext.getCategory())) {
            patient.setCurrentMobility("Reduced (Post-Fall)");
        }
        patient.setUpdatedAt(LocalDateTime.now());
        patientRepository.save(patient);

        // Check if an alert is warranted (Falls, Emergencies, High severity)
        if (ext.isEmergency() || "FALL".equalsIgnoreCase(ext.getCategory()) || "HIGH".equalsIgnoreCase(ext.getSeverity()) || "CRITICAL".equalsIgnoreCase(ext.getSeverity())) {
            Alert alert = new Alert();
            alert.setPatient(patient);
            alert.setObservation(obs);
            alert.setAlertType(ext.isEmergency() ? "EMERGENCY_SYMPTOMS" : ext.getCategory());
            alert.setSeverity(ext.isEmergency() ? "CRITICAL" : ext.getSeverity());
            alert.setTitle(ext.isEmergency() ? "EMERGENCY: Immediate Medical Alert" : "High Priority Alert: " + ext.getCategory().replace("_", " "));
            alert.setMessage("Alert triggered by observation: \"" + obs.getRawText() + "\". Action: " + ext.getRecommendedAction().replace("_", " "));
            alertRepository.save(alert);
        }

        // Temporal pattern detection
        List<Observation> recentObs = observationRepository.findByPatientIdOrderByCreatedAtDesc(patient.getId());
        PatternDetectionAgent.PatternAnalysis pattern = patternDetectionAgent.detectPatterns(recentObs);
        if (pattern.isAlertRequired()) {
            Alert patternAlert = new Alert();
            patternAlert.setPatient(patient);
            patternAlert.setObservation(obs);
            patternAlert.setAlertType("EMERGING_PATTERN");
            patternAlert.setSeverity(pattern.getAlertSeverity());
            patternAlert.setTitle("Emerging Clinical Trend: " + patient.getFullName());
            patternAlert.setMessage(pattern.getEmergingPattern() + " Follow-up: " + pattern.getSuggestedFollowup());
            alertRepository.save(patternAlert);
        }

        return toDto(obs);
    }

    public List<ObservationDto> getObservationsForPatient(Long patientId) {
        return observationRepository.findByPatientIdOrderByCreatedAtDesc(patientId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ObservationDto> getAllRecent() {
        return observationRepository.findAllByOrderByCreatedAtDesc()
                .stream().limit(20).map(this::toDto).collect(Collectors.toList());
    }

    public ObservationDto toDto(Observation o) {
        ObservationDto dto = new ObservationDto();
        dto.setId(o.getId());
        dto.setPatientId(o.getPatient().getId());
        dto.setPatientName(o.getPatient().getFullName());
        dto.setCaregiverId(o.getCaregiver().getId());
        dto.setCaregiverName(o.getCaregiver().getFullName());
        dto.setRawText(o.getRawText());
        dto.setInputMethod(o.getInputMethod());
        dto.setStatus(o.getStatus());
        dto.setCreatedAt(o.getCreatedAt());

        StructuredObservation st = o.getStructuredObservation();
        if (st != null) {
            dto.setCategory(st.getCategory());
            dto.setSeverity(st.getSeverity());
            dto.setSentiment(st.getSentiment());
            dto.setAppetite(st.getAppetite());
            dto.setCognitiveChange(st.getCognitiveChange());
            dto.setMobilityChange(st.getMobilityChange());
            dto.setRecommendedAction(st.getRecommendedAction());
            dto.setEscalationLevel(st.getEscalationLevel());
            dto.setEmergency(st.isEmergency());
            dto.setSummaryText(st.getSummaryText());
        }
        return dto;
    }
}
