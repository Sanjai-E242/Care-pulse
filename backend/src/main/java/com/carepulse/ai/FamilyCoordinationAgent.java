package com.carepulse.ai;

import com.carepulse.dto.FamilySummaryDto;
import com.carepulse.entity.FamilyDiscussion;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FamilyCoordinationAgent {

    public FamilySummaryDto summarizeDiscussion(String patientName, List<FamilyDiscussion> discussions) {
        FamilySummaryDto summary = new FamilySummaryDto();
        summary.setPatientName(patientName != null ? patientName : "Patient");

        if (discussions == null || discussions.isEmpty()) {
            summary.setNeutralSummary("No family discussions recorded yet. Start a discussion to coordinate care.");
            summary.setAgreementPoints(new ArrayList<>());
            summary.setDisagreementPoints(new ArrayList<>());
            summary.setSuggestedActionItems(new ArrayList<>());
            return summary;
        }

        List<String> agreements = new ArrayList<>();
        List<String> disagreements = new ArrayList<>();
        List<String> actions = new ArrayList<>();

        boolean mentionsConfusion = false;
        boolean mentionsDoctor = false;
        boolean mentionsFood = false;

        for (FamilyDiscussion disc : discussions) {
            String m = disc.getMessage().toLowerCase();
            if (m.contains("confus") || m.contains("forget")) mentionsConfusion = true;
            if (m.contains("doctor") || m.contains("clinic") || m.contains("appoint")) mentionsDoctor = true;
            if (m.contains("food") || m.contains("eat") || m.contains("breakfast") || m.contains("dinner")) mentionsFood = true;
        }

        if (mentionsConfusion) {
            agreements.add("Family members agree that evening confusion and fatigue have noticeably increased this week.");
        }
        if (mentionsDoctor) {
            disagreements.add("There are differing views on whether to schedule an immediate clinic appointment versus waiting for the scheduled weekend visit.");
            actions.add("Call Care Coordinator to clarify whether a clinical review should be expedited.");
        }
        if (mentionsFood) {
            agreements.add("Shared understanding that lighter, more frequent meals are needed during morning shifts.");
            actions.add("Coordinate family member rota for prepared soft meals this Friday and Saturday.");
        }

        if (agreements.isEmpty()) {
            agreements.add("Family team is actively communicating regarding daily care routines.");
        }
        if (actions.isEmpty()) {
            actions.add("Review the updated patient timeline before finalizing tomorrow's shift assignments.");
        }

        summary.setNeutralSummary("The family care circle has reviewed recent observations regarding " + summary.getPatientName() +
                ". Discussions reflect shared dedication to safety, with productive coordination around meal planning and clinical follow-ups.");
        summary.setAgreementPoints(agreements);
        summary.setDisagreementPoints(disagreements);
        summary.setSuggestedActionItems(actions);

        return summary;
    }
}
