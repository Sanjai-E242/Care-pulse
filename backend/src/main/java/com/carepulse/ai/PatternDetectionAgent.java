package com.carepulse.ai;

import com.carepulse.entity.Observation;
import com.carepulse.entity.StructuredObservation;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatternDetectionAgent {

    public static class PatternAnalysis {
        private String emergingPattern;
        private String suggestedFollowup;
        private boolean alertRequired;
        private String alertSeverity;

        public PatternAnalysis(String emergingPattern, String suggestedFollowup, boolean alertRequired, String alertSeverity) {
            this.emergingPattern = emergingPattern;
            this.suggestedFollowup = suggestedFollowup;
            this.alertRequired = alertRequired;
            this.alertSeverity = alertSeverity;
        }

        public String getEmergingPattern() { return emergingPattern; }
        public String getSuggestedFollowup() { return suggestedFollowup; }
        public boolean isAlertRequired() { return alertRequired; }
        public String getAlertSeverity() { return alertSeverity; }
    }

    public PatternAnalysis detectPatterns(List<Observation> recentObservations) {
        if (recentObservations == null || recentObservations.isEmpty()) {
            return new PatternAnalysis(
                    "No historical patterns detected yet.",
                    "Continue baseline daily observations.",
                    false,
                    "INFO"
            );
        }

        int poorAppetiteCount = 0;
        int confusionCount = 0;
        int fallCount = 0;
        int mobilityCount = 0;
        int agitationCount = 0;

        for (Observation obs : recentObservations) {
            StructuredObservation st = obs.getStructuredObservation();
            if (st != null) {
                if ("POOR".equalsIgnoreCase(st.getAppetite()) || "REFUSED".equalsIgnoreCase(st.getAppetite())) {
                    poorAppetiteCount++;
                }
                if ("INCREASED_CONFUSION".equalsIgnoreCase(st.getCognitiveChange()) || "CONFUSION".equalsIgnoreCase(st.getCategory())) {
                    confusionCount++;
                }
                if ("FALL".equalsIgnoreCase(st.getCategory()) || st.isEmergency()) {
                    fallCount++;
                }
                if ("SLIGHTLY_REDUCED".equalsIgnoreCase(st.getMobilityChange()) || "MOBILITY".equalsIgnoreCase(st.getCategory())) {
                    mobilityCount++;
                }
                if ("BEHAVIORAL_CHANGE".equalsIgnoreCase(st.getCategory())) {
                    agitationCount++;
                }
            }
        }

        if (fallCount >= 1) {
            return new PatternAnalysis(
                    "Patient sustained a fall incident within the active observation window with heightened mobility instability.",
                    "Verify complete physical trauma assessment, assist with all transfers, and review environment for trip hazards.",
                    true,
                    "HIGH"
            );
        }

        if (poorAppetiteCount >= 2 && confusionCount >= 1) {
            return new PatternAnalysis(
                    "Reduced food and fluid intake observed across multiple observations, coinciding with increased confusion and fatigue.",
                    "Monitor hydration closely, assess for urinary tract or systemic infection indicators, and request care coordinator/clinical review.",
                    true,
                    "HIGH"
            );
        }

        if (poorAppetiteCount >= 2) {
            return new PatternAnalysis(
                    "Consistent pattern of diminished food intake noted across multiple shifts.",
                    "Record fluid volumes, consider smaller frequent nutrient-dense snacks, and consult care team.",
                    true,
                    "MEDIUM"
            );
        }

        if (confusionCount >= 2) {
            return new PatternAnalysis(
                    "Recurrent episodes of disorientation noted, particularly during late afternoon/evening hours.",
                    "Provide reassuring cues, reduce evening sensory overload, and evaluate sleep quality.",
                    true,
                    "MEDIUM"
            );
        }

        if (agitationCount >= 2) {
            return new PatternAnalysis(
                    "Cluster of heightened restlessness and behavioral agitation observed.",
                    "Assess comfort levels, evaluate pain status, and encourage gentle familiar routines.",
                    false,
                    "LOW"
            );
        }

        return new PatternAnalysis(
                "Patient observations remain within manageable baseline variance over the last several shifts.",
                "Continue standard care routine and timely documentation.",
                false,
                "LOW"
        );
    }
}
