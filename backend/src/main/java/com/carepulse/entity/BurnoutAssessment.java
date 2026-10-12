package com.carepulse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "burnout_assessments")
public class BurnoutAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caregiver_id", nullable = false)
    private User caregiver;

    private Integer score;
    private String level;

    @Column(columnDefinition = "TEXT")
    private String factorsJson;

    @Column(columnDefinition = "TEXT")
    private String recommendationsJson;

    private Integer taskLoadScore;
    private Integer overdueTasksCount;
    private Double negativeToneRatio;
    private Integer consecutiveDays;

    private LocalDateTime assessedAt = LocalDateTime.now();

    public BurnoutAssessment() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getCaregiver() { return caregiver; }
    public void setCaregiver(User caregiver) { this.caregiver = caregiver; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getFactorsJson() { return factorsJson; }
    public void setFactorsJson(String factorsJson) { this.factorsJson = factorsJson; }
    public String getRecommendationsJson() { return recommendationsJson; }
    public void setRecommendationsJson(String recommendationsJson) { this.recommendationsJson = recommendationsJson; }
    public Integer getTaskLoadScore() { return taskLoadScore; }
    public void setTaskLoadScore(Integer taskLoadScore) { this.taskLoadScore = taskLoadScore; }
    public Integer getOverdueTasksCount() { return overdueTasksCount; }
    public void setOverdueTasksCount(Integer overdueTasksCount) { this.overdueTasksCount = overdueTasksCount; }
    public Double getNegativeToneRatio() { return negativeToneRatio; }
    public void setNegativeToneRatio(Double negativeToneRatio) { this.negativeToneRatio = negativeToneRatio; }
    public Integer getConsecutiveDays() { return consecutiveDays; }
    public void setConsecutiveDays(Integer consecutiveDays) { this.consecutiveDays = consecutiveDays; }
    public LocalDateTime getAssessedAt() { return assessedAt; }
    public void setAssessedAt(LocalDateTime assessedAt) { this.assessedAt = assessedAt; }
}
