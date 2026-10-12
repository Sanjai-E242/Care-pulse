package com.carepulse.dto;

import java.time.LocalDateTime;

public class ObservationDto {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long caregiverId;
    private String caregiverName;
    private String rawText;
    private String inputMethod;
    private String status;
    private LocalDateTime createdAt;
    
    // Structured data
    private String category;
    private String severity;
    private String sentiment;
    private String appetite;
    private String cognitiveChange;
    private String mobilityChange;
    private String recommendedAction;
    private String escalationLevel;
    private boolean isEmergency;
    private String summaryText;

    public ObservationDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public Long getCaregiverId() { return caregiverId; }
    public void setCaregiverId(Long caregiverId) { this.caregiverId = caregiverId; }
    public String getCaregiverName() { return caregiverName; }
    public void setCaregiverName(String caregiverName) { this.caregiverName = caregiverName; }
    public String getRawText() { return rawText; }
    public void setRawText(String rawText) { this.rawText = rawText; }
    public String getInputMethod() { return inputMethod; }
    public void setInputMethod(String inputMethod) { this.inputMethod = inputMethod; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public String getSentiment() { return sentiment; }
    public void setSentiment(String sentiment) { this.sentiment = sentiment; }
    public String getAppetite() { return appetite; }
    public void setAppetite(String appetite) { this.appetite = appetite; }
    public String getCognitiveChange() { return cognitiveChange; }
    public void setCognitiveChange(String cognitiveChange) { this.cognitiveChange = cognitiveChange; }
    public String getMobilityChange() { return mobilityChange; }
    public void setMobilityChange(String mobilityChange) { this.mobilityChange = mobilityChange; }
    public String getRecommendedAction() { return recommendedAction; }
    public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }
    public String getEscalationLevel() { return escalationLevel; }
    public void setEscalationLevel(String escalationLevel) { this.escalationLevel = escalationLevel; }
    public boolean isEmergency() { return isEmergency; }
    public void setEmergency(boolean emergency) { isEmergency = emergency; }
    public String getSummaryText() { return summaryText; }
    public void setSummaryText(String summaryText) { this.summaryText = summaryText; }
}
