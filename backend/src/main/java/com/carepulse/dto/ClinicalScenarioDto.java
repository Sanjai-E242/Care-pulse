package com.carepulse.dto;

import java.util.List;

public class ClinicalScenarioDto {
    private String id;
    private String title;
    private String description;
    private String icon;
    private List<String> whatToCheck;
    private List<String> whatToDoNow;
    private List<String> whenToContactClinician;
    private List<String> whenToSeekEmergencyHelp;

    public ClinicalScenarioDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public List<String> getWhatToCheck() { return whatToCheck; }
    public void setWhatToCheck(List<String> whatToCheck) { this.whatToCheck = whatToCheck; }
    public List<String> getWhatToDoNow() { return whatToDoNow; }
    public void setWhatToDoNow(List<String> whatToDoNow) { this.whatToDoNow = whatToDoNow; }
    public List<String> getWhenToContactClinician() { return whenToContactClinician; }
    public void setWhenToContactClinician(List<String> whenToContactClinician) { this.whenToContactClinician = whenToContactClinician; }
    public List<String> getWhenToSeekEmergencyHelp() { return whenToSeekEmergencyHelp; }
    public void setWhenToSeekEmergencyHelp(List<String> whenToSeekEmergencyHelp) { this.whenToSeekEmergencyHelp = whenToSeekEmergencyHelp; }
}
