package com.carepulse.controller;

import com.carepulse.ai.PatternDetectionAgent;
import com.carepulse.entity.Observation;
import com.carepulse.entity.StructuredObservation;
import com.carepulse.repository.ObservationRepository;
import com.carepulse.repository.PatientRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/intelligence")
@Tag(name = "Patient Intelligence", description = "Endpoints for temporal patient intelligence and longitudinal change signals")
public class TemporalIntelligenceController {

    private final ObservationRepository observationRepository;
    private final PatientRepository patientRepository;
    private final PatternDetectionAgent patternDetectionAgent;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd MMM yyyy");

    public TemporalIntelligenceController(ObservationRepository observationRepository,
                                          PatientRepository patientRepository,
                                          PatternDetectionAgent patternDetectionAgent) {
        this.observationRepository = observationRepository;
        this.patientRepository = patientRepository;
        this.patternDetectionAgent = patternDetectionAgent;
    }

    @GetMapping("/patient/{patientId}/changes")
    @Operation(summary = "Analyze longitudinal patient changes", description = "Returns detected signals, affected care domains, risk level, and clinical evidence")
    public ResponseEntity<Map<String, Object>> getPatientChanges(@PathVariable Long patientId) {
        List<Observation> observations = observationRepository.findByPatientIdOrderByCreatedAtDesc(patientId);

        Map<String, Object> result = new LinkedHashMap<>();

        if (observations.isEmpty()) {
            result.put("status", "NO_DATA");
            result.put("riskLevel", "LOW");
            result.put("riskScore", 10);
            result.put("progression", "STABLE");
            result.put("observationsAnalyzed", 0);
            result.put("baselineObservations", 0);
            result.put("totalChanges", 0);
            result.put("affectedDomains", 0);
            result.put("changedDomains", Collections.emptyList());
            result.put("domainChanges", Collections.emptyMap());
            result.put("evidence", Collections.singletonList("Baseline established. No abnormal variance recorded."));
            result.put("explanation", "No recorded changes outside normal baseline.");
            result.put("recommendedAction", "Continue standard care monitoring and observation logging.");
            return ResponseEntity.ok(result);
        }

        PatternDetectionAgent.PatternAnalysis analysis = patternDetectionAgent.detectPatterns(observations);

        int appetiteChanges = 0;
        int sleepChanges = 0;
        int cognitionChanges = 0;
        int mobilityChanges = 0;
        int emotionalChanges = 0;

        List<String> evidence = new ArrayList<>();

        for (Observation obs : observations) {
            StructuredObservation st = obs.getStructuredObservation();
            String dateStr = obs.getCreatedAt() != null ? obs.getCreatedAt().format(DATE_FORMAT) : "Recent";
            if (st != null) {
                if (st.getAppetite() != null && !"NORMAL".equalsIgnoreCase(st.getAppetite())) {
                    appetiteChanges++;
                    evidence.add("Appetite change: " + st.getAppetite() + " on " + dateStr);
                }
                if (st.getCognitiveChange() != null && !"NORMAL".equalsIgnoreCase(st.getCognitiveChange())) {
                    cognitionChanges++;
                    evidence.add("Cognitive change: " + st.getCognitiveChange() + " on " + dateStr);
                }
                if (st.getMobilityChange() != null && !"NORMAL".equalsIgnoreCase(st.getMobilityChange())) {
                    mobilityChanges++;
                    evidence.add("Mobility change: " + st.getMobilityChange() + " on " + dateStr);
                }
                if (st.getSentiment() != null && ("NEGATIVE".equalsIgnoreCase(st.getSentiment()) || "ANXIOUS".equalsIgnoreCase(st.getSentiment()))) {
                    emotionalChanges++;
                    evidence.add("Emotional wellbeing shift: " + st.getSentiment() + " on " + dateStr);
                }
                if ("SLEEP".equalsIgnoreCase(st.getCategory()) || (st.getSummaryText() != null && st.getSummaryText().toLowerCase().contains("sleep"))) {
                    sleepChanges++;
                    evidence.add("Sleep disruption noted on " + dateStr);
                }
            }
        }

        int totalChanges = appetiteChanges + sleepChanges + cognitionChanges + mobilityChanges + emotionalChanges;
        int affectedDomains = 0;
        List<String> changedDomains = new ArrayList<>();
        Map<String, Integer> domainChanges = new LinkedHashMap<>();

        if (appetiteChanges > 0) { affectedDomains++; changedDomains.add("appetite"); domainChanges.put("appetite", appetiteChanges); }
        if (sleepChanges > 0) { affectedDomains++; changedDomains.add("sleep"); domainChanges.put("sleep", sleepChanges); }
        if (cognitionChanges > 0) { affectedDomains++; changedDomains.add("cognition"); domainChanges.put("cognition", cognitionChanges); }
        if (mobilityChanges > 0) { affectedDomains++; changedDomains.add("mobility"); domainChanges.put("mobility", mobilityChanges); }
        if (emotionalChanges > 0) { affectedDomains++; changedDomains.add("emotional"); domainChanges.put("emotional", emotionalChanges); }

        int riskScore = Math.min(100, Math.max(25, totalChanges * 12 + affectedDomains * 10 + (analysis.isAlertRequired() ? 25 : 0)));
        String riskLevel = riskScore >= 70 ? "HIGH" : (riskScore >= 40 ? "MODERATE" : "LOW");
        String progression = analysis.isAlertRequired() || totalChanges >= 3 ? "WORSENING" : "STABLE";
        String status = totalChanges >= 2 ? "CHANGE_PATTERN_DETECTED" : "NO_SIGNIFICANT_PATTERN";

        String explanation = analysis.getEmergingPattern();
        String recommendedAction = analysis.getSuggestedFollowup();

        result.put("status", status);
        result.put("riskLevel", riskLevel);
        result.put("riskScore", riskScore);
        result.put("progression", progression);
        result.put("observationsAnalyzed", observations.size());
        result.put("baselineObservations", 1);
        result.put("totalChanges", totalChanges);
        result.put("affectedDomains", affectedDomains);
        result.put("changedDomains", changedDomains);
        result.put("domainChanges", domainChanges);
        result.put("evidence", evidence.isEmpty() ? Collections.singletonList("All observed indicators remain close to normal.") : evidence);
        result.put("explanation", explanation);
        result.put("recommendedAction", recommendedAction);

        return ResponseEntity.ok(result);
    }
}
