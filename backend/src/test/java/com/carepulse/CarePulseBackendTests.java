package com.carepulse;

import com.carepulse.ai.BurnoutAgent;
import com.carepulse.ai.ObservationAgent;
import com.carepulse.dto.BurnoutRiskDto;
import com.carepulse.dto.ObservationExtractionResult;
import com.carepulse.entity.CareTask;
import com.carepulse.entity.Role;
import com.carepulse.entity.User;
import com.carepulse.entity.WellbeingCheckin;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CarePulseBackendTests {

    @Test
    void testObservationAgentClassification() {
        ObservationAgent agent = new ObservationAgent();
        ObservationExtractionResult res = agent.extractStructuredSignals("Mom refused breakfast twice today and seemed more confused than usual.");
        assertNotNull(res);
        assertEquals("POOR", res.getAppetite());
        assertEquals("INCREASED_CONFUSION", res.getCognitiveChange());
        assertEquals("MODERATE", res.getSeverity());
        assertFalse(res.isEmergency());
    }

    @Test
    void testFallScenarioEmergencyDetection() {
        ObservationAgent agent = new ObservationAgent();
        ObservationExtractionResult res = agent.extractStructuredSignals("Patient fell while getting out of bed and has severe pain.");
        assertNotNull(res);
        assertEquals("FALL", res.getCategory());
        assertEquals("HIGH", res.getSeverity());
        assertEquals("CLINICAL_REVIEW", res.getEscalationLevel());
    }

    @Test
    void testBurnoutAgentCalculation() {
        BurnoutAgent agent = new BurnoutAgent();
        User user = new User("Test Caregiver", "test@carepulse.com", "pass", "123", Role.FAMILY_CAREGIVER);
        user.setId(99L);

        List<CareTask> tasks = new ArrayList<>();
        CareTask t1 = new CareTask();
        t1.setStatus("OVERDUE");
        CareTask t2 = new CareTask();
        t2.setStatus("OVERDUE");
        tasks.add(t1);
        tasks.add(t2);

        WellbeingCheckin checkin = new WellbeingCheckin();
        checkin.setMoodRating("VERY_OVERWHELMED");

        BurnoutRiskDto risk = agent.calculateBurnoutRisk(user, tasks, new ArrayList<>(), checkin);
        assertNotNull(risk);
        assertTrue(risk.getScore() >= 60, "Score should reflect high caregiver strain");
        assertTrue(risk.getLevel().equals("HIGH") || risk.getLevel().equals("CRITICAL"));
        assertFalse(risk.getFactors().isEmpty());
        assertFalse(risk.getRecommendations().isEmpty());
    }
}
