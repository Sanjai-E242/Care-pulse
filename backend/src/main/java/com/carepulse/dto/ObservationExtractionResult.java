package com.carepulse.dto;

import java.util.List;

public class ObservationExtractionResult {
    private String category;
    private String severity;
    private String sentiment;
    private String appetite;
    private String cognitiveChange;
    private String mobilityChange;
    private String timeReference;
    private String recommendedAction;
    private String escalationLevel;
    private boolean isEmergency;
    private String summaryText;
    private List<String> extractedSignals;

    public ObservationExtractionResult() {}

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
    public String getTimeReference() { return timeReference; }
    public void setTimeReference(String timeReference) { this.timeReference = timeReference; }
    public String getRecommendedAction() { return recommendedAction; }
    public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }
    public String getEscalationLevel() { return escalationLevel; }
    public void setEscalationLevel(String escalationLevel) { this.escalationLevel = escalationLevel; }
    public boolean isEmergency() { return isEmergency; }
    public void setEmergency(boolean emergency) { isEmergency = emergency; }
    public String getSummaryText() { return summaryText; }
    public void setSummaryText(String summaryText) { this.summaryText = summaryText; }
    public List<String> getExtractedSignals() { return extractedSignals; }
    public void setExtractedSignals(List<String> extractedSignals) { this.extractedSignals = extractedSignals; }
}
