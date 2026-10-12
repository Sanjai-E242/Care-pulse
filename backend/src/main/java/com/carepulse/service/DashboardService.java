package com.carepulse.service;

import com.carepulse.dto.*;
import com.carepulse.entity.*;
import com.carepulse.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final AuthService authService;
    private final PatientService patientService;
    private final ObservationService observationService;
    private final CareTaskService careTaskService;
    private final AlertService alertService;
    private final BurnoutService burnoutService;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final CaregiverProfileRepository caregiverProfileRepository;

    public DashboardService(AuthService authService,
                            PatientService patientService,
                            ObservationService observationService,
                            CareTaskService careTaskService,
                            AlertService alertService,
                            BurnoutService burnoutService,
                            PatientRepository patientRepository,
                            UserRepository userRepository,
                            CaregiverProfileRepository caregiverProfileRepository) {
        this.authService = authService;
        this.patientService = patientService;
        this.observationService = observationService;
        this.careTaskService = careTaskService;
        this.alertService = alertService;
        this.burnoutService = burnoutService;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
        this.caregiverProfileRepository = caregiverProfileRepository;
    }

    public DashboardSummaryDto getDashboardSummary() {
        User user = authService.getCurrentUser();
        DashboardSummaryDto dto = new DashboardSummaryDto();
        dto.setRole(user.getRole().name());
        dto.setUserName(user.getFullName());

        int hour = java.time.LocalTime.now().getHour();
        String timeGreeting = (hour < 12) ? "Good morning" : (hour < 18) ? "Good afternoon" : "Good evening";
        dto.setGreeting(timeGreeting + ", " + user.getFullName());

        Map<String, Object> stats = new HashMap<>();
        List<Patient> allPatients = patientRepository.findAll();
        Patient primaryPatient = allPatients.isEmpty() ? null : allPatients.get(0);

        if (primaryPatient != null) {
            dto.setPrimaryPatient(patientService.toDto(primaryPatient));
        }

        switch (user.getRole()) {
            case FAMILY_CAREGIVER: {
                dto.setBurnoutRisk(burnoutService.getBurnoutRisk(user.getId()));
                List<CareTaskDto> myTasks = careTaskService.getTasks(null, user.getId());
                long pendingTasks = myTasks.stream().filter(t -> !"COMPLETED".equalsIgnoreCase(t.getStatus())).count();
                stats.put("tasksRemaining", pendingTasks);
                stats.put("completedTasks", myTasks.size() - pendingTasks);
                if (primaryPatient != null) {
                    dto.setRecentObservations(observationService.getObservationsForPatient(primaryPatient.getId()));
                }
                dto.setPendingTasks(myTasks);
                dto.setActiveAlerts(alertService.getAlerts(true, primaryPatient != null ? primaryPatient.getId() : null));
                break;
            }
            case PROFESSIONAL_CAREGIVER: {
                stats.put("currentShift", getCurrentShiftName());
                stats.put("assignedPatientsCount", allPatients.size());
                stats.put("watchItemsCount", 3);
                dto.setPendingTasks(careTaskService.getTasks(null, user.getId()));
                dto.setRecentObservations(observationService.getAllRecent());
                dto.setActiveAlerts(alertService.getAlerts(true, null));
                break;
            }
            case CARE_COORDINATOR: {
                stats.put("totalPatients", allPatients.size());
                long activeCaregivers = userRepository.findByRole(Role.FAMILY_CAREGIVER).size() +
                                        userRepository.findByRole(Role.PROFESSIONAL_CAREGIVER).size();
                stats.put("activeCaregivers", activeCaregivers);

                // High-risk caregivers count
                long highRiskCaregivers = caregiverProfileRepository.findAll().stream()
                        .filter(p -> "HIGH".equalsIgnoreCase(p.getCurrentBurnoutLevel()) || "CRITICAL".equalsIgnoreCase(p.getCurrentBurnoutLevel()))
                        .count();
                stats.put("highRiskCaregivers", Math.max(1, highRiskCaregivers));

                List<AlertDto> unresolvedAlerts = alertService.getAlerts(true, null);
                stats.put("highPriorityAlerts", unresolvedAlerts.size());
                stats.put("pendingTasks", careTaskService.getTasks(null, null).stream()
                        .filter(t -> !"COMPLETED".equalsIgnoreCase(t.getStatus())).count());

                dto.setActiveAlerts(unresolvedAlerts);
                dto.setPendingTasks(careTaskService.getTasks(null, null));
                dto.setRecentObservations(observationService.getAllRecent());
                break;
            }
            case CLINICAL_STAFF: {
                stats.put("activePatients", allPatients.size());
                stats.put("behavioralChangesCount", 4);
                stats.put("fallIncidentsCount", 1);
                stats.put("medicationVariancesCount", 2);

                dto.setClinicalAiSummary(
                        "Over the last 72 hours across assigned patients, notable nutritional intake decline has been recorded for Mary Johnson (78) alongside evening restlessness. Mobility remains guarded post-slip. Medication adherence across care teams is at 94%."
                );
                dto.setRecentObservations(observationService.getAllRecent());
                dto.setActiveAlerts(alertService.getAlerts(false, null));
                dto.setPendingTasks(careTaskService.getTasks(null, null));
                break;
            }
        }

        dto.setStats(stats);
        return dto;
    }

    public static String getCurrentShiftName() {
        int hour = java.time.LocalTime.now().getHour();
        if (hour >= 4 && hour < 12) {
            return "Morning Shift (04:00 - 12:00)";
        } else if (hour >= 12 && hour < 20) {
            return "Afternoon Shift (12:00 - 20:00)";
        } else {
            return "Night Shift (20:00 - 04:00)";
        }
    }
}
