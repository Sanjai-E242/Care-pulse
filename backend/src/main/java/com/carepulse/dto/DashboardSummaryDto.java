package com.carepulse.dto;

import java.util.List;
import java.util.Map;

public class DashboardSummaryDto {
    private String role;
    private String greeting;
    private String userName;
    private Map<String, Object> stats;
    private List<ObservationDto> recentObservations;
    private List<CareTaskDto> pendingTasks;
    private List<AlertDto> activeAlerts;
    private BurnoutRiskDto burnoutRisk;
    private PatientDto primaryPatient;
    private String clinicalAiSummary;

    public DashboardSummaryDto() {}

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getGreeting() { return greeting; }
    public void setGreeting(String greeting) { this.greeting = greeting; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public Map<String, Object> getStats() { return stats; }
    public void setStats(Map<String, Object> stats) { this.stats = stats; }
    public List<ObservationDto> getRecentObservations() { return recentObservations; }
    public void setRecentObservations(List<ObservationDto> recentObservations) { this.recentObservations = recentObservations; }
    public List<CareTaskDto> getPendingTasks() { return pendingTasks; }
    public void setPendingTasks(List<CareTaskDto> pendingTasks) { this.pendingTasks = pendingTasks; }
    public List<AlertDto> getActiveAlerts() { return activeAlerts; }
    public void setActiveAlerts(List<AlertDto> activeAlerts) { this.activeAlerts = activeAlerts; }
    public BurnoutRiskDto getBurnoutRisk() { return burnoutRisk; }
    public void setBurnoutRisk(BurnoutRiskDto burnoutRisk) { this.burnoutRisk = burnoutRisk; }
    public PatientDto getPrimaryPatient() { return primaryPatient; }
    public void setPrimaryPatient(PatientDto primaryPatient) { this.primaryPatient = primaryPatient; }
    public String getClinicalAiSummary() { return clinicalAiSummary; }
    public void setClinicalAiSummary(String clinicalAiSummary) { this.clinicalAiSummary = clinicalAiSummary; }
}
