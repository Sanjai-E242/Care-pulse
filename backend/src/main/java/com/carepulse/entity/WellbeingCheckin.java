package com.carepulse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "wellbeing_checkins")
public class WellbeingCheckin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caregiver_id", nullable = false)
    private User caregiver;

    private String moodRating;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private Integer calculatedRiskScoreDelta;
    private LocalDateTime createdAt = LocalDateTime.now();

    public WellbeingCheckin() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getCaregiver() { return caregiver; }
    public void setCaregiver(User caregiver) { this.caregiver = caregiver; }
    public String getMoodRating() { return moodRating; }
    public void setMoodRating(String moodRating) { this.moodRating = moodRating; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Integer getCalculatedRiskScoreDelta() { return calculatedRiskScoreDelta; }
    public void setCalculatedRiskScoreDelta(Integer calculatedRiskScoreDelta) { this.calculatedRiskScoreDelta = calculatedRiskScoreDelta; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
