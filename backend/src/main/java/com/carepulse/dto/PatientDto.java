package com.carepulse.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class PatientDto {
    private Long id;
    private String fullName;
    private Integer age;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String emergencyContact;
    private Long primaryCaregiverId;
    private String primaryCaregiverName;
    private String conditions;
    private String allergies;
    private String medications;
    private String mobilityStatus;
    private String cognitiveStatus;
    private String currentMood;
    private String currentAppetite;
    private String currentSleep;
    private String currentMobility;
    private String currentBehavior;
    private LocalDateTime updatedAt;

    public PatientDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
    public Long getPrimaryCaregiverId() { return primaryCaregiverId; }
    public void setPrimaryCaregiverId(Long primaryCaregiverId) { this.primaryCaregiverId = primaryCaregiverId; }
    public String getPrimaryCaregiverName() { return primaryCaregiverName; }
    public void setPrimaryCaregiverName(String primaryCaregiverName) { this.primaryCaregiverName = primaryCaregiverName; }
    public String getConditions() { return conditions; }
    public void setConditions(String conditions) { this.conditions = conditions; }
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    public String getMedications() { return medications; }
    public void setMedications(String medications) { this.medications = medications; }
    public String getMobilityStatus() { return mobilityStatus; }
    public void setMobilityStatus(String mobilityStatus) { this.mobilityStatus = mobilityStatus; }
    public String getCognitiveStatus() { return cognitiveStatus; }
    public void setCognitiveStatus(String cognitiveStatus) { this.cognitiveStatus = cognitiveStatus; }
    public String getCurrentMood() { return currentMood; }
    public void setCurrentMood(String currentMood) { this.currentMood = currentMood; }
    public String getCurrentAppetite() { return currentAppetite; }
    public void setCurrentAppetite(String currentAppetite) { this.currentAppetite = currentAppetite; }
    public String getCurrentSleep() { return currentSleep; }
    public void setCurrentSleep(String currentSleep) { this.currentSleep = currentSleep; }
    public String getCurrentMobility() { return currentMobility; }
    public void setCurrentMobility(String currentMobility) { this.currentMobility = currentMobility; }
    public String getCurrentBehavior() { return currentBehavior; }
    public void setCurrentBehavior(String currentBehavior) { this.currentBehavior = currentBehavior; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
