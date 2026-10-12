package com.carepulse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "caregiver_profiles")
public class CaregiverProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private Integer totalCareHours = 0;
    private Integer weeklyShifts = 0;
    private Integer consecutiveCareDays = 0;
    private Integer currentBurnoutScore = 20;
    private String currentBurnoutLevel = "LOW";

    private LocalDateTime lastCheckinAt;
    private LocalDateTime updatedAt = LocalDateTime.now();

    public CaregiverProfile() {}
    public CaregiverProfile(User user) {
        this.user = user;
        this.totalCareHours = 0;
        this.weeklyShifts = 0;
        this.consecutiveCareDays = 0;
        this.currentBurnoutScore = 20;
        this.currentBurnoutLevel = "LOW";
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Integer getTotalCareHours() { return totalCareHours; }
    public void setTotalCareHours(Integer totalCareHours) { this.totalCareHours = totalCareHours; }
    public Integer getWeeklyShifts() { return weeklyShifts; }
    public void setWeeklyShifts(Integer weeklyShifts) { this.weeklyShifts = weeklyShifts; }
    public Integer getConsecutiveCareDays() { return consecutiveCareDays; }
    public void setConsecutiveCareDays(Integer consecutiveCareDays) { this.consecutiveCareDays = consecutiveCareDays; }
    public Integer getCurrentBurnoutScore() { return currentBurnoutScore; }
    public void setCurrentBurnoutScore(Integer currentBurnoutScore) { this.currentBurnoutScore = currentBurnoutScore; }
    public String getCurrentBurnoutLevel() { return currentBurnoutLevel; }
    public void setCurrentBurnoutLevel(String currentBurnoutLevel) { this.currentBurnoutLevel = currentBurnoutLevel; }
    public LocalDateTime getLastCheckinAt() { return lastCheckinAt; }
    public void setLastCheckinAt(LocalDateTime lastCheckinAt) { this.lastCheckinAt = lastCheckinAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
