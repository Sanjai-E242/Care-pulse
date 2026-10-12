package com.carepulse.ai;

import com.carepulse.dto.ObservationExtractionResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class ObservationAgent {
    private static final Logger log = LoggerFactory.getLogger(ObservationAgent.class);

    @Value("${carepulse.ai.api-key:}")
    private String apiKey;

    public ObservationExtractionResult extractStructuredSignals(String rawText) {
        if (rawText == null || rawText.trim().isEmpty()) {
            ObservationExtractionResult empty = new ObservationExtractionResult();
            empty.setCategory("OTHER");
            empty.setSeverity("INFO");
            empty.setSentiment("NEUTRAL");
            empty.setSummaryText("No content provided.");
            empty.setExtractedSignals(new ArrayList<>());
            return empty;
        }

        try {
            return localClinicalRuleExtraction(rawText);
        } catch (Exception ex) {
            log.warn("AI extraction encountered an issue, applying safe fallback: {}", ex.getMessage());
            return safeFallback(rawText);
        }
    }

    private ObservationExtractionResult localClinicalRuleExtraction(String text) {
        String lower = text.toLowerCase(Locale.ROOT);
        ObservationExtractionResult result = new ObservationExtractionResult();
        List<String> signals = new ArrayList<>();

        boolean isEmergency = false;
        String category = "BEHAVIORAL_CHANGE";
        String severity = "LOW";
        String sentiment = "NEUTRAL";
        String appetite = "NORMAL";
        String cognitiveChange = "NONE";
        String mobilityChange = "UNCHANGED";
        String escalation = "NONE";
        String action = "MONITOR_AND_RECORD";

        if (lower.contains("breathing difficulty") || lower.contains("trouble breathing") ||
            lower.contains("unconscious") || lower.contains("passed out") ||
            lower.contains("chest pain") || lower.contains("major bleeding") ||
            lower.contains("stroke") || lower.contains("paralysis") || lower.contains("unresponsive")) {
            isEmergency = true;
            severity = "CRITICAL";
            escalation = "EMERGENCY";
            action = "SEEK_IMMEDIATE_EMERGENCY_MEDICAL_CARE";
            sentiment = "DISTRESSED";
            signals.add("Emergency red-flag symptoms detected");
        }

        if (lower.contains("fell") || lower.contains("fall") || lower.contains("dropped to floor") || lower.contains("slip")) {
            category = "FALL";
            mobilityChange = "REDUCED";
            sentiment = "CONCERNED";
            if (!isEmergency) {
                severity = "HIGH";
                escalation = "CLINICAL_REVIEW";
                action = "PERFORM_POST_FALL_ASSESSMENT_AND_NOTIFY_CARE_TEAM";
            }
            signals.add("Patient experienced a fall incident");
        }

        if (lower.contains("refused breakfast") || lower.contains("refused food") || lower.contains("refused lunch") ||
            lower.contains("refused dinner") || lower.contains("refused meal") || lower.contains("no appetite") ||
            lower.contains("barely ate") || lower.contains("poor appetite") || lower.contains("ate very little")) {
            appetite = "POOR";
            sentiment = "CONCERNED";
            if ("BEHAVIORAL_CHANGE".equals(category) || "OTHER".equals(category)) {
                category = "APPETITE";
            }
            signals.add("Poor appetite / Refusal of nutritional intake");
            if (!"HIGH".equals(severity) && !isEmergency) {
                severity = "MODERATE";
                action = "MONITOR_HYDRATION_AND_OFFER_EASY_NUTRITION";
            }
        }

        if (lower.contains("confused") || lower.contains("confusion") || lower.contains("disoriented") ||
            lower.contains("forgot") || lower.contains("hallucinat") || lower.contains("didn't recognize")) {
            cognitiveChange = "INCREASED_CONFUSION";
            sentiment = "CONCERNED";
            if (!"FALL".equals(category) && !isEmergency) {
                category = "CONFUSION";
                severity = "MODERATE";
                action = "MONITOR_ORIENTATION_AND_CHECK_FOR_UNDERLYING_INFECTION";
            }
            signals.add("Acute cognitive alteration / Increased confusion noted");
        }

        if (lower.contains("agitated") || lower.contains("restless") || lower.contains("aggressive") || lower.contains("pacing")) {
            if (!"FALL".equals(category) && !isEmergency) {
                category = "BEHAVIORAL_CHANGE";
                severity = "MODERATE";
                action = "PROVIDE_CALMING_ENVIRONMENT_AND_REASSURANCE";
            }
            sentiment = "CONCERNED";
            signals.add("Increased agitation / Behavioral restlessness");
        }

        if (lower.contains("unsteady") || lower.contains("reduced mobility") || lower.contains("struggled to walk") ||
            lower.contains("weak legs") || lower.contains("trouble standing")) {
            mobilityChange = "SLIGHTLY_REDUCED";
            if (!"FALL".equals(category) && !isEmergency) {
                category = "MOBILITY";
                if (!"HIGH".equals(severity)) severity = "MODERATE";
            }
            signals.add("Reduced mobility / Gait instability");
        }

        if (lower.contains("insomnia") || lower.contains("poor sleep") || lower.contains("interrupted sleep") ||
            lower.contains("awake all night") || lower.contains("tired") || lower.contains("fatigue")) {
            if ("BEHAVIORAL_CHANGE".equals(category)) category = "SLEEP";
            signals.add("Interrupted sleep / Excessive fatigue");
        }

        if (lower.contains("missed med") || lower.contains("refused medication") || lower.contains("pill") || lower.contains("dose")) {
            category = "MEDICATION_ADHERENCE";
            severity = "MODERATE";
            action = "RECHECK_MEDICATION_SCHEDULE_AND_CONSULT_CLINICIAN";
            signals.add("Medication administration variance");
        }

        if ("POOR".equals(appetite) && "INCREASED_CONFUSION".equals(cognitiveChange) && !isEmergency) {
            severity = "MODERATE";
            escalation = "NOTIFY_COORDINATOR";
            action = "MONITOR_AND_CONSIDER_CLINICAL_REVIEW";
            signals.add("Combined nutritional decline and cognitive change");
        }

        result.setCategory(category);
        result.setSeverity(severity);
        result.setSentiment(sentiment);
        result.setAppetite(appetite);
        result.setCognitiveChange(cognitiveChange);
        result.setMobilityChange(mobilityChange);
        result.setTimeReference("TODAY");
        result.setRecommendedAction(action);
        result.setEscalationLevel(escalation);
        result.setEmergency(isEmergency);
        result.setExtractedSignals(signals);

        StringBuilder sb = new StringBuilder();
        sb.append(category.replace("_", " ")).append(" noted (Severity: ").append(severity).append("). ");
        if (!"NORMAL".equals(appetite)) sb.append("Appetite: ").append(appetite).append(". ");
        if (!"NONE".equals(cognitiveChange)) sb.append("Cognition: ").append(cognitiveChange.replace("_", " ")).append(". ");
        if (isEmergency) sb.append("EMERGENCY PROTOCOL TRIGGERED. ");
        result.setSummaryText(sb.toString().trim());

        return result;
    }

    private ObservationExtractionResult safeFallback(String text) {
        ObservationExtractionResult res = new ObservationExtractionResult();
        res.setCategory("OTHER");
        res.setSeverity("LOW");
        res.setSentiment("NEUTRAL");
        res.setAppetite("NORMAL");
        res.setCognitiveChange("NONE");
        res.setMobilityChange("UNCHANGED");
        res.setTimeReference("TODAY");
        res.setRecommendedAction("MONITOR_AND_RECORD");
        res.setEscalationLevel("NONE");
        res.setEmergency(false);
        res.setSummaryText("Observation recorded. AI detailed analysis temporarily running in base mode.");
        List<String> signals = new ArrayList<>();
        signals.add("General caregiver note recorded");
        res.setExtractedSignals(signals);
        return res;
    }
}
