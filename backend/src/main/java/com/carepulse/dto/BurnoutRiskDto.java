package com.carepulse.dto;

import java.util.List;

public class BurnoutRiskDto {
    private Long caregiverId;
    private String caregiverName;
    private Integer score;
    private String level;
    private List<String> factors;
    private List<String> recommendations;
    private Integer overdueTasksCount;
    private Integer activeTasksCount;
    private Integer totalObservationsCount;

    public BurnoutRiskDto() {}

    public Long getCaregiverId() { return caregiverId; }
    public void setCaregiverId(Long caregiverId) { this.caregiverId = caregiverId; }
    public String getCaregiverName() { return caregiverName; }
    public void setCaregiverName(String caregiverName) { this.caregiverName = caregiverName; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public List<String> getFactors() { return factors; }
    public void setFactors(List<String> factors) { this.factors = factors; }
    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }
    public Integer getOverdueTasksCount() { return overdueTasksCount; }
    public void setOverdueTasksCount(Integer overdueTasksCount) { this.overdueTasksCount = overdueTasksCount; }
    public Integer getActiveTasksCount() { return activeTasksCount; }
    public void setActiveTasksCount(Integer activeTasksCount) { this.activeTasksCount = activeTasksCount; }
    public Integer getTotalObservationsCount() { return totalObservationsCount; }
    public void setTotalObservationsCount(Integer totalObservationsCount) { this.totalObservationsCount = totalObservationsCount; }
}
