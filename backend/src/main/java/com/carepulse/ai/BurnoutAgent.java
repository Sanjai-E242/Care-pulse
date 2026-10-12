package com.carepulse.ai;

import com.carepulse.dto.BurnoutRiskDto;
import com.carepulse.entity.CareTask;
import com.carepulse.entity.Observation;
import com.carepulse.entity.User;
import com.carepulse.entity.WellbeingCheckin;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BurnoutAgent {

    public BurnoutRiskDto calculateBurnoutRisk(User caregiver,
                                              List<CareTask> assignedTasks,
                                              List<Observation> recentObservations,
                                              WellbeingCheckin latestCheckin) {
        BurnoutRiskDto dto = new BurnoutRiskDto();
        dto.setCaregiverId(caregiver.getId());
        dto.setCaregiverName(caregiver.getFullName());

        int score = 15;
        List<String> factors = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        int overdueTasks = 0;
        int activeTasks = 0;
        if (assignedTasks != null) {
            for (CareTask t : assignedTasks) {
                if ("OVERDUE".equalsIgnoreCase(t.getStatus())) overdueTasks++;
                if (!"COMPLETED".equalsIgnoreCase(t.getStatus())) activeTasks++;
            }
        }
        dto.setOverdueTasksCount(overdueTasks);
        dto.setActiveTasksCount(activeTasks);
        dto.setTotalObservationsCount(recentObservations != null ? recentObservations.size() : 0);

        if (overdueTasks > 0) {
            score += Math.min(30, overdueTasks * 12);
            factors.add("Multiple care tasks are currently overdue (" + overdueTasks + " overdue)");
        }
        if (activeTasks >= 5) {
            score += 15;
            factors.add("High active caregiving task volume (" + activeTasks + " open tasks)");
        }

        int negativeObs = 0;
        if (recentObservations != null && !recentObservations.isEmpty()) {
            for (Observation obs : recentObservations) {
                if (obs.getStructuredObservation() != null) {
                    String sent = obs.getStructuredObservation().getSentiment();
                    if ("CONCERNED".equalsIgnoreCase(sent) || "DISTRESSED".equalsIgnoreCase(sent)) {
                        negativeObs++;
                    }
                }
            }
            if (negativeObs >= 3) {
                score += 20;
                factors.add("Frequent emotionally distressing observations recorded (" + negativeObs + " stressful entries)");
            }
        }

        if (latestCheckin != null && latestCheckin.getMoodRating() != null) {
            switch (latestCheckin.getMoodRating().toUpperCase()) {
                case "STRUGGLING":
                    score += 35;
                    factors.add("Caregiver self-reported 'Struggling' in recent wellbeing check-in");
                    break;
                case "VERY_OVERWHELMED":
                    score += 25;
                    factors.add("Caregiver self-reported 'Very Overwhelmed' in recent wellbeing check-in");
                    break;
                case "A_LITTLE_OVERWHELMED":
                    score += 10;
                    factors.add("Caregiver self-reported moderate strain");
                    break;
                default:
                    score = Math.max(10, score - 10);
                    break;
            }
        }

        score = Math.min(100, Math.max(5, score));
        dto.setScore(score);

        if (score <= 30) {
            dto.setLevel("LOW");
            recommendations.add("Maintain steady pace and healthy rest intervals.");
            recommendations.add("Keep up routine hydration and self-care practices.");
        } else if (score <= 60) {
            dto.setLevel("MODERATE");
            recommendations.add("Redistribute 1 or 2 non-urgent tasks to family members.");
            recommendations.add("Schedule a short respite break during the afternoon.");
            recommendations.add("Complete regular wellbeing check-ins.");
        } else if (score <= 80) {
            dto.setLevel("HIGH");
            recommendations.add("Redistribute pending care tasks immediately to avoid exhaustion.");
            recommendations.add("Notify care coordinator for temporary workload rebalancing.");
            recommendations.add("Engage family care circle for shared meal or medication coverage.");
            recommendations.add("Take an urgent structured wellbeing break.");
        } else {
            dto.setLevel("CRITICAL");
            recommendations.add("Urgent intervention recommended: transfer direct shift responsibilities.");
            recommendations.add("Contact care coordinator or family lead immediately.");
            recommendations.add("Access caregiver respite and peer-support counseling resources.");
        }

        if (factors.isEmpty()) {
            factors.add("Task load and care schedule are currently balanced");
        }

        dto.setFactors(factors);
        dto.setRecommendations(recommendations);
        return dto;
    }
}
