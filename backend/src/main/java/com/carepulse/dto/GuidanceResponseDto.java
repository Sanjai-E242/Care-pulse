package com.carepulse.dto;

import java.util.List;

public class GuidanceResponseDto {
    private String title;
    private String scenario;
    private List<String> immediateActions;
    private List<String> warningSigns;
    private String recommendedEscalation;
    private boolean isEmergency;
    private String disclaimer = "AI-generated decision guidance — verify all clinical actions with a qualified healthcare professional.";

    public GuidanceResponseDto() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getScenario() { return scenario; }
    public void setScenario(String scenario) { this.scenario = scenario; }
    public List<String> getImmediateActions() { return immediateActions; }
    public void setImmediateActions(List<String> immediateActions) { this.immediateActions = immediateActions; }
    public List<String> getWarningSigns() { return warningSigns; }
    public void setWarningSigns(List<String> warningSigns) { this.warningSigns = warningSigns; }
    public String getRecommendedEscalation() { return recommendedEscalation; }
    public void setRecommendedEscalation(String recommendedEscalation) { this.recommendedEscalation = recommendedEscalation; }
    public boolean isEmergency() { return isEmergency; }
    public void setEmergency(boolean emergency) { isEmergency = emergency; }
    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
}
