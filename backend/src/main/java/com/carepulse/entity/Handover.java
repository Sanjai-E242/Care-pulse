package com.carepulse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "handovers")
public class Handover {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "outgoing_caregiver_id", nullable = false)
    private User outgoingCaregiver;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "incoming_caregiver_id")
    private User incomingCaregiver;

    private String shiftName;

    @Column(columnDefinition = "TEXT")
    private String topObservationsJson;

    @Column(columnDefinition = "TEXT")
    private String emergingPattern;

    @Column(columnDefinition = "TEXT")
    private String watchItemsJson;

    @Column(columnDefinition = "TEXT")
    private String completedTasksJson;

    @Column(columnDefinition = "TEXT")
    private String pendingTasksJson;

    private boolean reviewed = false;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Handover() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public User getOutgoingCaregiver() { return outgoingCaregiver; }
    public void setOutgoingCaregiver(User outgoingCaregiver) { this.outgoingCaregiver = outgoingCaregiver; }
    public User getIncomingCaregiver() { return incomingCaregiver; }
    public void setIncomingCaregiver(User incomingCaregiver) { this.incomingCaregiver = incomingCaregiver; }
    public String getShiftName() { return shiftName; }
    public void setShiftName(String shiftName) { this.shiftName = shiftName; }
    public String getTopObservationsJson() { return topObservationsJson; }
    public void setTopObservationsJson(String topObservationsJson) { this.topObservationsJson = topObservationsJson; }
    public String getEmergingPattern() { return emergingPattern; }
    public void setEmergingPattern(String emergingPattern) { this.emergingPattern = emergingPattern; }
    public String getWatchItemsJson() { return watchItemsJson; }
    public void setWatchItemsJson(String watchItemsJson) { this.watchItemsJson = watchItemsJson; }
    public String getCompletedTasksJson() { return completedTasksJson; }
    public void setCompletedTasksJson(String completedTasksJson) { this.completedTasksJson = completedTasksJson; }
    public String getPendingTasksJson() { return pendingTasksJson; }
    public void setPendingTasksJson(String pendingTasksJson) { this.pendingTasksJson = pendingTasksJson; }
    public boolean isReviewed() { return reviewed; }
    public void setReviewed(boolean reviewed) { this.reviewed = reviewed; }
    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
