package com.carepulse.dto;

import java.time.LocalDateTime;

public class CareTaskDto {
    private Long id;
    private String title;
    private String description;
    private Long patientId;
    private String patientName;
    private Long assignedCaregiverId;
    private String assignedCaregiverName;
    private Long createdById;
    private String createdByName;
    private LocalDateTime dueDate;
    private String priority;
    private String status;
    private String category;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public CareTaskDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public Long getAssignedCaregiverId() { return assignedCaregiverId; }
    public void setAssignedCaregiverId(Long assignedCaregiverId) { this.assignedCaregiverId = assignedCaregiverId; }
    public String getAssignedCaregiverName() { return assignedCaregiverName; }
    public void setAssignedCaregiverName(String assignedCaregiverName) { this.assignedCaregiverName = assignedCaregiverName; }
    public Long getCreatedById() { return createdById; }
    public void setCreatedById(Long createdById) { this.createdById = createdById; }
    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }
    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
