package com.carepulse.config;

import com.carepulse.entity.*;
import com.carepulse.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final PatientCaregiverRepository patientCaregiverRepository;
    private final CaregiverProfileRepository caregiverProfileRepository;
    private final ObservationRepository observationRepository;
    private final StructuredObservationRepository structuredObservationRepository;
    private final ShiftRepository shiftRepository;
    private final HandoverRepository handoverRepository;
    private final CareTaskRepository careTaskRepository;
    private final BurnoutAssessmentRepository burnoutAssessmentRepository;
    private final WellbeingCheckinRepository wellbeingCheckinRepository;
    private final FamilyGroupRepository familyGroupRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final FamilyDiscussionRepository familyDiscussionRepository;
    private final AlertRepository alertRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public DataSeeder(UserRepository userRepository,
                      PatientRepository patientRepository,
                      PatientCaregiverRepository patientCaregiverRepository,
                      CaregiverProfileRepository caregiverProfileRepository,
                      ObservationRepository observationRepository,
                      StructuredObservationRepository structuredObservationRepository,
                      ShiftRepository shiftRepository,
                      HandoverRepository handoverRepository,
                      CareTaskRepository careTaskRepository,
                      BurnoutAssessmentRepository burnoutAssessmentRepository,
                      WellbeingCheckinRepository wellbeingCheckinRepository,
                      FamilyGroupRepository familyGroupRepository,
                      FamilyMemberRepository familyMemberRepository,
                      FamilyDiscussionRepository familyDiscussionRepository,
                      AlertRepository alertRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.patientCaregiverRepository = patientCaregiverRepository;
        this.caregiverProfileRepository = caregiverProfileRepository;
        this.observationRepository = observationRepository;
        this.structuredObservationRepository = structuredObservationRepository;
        this.shiftRepository = shiftRepository;
        this.handoverRepository = handoverRepository;
        this.careTaskRepository = careTaskRepository;
        this.burnoutAssessmentRepository = burnoutAssessmentRepository;
        this.wellbeingCheckinRepository = wellbeingCheckinRepository;
        this.familyGroupRepository = familyGroupRepository;
        this.familyMemberRepository = familyMemberRepository;
        this.familyDiscussionRepository = familyDiscussionRepository;
        this.alertRepository = alertRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            log.info("Database already contains data. Verifying demo users and shifts...");
            ensureDemoUsersExist();
            ensureThreeShiftsExist();
            return;
        }

        log.info("Starting CarePulse AI realistic demo data seeding...");

        // 1. Seed Users (4 Core Roles)
        User familyUser = new User("Sarah Johnson", "family@carepulse.com", passwordEncoder.encode("password123"), "+1 555-0101", Role.FAMILY_CAREGIVER);
        User profUser = new User("David Miller, CNA", "professional@carepulse.com", passwordEncoder.encode("password123"), "+1 555-0102", Role.PROFESSIONAL_CAREGIVER);
        User coordUser = new User("Elena Vance, RN", "coordinator@carepulse.com", passwordEncoder.encode("password123"), "+1 555-0103", Role.CARE_COORDINATOR);
        User clinicalUser = new User("Dr. Robert Chen, MD", "clinical@carepulse.com", passwordEncoder.encode("password123"), "+1 555-0104", Role.CLINICAL_STAFF);

        userRepository.saveAll(Arrays.asList(familyUser, profUser, coordUser, clinicalUser));

        // 2. Caregiver Profiles
        CaregiverProfile familyProfile = new CaregiverProfile(familyUser);
        familyProfile.setTotalCareHours(42);
        familyProfile.setConsecutiveCareDays(6);
        familyProfile.setCurrentBurnoutScore(58);
        familyProfile.setCurrentBurnoutLevel("MODERATE");
        caregiverProfileRepository.save(familyProfile);

        CaregiverProfile profProfile = new CaregiverProfile(profUser);
        profProfile.setTotalCareHours(38);
        profProfile.setWeeklyShifts(5);
        profProfile.setCurrentBurnoutScore(28);
        profProfile.setCurrentBurnoutLevel("LOW");
        caregiverProfileRepository.save(profProfile);

        // 3. Seed Patients (Mary Johnson 78, Robert Williams 82, Susan Miller 75)
        Patient mary = new Patient();
        mary.setFullName("Mary Johnson");
        mary.setAge(78);
        mary.setDateOfBirth(LocalDate.of(1948, 4, 12));
        mary.setGender("Female");
        mary.setBloodGroup("O+");
        mary.setEmergencyContact("Sarah Johnson (Daughter) - +1 555-0101");
        mary.setPrimaryCaregiverId(familyUser.getId());
        mary.setConditions("Mild Cognitive Impairment, Hypertension, Osteoarthritis (Bilateral knees)");
        mary.setAllergies("Penicillin (rash), Codeine (nausea)");
        mary.setMedications("Donepezil 10mg q.d., Lisinopril 20mg q.d., Acetaminophen 500mg prn");
        mary.setMobilityStatus("Assisted Walking with Walker");
        mary.setCognitiveStatus("Mild Evening Confusion");
        mary.setCurrentMood("Anxious");
        mary.setCurrentAppetite("Poor");
        mary.setCurrentSleep("Interrupted");
        mary.setCurrentMobility("Slightly Reduced");
        mary.setCurrentBehavior("Evening Restlessness");
        mary = patientRepository.save(mary);

        Patient robert = new Patient();
        robert.setFullName("Robert Williams");
        robert.setAge(82);
        robert.setDateOfBirth(LocalDate.of(1944, 9, 21));
        robert.setGender("Male");
        robert.setBloodGroup("A-");
        robert.setEmergencyContact("Michael Williams (Son) - +1 555-0202");
        robert.setPrimaryCaregiverId(profUser.getId());
        robert.setConditions("Type 2 Diabetes, Diabetic Neuropathy, Post-CVA Gait Deficit");
        robert.setAllergies("Sulfa Drugs");
        robert.setMedications("Metformin 850mg b.i.d., Glipizide 5mg, Atorvastatin 20mg");
        robert.setMobilityStatus("Wheelchair / Supervised Transfer");
        robert.setCognitiveStatus("Alert and Oriented x3");
        robert.setCurrentMood("Content");
        robert.setCurrentAppetite("Good");
        robert.setCurrentSleep("Restful");
        robert.setCurrentMobility("Steady with Wheelchair");
        robert.setCurrentBehavior("Calm");
        robert = patientRepository.save(robert);

        Patient susan = new Patient();
        susan.setFullName("Susan Miller");
        susan.setAge(75);
        susan.setDateOfBirth(LocalDate.of(1951, 2, 8));
        susan.setGender("Female");
        susan.setBloodGroup("B+");
        susan.setEmergencyContact("David Miller (Brother) - +1 555-0102");
        susan.setPrimaryCaregiverId(profUser.getId());
        susan.setConditions("Parkinson's Disease (Stage 2), Mild Depression");
        susan.setAllergies("Latex, Aspirin");
        susan.setMedications("Carbidopa-Levodopa 25/100 tid, Sertraline 50mg q.d.");
        susan.setMobilityStatus("Requires Standby Assistance");
        susan.setCognitiveStatus("Intact with Occasional Bradyphrenia");
        susan.setCurrentMood("Low");
        susan.setCurrentAppetite("Normal");
        susan.setCurrentSleep("Restless");
        susan.setCurrentMobility("Guarded Gait");
        susan.setCurrentBehavior("Cooperative");
        susan = patientRepository.save(susan);

        // Link PatientCaregivers
        patientCaregiverRepository.save(new PatientCaregiver(mary, familyUser, "Daughter & Primary Caregiver", true));
        patientCaregiverRepository.save(new PatientCaregiver(mary, profUser, "Visiting Caregiver CNA", false));
        patientCaregiverRepository.save(new PatientCaregiver(robert, profUser, "Assigned CNA", true));
        patientCaregiverRepository.save(new PatientCaregiver(susan, profUser, "Assigned CNA", true));

        // 4. Seed Historical Observations for Mary
        Observation obs1 = new Observation();
        obs1.setPatient(mary);
        obs1.setCaregiver(familyUser);
        obs1.setRawText("Patient refused breakfast this morning and stated she wasn't hungry at all.");
        obs1.setInputMethod("VOICE");
        obs1.setAudioDurationSeconds(8);
        obs1.setStatus("CONFIRMED");
        obs1.setCreatedAt(LocalDateTime.now().minusHours(8));
        obs1 = observationRepository.save(obs1);

        StructuredObservation st1 = new StructuredObservation();
        st1.setObservation(obs1);
        st1.setCategory("APPETITE");
        st1.setSeverity("MODERATE");
        st1.setSentiment("CONCERNED");
        st1.setAppetite("POOR");
        st1.setCognitiveChange("NONE");
        st1.setMobilityChange("UNCHANGED");
        st1.setTimeReference("THIS_MORNING");
        st1.setRecommendedAction("MONITOR_HYDRATION_AND_OFFER_EASY_NUTRITION");
        st1.setEscalationLevel("NONE");
        st1.setSummaryText("Appetite noted as Poor. Recommended hydration monitoring.");
        st1.setExtractedSignalsJson("[\"Poor appetite / Refusal of nutritional intake\"]");
        structuredObservationRepository.save(st1);

        Observation obs2 = new Observation();
        obs2.setPatient(mary);
        obs2.setCaregiver(familyUser);
        obs2.setRawText("Mom seemed more confused than usual around 2 PM and asked for her deceased sister.");
        obs2.setInputMethod("TEXT");
        obs2.setStatus("CONFIRMED");
        obs2.setCreatedAt(LocalDateTime.now().minusHours(4));
        obs2 = observationRepository.save(obs2);

        StructuredObservation st2 = new StructuredObservation();
        st2.setObservation(obs2);
        st2.setCategory("CONFUSION");
        st2.setSeverity("MODERATE");
        st2.setSentiment("CONCERNED");
        st2.setAppetite("POOR");
        st2.setCognitiveChange("INCREASED_CONFUSION");
        st2.setMobilityChange("UNCHANGED");
        st2.setTimeReference("TODAY");
        st2.setRecommendedAction("MONITOR_ORIENTATION_AND_CHECK_FOR_UNDERLYING_INFECTION");
        st2.setEscalationLevel("NOTIFY_COORDINATOR");
        st2.setSummaryText("Acute cognitive change: Increased confusion reported.");
        st2.setExtractedSignalsJson("[\"Acute cognitive alteration / Increased confusion noted\"]");
        structuredObservationRepository.save(st2);

        // 5. Seed Care Tasks
        CareTask t1 = new CareTask();
        t1.setTitle("Morning Medication & Blood Pressure");
        t1.setDescription("Administer Lisinopril 20mg and record sitting blood pressure.");
        t1.setPatient(mary);
        t1.setAssignedCaregiver(familyUser);
        t1.setCreatedBy(coordUser);
        t1.setDueDate(LocalDateTime.now().minusHours(2));
        t1.setPriority("HIGH");
        t1.setStatus("COMPLETED");
        t1.setCategory("MEDICATION");
        t1.setCompletedAt(LocalDateTime.now().minusHours(2));

        CareTask t2 = new CareTask();
        t2.setTitle("Hydration & Protein Shake Assist");
        t2.setDescription("Ensure at least 250ml fluid and 1 nutrient supplement drink consumed.");
        t2.setPatient(mary);
        t2.setAssignedCaregiver(familyUser);
        t2.setCreatedBy(familyUser);
        t2.setDueDate(LocalDateTime.now().plusHours(2));
        t2.setPriority("HIGH");
        t2.setStatus("TODO");
        t2.setCategory("NUTRITION");

        CareTask t3 = new CareTask();
        t3.setTitle("Gait & Range-of-Motion Exercises");
        t3.setDescription("Supervised indoor walking 10 minutes using rolling walker.");
        t3.setPatient(mary);
        t3.setAssignedCaregiver(profUser);
        t3.setCreatedBy(coordUser);
        t3.setDueDate(LocalDateTime.now().plusHours(5));
        t3.setPriority("MEDIUM");
        t3.setStatus("TODO");
        t3.setCategory("MOBILITY");

        CareTask t4 = new CareTask();
        t4.setTitle("Doctor Follow-up Preparation");
        t4.setDescription("Collate observation summary and medication adherence log for Dr. Chen.");
        t4.setPatient(mary);
        t4.setAssignedCaregiver(familyUser);
        t4.setCreatedBy(familyUser);
        t4.setDueDate(LocalDateTime.now().minusHours(24));
        t4.setPriority("MEDIUM");
        t4.setStatus("OVERDUE");
        t4.setCategory("APPOINTMENT");

        careTaskRepository.saveAll(Arrays.asList(t1, t2, t3, t4));

        // 6. Seed Shifts
        Shift morningShift = new Shift(profUser, "MORNING", "04:00 - 12:00", LocalDateTime.now().minusHours(4), LocalDateTime.now().plusHours(4), "ACTIVE");
        Shift afternoonShift = new Shift(profUser, "AFTERNOON", "12:00 - 20:00", LocalDateTime.now().plusHours(4), LocalDateTime.now().plusHours(12), "UPCOMING");
        Shift nightShift = new Shift(profUser, "NIGHT", "20:00 - 04:00", LocalDateTime.now().plusHours(12), LocalDateTime.now().plusHours(20), "UPCOMING");
        shiftRepository.saveAll(Arrays.asList(morningShift, afternoonShift, nightShift));

        // 7. Seed Handover
        Handover h1 = new Handover();
        h1.setPatient(mary);
        h1.setOutgoingCaregiver(profUser);
        h1.setIncomingCaregiver(familyUser);
        h1.setShiftName("Morning Shift (04:00 - 12:00)");
        h1.setTopObservationsJson(objectMapper.writeValueAsString(Arrays.asList(
                "[APPETITE] Patient refused breakfast twice.",
                "[CONFUSION] Increased agitation and confusion observed during midday.",
                "[MOBILITY] Mobility slightly reduced; assisted standby provided."
        )));
        h1.setEmergingPattern("Reduced appetite has been reported across the last two shifts with accompanying evening agitation.");
        h1.setWatchItemsJson(objectMapper.writeValueAsString(Arrays.asList(
                "Monitor food and fluid intake closely",
                "Watch for increased confusion or disorientation",
                "Assist during transfers from bed to chair",
                "Escalate significant deterioration to on-call nurse"
        )));
        h1.setCompletedTasksJson(objectMapper.writeValueAsString(Arrays.asList(
                "Morning medication administered",
                "Hygiene and skin check completed"
        )));
        h1.setPendingTasksJson(objectMapper.writeValueAsString(Arrays.asList(
                "Afternoon hydration assist",
                "Evening medication administration"
        )));
        h1.setReviewed(false);
        handoverRepository.save(h1);

        // 8. Seed Wellbeing Checkins
        WellbeingCheckin c1 = new WellbeingCheckin();
        c1.setCaregiver(familyUser);
        c1.setMoodRating("VERY_OVERWHELMED");
        c1.setNotes("Mom was confused and refused meals. I feel exhausted and need help managing evening routines.");
        wellbeingCheckinRepository.save(c1);

        // 9. Seed Family Circle
        FamilyGroup fg = new FamilyGroup(mary, "Mary Johnson Care Circle");
        fg = familyGroupRepository.save(fg);

        FamilyMember fm1 = new FamilyMember(fg, familyUser, "Daughter (Primary)", "Daily physical care, meals, and medication");
        FamilyMember fm2 = new FamilyMember(fg, profUser, "Assigned Home Care CNA", "Personal care, mobility assistance, shift reports");
        familyMemberRepository.saveAll(Arrays.asList(fm1, fm2));

        FamilyDiscussion d1 = new FamilyDiscussion();
        d1.setFamilyGroup(fg);
        d1.setUser(familyUser);
        d1.setMessage("Mom has been more confused in the evening this week. Has anyone else noticed this?");
        d1.setCategory("CONCERN");
        d1.setCreatedAt(LocalDateTime.now().minusDays(1));

        FamilyDiscussion d2 = new FamilyDiscussion();
        d2.setFamilyGroup(fg);
        d2.setUser(profUser);
        d2.setMessage("Yes, during yesterday's 14:00 shift she was disoriented to time. We should ensure she stays hydrated.");
        d2.setCategory("UPDATE");
        d2.setCreatedAt(LocalDateTime.now().minusHours(18));

        familyDiscussionRepository.saveAll(Arrays.asList(d1, d2));

        // 10. Seed Alerts
        Alert a1 = new Alert();
        a1.setPatient(mary);
        a1.setObservation(obs2);
        a1.setAlertType("CONFUSION");
        a1.setSeverity("HIGH");
        a1.setTitle("Moderate Confusion Spike: Mary Johnson");
        a1.setMessage("Caregiver observed acute cognitive change and food refusal. Infection or delirium screening recommended.");
        a1.setRead(false);
        a1.setResolved(false);

        Alert a2 = new Alert();
        a2.setPatient(mary);
        a2.setObservation(obs1);
        a2.setAlertType("POOR_APPETITE");
        a2.setSeverity("MEDIUM");
        a2.setTitle("Nutritional Intake Alert: Mary Johnson");
        a2.setMessage("Refused consecutive meals. Care team advised to monitor hydration.");
        a2.setRead(true);
        a2.setResolved(false);

        alertRepository.saveAll(Arrays.asList(a1, a2));

        log.info("CarePulse AI demo seed data successfully populated.");
    }

    private void ensureThreeShiftsExist() {
        try {
            List<Shift> existingShifts = shiftRepository.findAll();
            boolean hasDay = existingShifts.stream().anyMatch(s -> "DAY".equalsIgnoreCase(s.getShiftType()));
            long morningCount = existingShifts.stream().filter(s -> "MORNING".equalsIgnoreCase(s.getShiftType())).count();
            if (hasDay || morningCount != 1 || existingShifts.size() != 3) {
                log.info("Normalizing shift records to exactly 3 shifts...");
                shiftRepository.deleteAll();
                User profUser = userRepository.findByEmail("professional@carepulse.com").orElse(null);
                if (profUser != null) {
                    Shift morningShift = new Shift(profUser, "MORNING", "04:00 - 12:00", LocalDateTime.now().minusHours(4), LocalDateTime.now().plusHours(4), "ACTIVE");
                    Shift afternoonShift = new Shift(profUser, "AFTERNOON", "12:00 - 20:00", LocalDateTime.now().plusHours(4), LocalDateTime.now().plusHours(12), "UPCOMING");
                    Shift nightShift = new Shift(profUser, "NIGHT", "20:00 - 04:00", LocalDateTime.now().plusHours(12), LocalDateTime.now().plusHours(20), "UPCOMING");
                    shiftRepository.saveAll(Arrays.asList(morningShift, afternoonShift, nightShift));
                    log.info("Shift normalization complete: exactly 3 shifts active in database.");
                }
            }
        } catch (Exception e) {
            log.warn("Could not normalize shifts: {}", e.getMessage());
        }
    }

    private void ensureDemoUsersExist() {
        try {
            ensureSingleDemoUser("Sarah Johnson", "family@carepulse.com", "password123", "+1 555-0101", Role.FAMILY_CAREGIVER);
            ensureSingleDemoUser("David Miller, CNA", "professional@carepulse.com", "password123", "+1 555-0102", Role.PROFESSIONAL_CAREGIVER);
            ensureSingleDemoUser("Elena Vance, RN", "coordinator@carepulse.com", "password123", "+1 555-0103", Role.CARE_COORDINATOR);
            ensureSingleDemoUser("Dr. Robert Chen, MD", "clinical@carepulse.com", "password123", "+1 555-0104", Role.CLINICAL_STAFF);
            log.info("All 4 demo users verified with valid BCrypt credentials.");
        } catch (Exception e) {
            log.warn("Error ensuring demo users: {}", e.getMessage());
        }
    }

    private void ensureSingleDemoUser(String fullName, String email, String rawPassword, String phone, Role role) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User(fullName, email, passwordEncoder.encode(rawPassword), phone, role);
            user.setActive(true);
            user = userRepository.save(user);
            log.info("Created missing demo user: {}", email);
        } else {
            boolean changed = false;
            if (!user.isActive()) {
                user.setActive(true);
                changed = true;
            }
            if (user.getRole() != role) {
                user.setRole(role);
                changed = true;
            }
            if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(rawPassword));
                changed = true;
                log.info("Repaired BCrypt password hash for demo user: {}", email);
            }
            if (changed) {
                userRepository.save(user);
            }
        }

        if (role == Role.FAMILY_CAREGIVER || role == Role.PROFESSIONAL_CAREGIVER) {
            if (!caregiverProfileRepository.findByUserId(user.getId()).isPresent()) {
                CaregiverProfile profile = new CaregiverProfile(user);
                if (role == Role.FAMILY_CAREGIVER) {
                    profile.setTotalCareHours(42);
                    profile.setConsecutiveCareDays(6);
                    profile.setCurrentBurnoutScore(58);
                    profile.setCurrentBurnoutLevel("MODERATE");
                } else {
                    profile.setTotalCareHours(38);
                    profile.setWeeklyShifts(5);
                    profile.setCurrentBurnoutScore(28);
                    profile.setCurrentBurnoutLevel("LOW");
                }
                caregiverProfileRepository.save(profile);
            }
        }
    }
}
