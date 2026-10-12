package com.carepulse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class FamilyDiscussionRequest {
    @NotNull
    private Long patientId;

    @NotBlank
    private String message;

    private String category = "UPDATE";
    private Long parentMessageId;

    public FamilyDiscussionRequest() {}

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Long getParentMessageId() { return parentMessageId; }
    public void setParentMessageId(Long parentMessageId) { this.parentMessageId = parentMessageId; }
}
