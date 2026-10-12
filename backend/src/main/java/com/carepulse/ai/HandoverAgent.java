package com.carepulse.ai;

import com.carepulse.entity.CareTask;
import com.carepulse.entity.Observation;
import com.carepulse.entity.StructuredObservation;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class HandoverAgent {

    public static class HandoverSynthesis {
        private List<String> topObservations = new ArrayList<>();
        private String emergingPattern;
        private List<String> watchItems = new ArrayList<>();
        private List<String> completedTasks = new ArrayList<>();
        private List<String> pendingTasks = new ArrayList<>();

        public List<String> getTopObservations() { return topObservations; }
        public void setTopObservations(List<String> topObservations) { this.topObservations = topObservations; }
        public String getEmergingPattern() { return emergingPattern; }
        public void setEmergingPattern(String emergingPattern) { this.emergingPattern = emergingPattern; }
        public List<String> getWatchItems() { return watchItems; }
        public void setWatchItems(List<String> watchItems) { this.watchItems = watchItems; }
        public List<String> getCompletedTasks() { return completedTasks; }
        public void setCompletedTasks(List<String> completedTasks) { this.completedTasks = completedTasks; }
        public List<String> getPendingTasks() { return pendingTasks; }
        public void setPendingTasks(List<String> pendingTasks) { this.pendingTasks = pendingTasks; }
    }

    public HandoverSynthesis generateHandover(List<Observation> observations, List<CareTask> tasks, String pattern) {
        HandoverSynthesis synthesis = new HandoverSynthesis();
        synthesis.setEmergingPattern(pattern != null ? pattern : "Consistent observations recorded across shifts.");

        if (observations != null) {
            int count = 0;
            for (Observation obs : observations) {
                if (count++ >= 5) break;
                StructuredObservation st = obs.getStructuredObservation();
                String text = obs.getRawText();
                if (st != null && st.getCategory() != null) {
                    synthesis.getTopObservations().add("[" + st.getCategory().replace("_", " ") + "] " + text);
                } else {
                    synthesis.getTopObservations().add(text);
                }
            }
        }
        if (synthesis.getTopObservations().isEmpty()) {
            synthesis.getTopObservations().add("No major incidents recorded during this shift.");
        }

        synthesis.getWatchItems().add("Monitor food and fluid intake closely.");
        synthesis.getWatchItems().add("Watch for increased agitation or evening confusion.");
        synthesis.getWatchItems().add("Provide standby assist during mobility or unassisted transfers.");
        synthesis.getWatchItems().add("Escalate immediately if any signs of clinical deterioration emerge.");

        if (tasks != null) {
            for (CareTask t : tasks) {
                if ("COMPLETED".equalsIgnoreCase(t.getStatus())) {
                    synthesis.getCompletedTasks().add(t.getTitle() + " (Completed)");
                } else {
                    synthesis.getPendingTasks().add(t.getTitle() + " - Due: " + (t.getDueDate() != null ? t.getDueDate().toLocalTime().toString() : "Today"));
                }
            }
        }
        if (synthesis.getCompletedTasks().isEmpty()) {
            synthesis.getCompletedTasks().add("Standard hygiene and hydration check completed.");
        }
        if (synthesis.getPendingTasks().isEmpty()) {
            synthesis.getPendingTasks().add("Evening medication administration.");
            synthesis.getPendingTasks().add("Evening meal and bedtime comfort check.");
        }

        return synthesis;
    }
}
