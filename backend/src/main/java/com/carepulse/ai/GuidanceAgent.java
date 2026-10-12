package com.carepulse.ai;

import com.carepulse.dto.ClinicalScenarioDto;
import com.carepulse.dto.GuidanceResponseDto;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GuidanceAgent {

    private final List<ClinicalScenarioDto> scenarios = new ArrayList<>();

    public GuidanceAgent() {
        initScenarios();
    }

    private void initScenarios() {
        ClinicalScenarioDto fall = new ClinicalScenarioDto();
        fall.setId("patient-fall");
        fall.setTitle("Patient Sustained a Fall");
        fall.setDescription("Protocol for assessing and responding when a patient slips, trips, or is found on the floor.");
        fall.setIcon("alert-triangle");
        fall.setWhatToCheck(Arrays.asList(
                "Check responsiveness, airway, breathing, and consciousness immediately.",
                "Look for visible bleeding, open wounds, limb deformities, or swelling.",
                "Ask if they have neck, back, hip, or severe localized pain.",
                "Assess if the patient hit their head or lost consciousness even briefly."
        ));
        fall.setWhatToDoNow(Arrays.asList(
                "Keep the patient still on the floor if serious injury, spinal pain, or fracture is suspected.",
                "Do NOT force the patient to stand immediately.",
                "Cover with a warm blanket to prevent shock and stay beside them speaking calmly.",
                "If no pain or deformity is present, assist them slowly to a sturdy seated position."
        ));
        fall.setWhenToContactClinician(Arrays.asList(
                "The patient is on blood thinners (anticoagulants), even if no visible trauma is apparent.",
                "Minor bruising, scrapes, or mild joint stiffness that does not impair weight-bearing.",
                "Patient feels mild dizziness after standing."
        ));
        fall.setWhenToSeekEmergencyHelp(Arrays.asList(
                "Loss of consciousness, vomiting, dilated pupils, or confusion following a head strike.",
                "Inability to move limbs, asymmetric weakness, or severe excruciating pain.",
                "Shortness of breath, rapid heart rate, or significant external bleeding.",
                "Obvious deformity of hip, leg, or arm."
        ));
        scenarios.add(fall);

        ClinicalScenarioDto confusion = new ClinicalScenarioDto();
        confusion.setId("sudden-confusion");
        confusion.setTitle("Sudden Onset Confusion / Delirium");
        confusion.setDescription("Actionable guidance when a patient becomes acutely disoriented, agitated, or hallucinates.");
        confusion.setIcon("brain");
        confusion.setWhatToCheck(Arrays.asList(
                "Did this confusion develop suddenly over hours or days (indicative of acute delirium)?",
                "Check for signs of urinary tract infection (cloudy/foul urine, fever, burning, urinary frequency).",
                "Review recent medication changes, missed doses, or accidental double doses.",
                "Check blood sugar if diabetic and assess hydration status."
        ));
        confusion.setWhatToDoNow(Arrays.asList(
                "Maintain a calm, well-lit environment and reduce loud noises or chaos.",
                "Use gentle, simple sentences and orient the patient to person, time, and location.",
                "Ensure safe footing and remove tripping hazards as delirium increases fall risk.",
                "Offer small sips of water to ensure hydration."
        ));
        confusion.setWhenToContactClinician(Arrays.asList(
                "New onset confusion lasting more than a few hours without emergency red flags.",
                "Suspected UTI, mild fever, or recent new prescription medication.",
                "Gradual behavioral agitation disrupting sleep."
        ));
        confusion.setWhenToSeekEmergencyHelp(Arrays.asList(
                "Sudden facial droop, arm drift, or slurred speech (Signs of Stroke - FAST).",
                "High fever with stiff neck or extreme lethargy where patient cannot be roused.",
                "Extreme respiratory distress or sudden loss of motor control."
        ));
        scenarios.add(confusion);

        ClinicalScenarioDto foodRefusal = new ClinicalScenarioDto();
        foodRefusal.setId("food-refusal");
        foodRefusal.setTitle("Patient Refuses Food or Drink");
        foodRefusal.setDescription("Managing poor nutritional intake, dysphagia, or appetite refusal safely.");
        foodRefusal.setIcon("utensils");
        foodRefusal.setWhatToCheck(Arrays.asList(
                "Check oral cavity for mouth sores, dentures fit, toothache, or oral thrush.",
                "Observe for difficulty swallowing, coughing, or choking while drinking.",
                "Review bowel habits (constipation frequently suppresses appetite in seniors).",
                "Assess for nausea, abdominal tenderness, or taste alteration."
        ));
        foodRefusal.setWhatToDoNow(Arrays.asList(
                "Offer small, frequent, nutrient-dense portions rather than large intimidating plates.",
                "Prioritize hydration: offer water, broths, electrolyte drinks, or favorite juices.",
                "Ensure upright 90-degree posture during eating and for 30 minutes afterward.",
                "Do NOT force-feed or rush the meal."
        ));
        foodRefusal.setWhenToContactClinician(Arrays.asList(
                "Food refusal persisting beyond 48 hours.",
                "Dark, concentrated urine, dry mucous membranes, or signs of dehydration.",
                "Unintentional weight loss observed over weeks."
        ));
        foodRefusal.setWhenToSeekEmergencyHelp(Arrays.asList(
                "Active choking, blue lips, or inability to breathe.",
                "Persistent vomiting with signs of shock or acute abdominal rigidity.",
                "Extreme lethargy or complete inability to swallow liquids."
        ));
        scenarios.add(foodRefusal);

        ClinicalScenarioDto breathing = new ClinicalScenarioDto();
        breathing.setId("trouble-breathing");
        breathing.setTitle("Shortness of Breath / Respiratory Distress");
        breathing.setDescription("Immediate triage protocol for breathing changes.");
        breathing.setIcon("wind");
        breathing.setWhatToCheck(Arrays.asList(
                "Are they gasping, wheezing, or using accessory chest/neck muscles to breathe?",
                "Check lips and fingernail beds for cyanosis (bluish tint).",
                "Ask if they have chest tightness, pain radiating to arm/jaw.",
                "Check oxygen saturation with pulse oximeter if available."
        ));
        breathing.setWhatToDoNow(Arrays.asList(
                "Position patient in an upright, seated position to maximize lung expansion.",
                "Loosen tight collar or clothing around the chest and neck.",
                "Provide calm reassurance and maintain open airflow (open window/fan).",
                "Administer prescribed rescue inhaler or home oxygen if ordered."
        ));
        breathing.setWhenToContactClinician(Arrays.asList(
                "Mild chronic cough or baseline COPD shortness of breath responsive to inhaler.",
                "Mild ankle swelling accompanied by gradual breathing fatigue over days."
        ));
        breathing.setWhenToSeekEmergencyHelp(Arrays.asList(
                "Severe sudden onset shortness of breath or inability to speak full sentences.",
                "Blue lips or face, stridor, or severe chest pain/pressure.",
                "SpO2 below 90% despite prescribed supplemental oxygen."
        ));
        scenarios.add(breathing);

        ClinicalScenarioDto medication = new ClinicalScenarioDto();
        medication.setId("missed-medication");
        medication.setTitle("Missed or Refused Medication");
        medication.setDescription("Safety steps when scheduled prescription doses are omitted.");
        medication.setIcon("pill");
        medication.setWhatToCheck(Arrays.asList(
                "Identify the exact medication, dosage, and scheduled time.",
                "Determine how many hours have passed since the intended dose.",
                "Review medication guidelines (e.g., insulin, blood pressure, blood thinner, antibiotic)."
        ));
        medication.setWhatToDoNow(Arrays.asList(
                "Never double up doses unless specifically advised by physician or pharmacist.",
                "Log the exact missed dose in CarePulse AI tasks and notes.",
                "Consult the patient's pharmacist or on-call clinician for timing adjustments."
        ));
        medication.setWhenToContactClinician(Arrays.asList(
                "Missed critical medications such as insulin, anti-epileptic, or cardiovascular drugs.",
                "Patient repeatedly refuses medication due to swallowing difficulty or agitation."
        ));
        medication.setWhenToSeekEmergencyHelp(Arrays.asList(
                "Severe symptoms emerge following missed dose (e.g., seizures, chest pain, dangerously high BP)."
        ));
        scenarios.add(medication);
    }

    public List<ClinicalScenarioDto> getAllScenarios() {
        return scenarios;
    }

    public GuidanceResponseDto getGuidanceForObservation(String text) {
        String lower = text != null ? text.toLowerCase(Locale.ROOT) : "";
        GuidanceResponseDto resp = new GuidanceResponseDto();

        if (lower.contains("fell") || lower.contains("fall") || lower.contains("slip")) {
            resp.setTitle("Post-Fall Safety Guidance");
            resp.setScenario("Patient Fall Event");
            resp.setImmediateActions(Arrays.asList(
                    "Keep patient still while checking for neck, spine, or hip pain.",
                    "Do NOT force the patient to get up immediately.",
                    "Inspect head and limbs for swelling, bleeding, or bruising.",
                    "If safe, assist gently to a sturdy chair with two helpers."
            ));
            resp.setWarningSigns(Arrays.asList(
                    "Head strike followed by confusion, nausea, or drowsiness.",
                    "Inability to bear weight on legs or severe hip/groin pain.",
                    "Patient is taking blood thinners."
            ));
            resp.setRecommendedEscalation("Perform clinical evaluation and notify care coordinator.");
            resp.setEmergency(false);
            return resp;
        }

        if (lower.contains("breath") || lower.contains("chest") || lower.contains("chok")) {
            resp.setTitle("URGENT: Respiratory / Cardiac Warning Protocol");
            resp.setScenario("Possible Medical Emergency");
            resp.setImmediateActions(Arrays.asList(
                    "Call emergency medical services (108/112) immediately.",
                    "Keep patient upright and comfortable.",
                    "Do not leave patient unattended."
            ));
            resp.setWarningSigns(Arrays.asList(
                    "Blue/gray lips, inability to speak full sentences, sudden chest heaviness."
            ));
            resp.setRecommendedEscalation("IMMEDIATE_EMERGENCY_SERVICES");
            resp.setEmergency(true);
            return resp;
        }

        if (lower.contains("confus") || lower.contains("disorient") || lower.contains("forgot")) {
            resp.setTitle("Acute Confusion Management");
            resp.setScenario("Cognitive Fluctuation");
            resp.setImmediateActions(Arrays.asList(
                    "Speak softly in short, clear sentences.",
                    "Check for fever, urinary discomfort, or dehydration.",
                    "Verify medications were taken correctly today.",
                    "Maintain good lighting and familiar comforting objects."
            ));
            resp.setWarningSigns(Arrays.asList(
                    "Sudden facial asymmetry or slurred speech (call 108).",
                    "Extreme agitation or uncharacteristic aggression."
            ));
            resp.setRecommendedEscalation("Notify clinical team for infection/delirium screening.");
            resp.setEmergency(false);
            return resp;
        }

        if (lower.contains("refus") || lower.contains("appetite") || lower.contains("food") || lower.contains("eat")) {
            resp.setTitle("Nutritional Intake Guidance");
            resp.setScenario("Reduced Appetite / Food Refusal");
            resp.setImmediateActions(Arrays.asList(
                    "Offer small sips of electrolyte fluid or favorite beverage.",
                    "Present small snack-sized nutrient items without pressure.",
                    "Check for mouth sores or swallowing difficulty.",
                    "Log fluid intake over the next 4 hours."
            ));
            resp.setWarningSigns(Arrays.asList(
                    "Complete refusal of liquids for over 24 hours.",
                    "Dry mouth, dark urine, or extreme lethargy."
            ));
            resp.setRecommendedEscalation("Consult care coordinator and monitor meal adherence.");
            resp.setEmergency(false);
            return resp;
        }

        resp.setTitle("General Caregiver Guidance");
        resp.setScenario("Routine Care Observation");
        resp.setImmediateActions(Arrays.asList(
                "Document specifics in CarePulse AI timeline.",
                "Ensure patient comfort, warmth, and hydration.",
                "Review pending care tasks for this shift."
        ));
        resp.setWarningSigns(Arrays.asList(
                "Sudden drastic departure from baseline mobility or mental clarity."
        ));
        resp.setRecommendedEscalation("Continue routine monitoring.");
        resp.setEmergency(false);
        return resp;
    }
}
