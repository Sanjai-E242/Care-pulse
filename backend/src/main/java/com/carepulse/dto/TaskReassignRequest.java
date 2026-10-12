package com.carepulse.dto;

import jakarta.validation.constraints.NotNull;

public class TaskReassignRequest {
    @NotNull
    private Long taskId;
    @NotNull
    private Long newCaregiverId;
    private String reason;

    public TaskReassignRequest() {}
    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }
    public Long getNewCaregiverId() { return newCaregiverId; }
    public void setNewCaregiverId(Long newCaregiverId) { this.newCaregiverId = newCaregiverId; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
