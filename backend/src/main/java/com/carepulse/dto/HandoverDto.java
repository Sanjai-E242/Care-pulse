package com.carepulse.dto;

import java.time.LocalDateTime;
import java.util.List;

public class HandoverDto {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long outgoingCaregiverId;
    private String outgoingCaregiverName;
    private Long incomingCaregiverId;
    private String incomingCaregiverName;
    private String shiftName;
    private List<String> topObservations;
    private String emergingPattern;
    private List<String> watchItems;
    private List<String> completedTasks;
    private List<String> pendingTasks;
    private boolean reviewed;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;

    public HandoverDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public Long getOutgoingCaregiverId() { return outgoingCaregiverId; }
    public void setOutgoingCaregiverId(Long outgoingCaregiverId) { this.outgoingCaregiverId = outgoingCaregiverId; }
    public String getOutgoingCaregiverName() { return outgoingCaregiverName; }
    public void setOutgoingCaregiverName(String outgoingCaregiverName) { this.outgoingCaregiverName = outgoingCaregiverName; }
    public Long getIncomingCaregiverId() { return incomingCaregiverId; }
    public void setIncomingCaregiverId(Long incomingCaregiverId) { this.incomingCaregiverId = incomingCaregiverId; }
    public String getIncomingCaregiverName() { return incomingCaregiverName; }
    public void setIncomingCaregiverName(String incomingCaregiverName) { this.incomingCaregiverName = incomingCaregiverName; }
    public String getShiftName() { return shiftName; }
    public void setShiftName(String shiftName) { this.shiftName = shiftName; }
    public List<String> getTopObservations() { return topObservations; }
    public void setTopObservations(List<String> topObservations) { this.topObservations = topObservations; }
    public String getEmergingPattern() { return emergingPattern; }
    public void setEmergingPattern(String emergingPattern) { this.emergingPattern = emergingPattern; }
    public List<String> getWatchItems() { return watchItems; }
    public void setWatchItems(List<String> watchItems) { this.watchItems = watchItems; }
    public List<String> getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(List<String> completedTasks) { this.completedTasks = completedTasks; }
    public List<String> getPendingTasks() { return pendingTasks; }
    public void setPendingTasks(List<String> pendingTasks) { this.pendingTasks = pendingTasks; }
    public boolean isReviewed() { return reviewed; }
    public void setReviewed(boolean reviewed) { this.reviewed = reviewed; }
    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
