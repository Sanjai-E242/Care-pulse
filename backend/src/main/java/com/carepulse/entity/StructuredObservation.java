package com.carepulse.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "structured_observations")
public class StructuredObservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "observation_id", nullable = false, unique = true)
    private Observation observation;

    private String category;
    private String severity;
    private String sentiment;
    private String appetite;
    private String cognitiveChange;
    private String mobilityChange;
    private String timeReference;
    private String recommendedAction;
    private String escalationLevel;
    private boolean isEmergency = false;

    @Column(columnDefinition = "TEXT")
    private String summaryText;

    @Column(columnDefinition = "TEXT")
    private String extractedSignalsJson;

    public StructuredObservation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Observation getObservation() { return observation; }
    public void setObservation(Observation observation) { this.observation = observation; }
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
    public String getExtractedSignalsJson() { return extractedSignalsJson; }
    public void setExtractedSignalsJson(String extractedSignalsJson) { this.extractedSignalsJson = extractedSignalsJson; }
}
