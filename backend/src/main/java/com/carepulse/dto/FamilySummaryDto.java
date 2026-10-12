package com.carepulse.dto;

import java.util.List;

public class FamilySummaryDto {
    private String patientName;
    private String neutralSummary;
    private List<String> agreementPoints;
    private List<String> disagreementPoints;
    private List<String> suggestedActionItems;

    public FamilySummaryDto() {}

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public String getNeutralSummary() { return neutralSummary; }
    public void setNeutralSummary(String neutralSummary) { this.neutralSummary = neutralSummary; }
    public List<String> getAgreementPoints() { return agreementPoints; }
    public void setAgreementPoints(List<String> agreementPoints) { this.agreementPoints = agreementPoints; }
    public List<String> getDisagreementPoints() { return disagreementPoints; }
    public void setDisagreementPoints(List<String> disagreementPoints) { this.disagreementPoints = disagreementPoints; }
    public List<String> getSuggestedActionItems() { return suggestedActionItems; }
    public void setSuggestedActionItems(List<String> suggestedActionItems) { this.suggestedActionItems = suggestedActionItems; }
}
