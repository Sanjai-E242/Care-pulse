package com.carepulse.dto;

import jakarta.validation.constraints.NotNull;

public class HandoverGenerateRequest {
    @NotNull
    private Long patientId;
    private Long outgoingCaregiverId;
    private String shiftName;

    public HandoverGenerateRequest() {}
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public Long getOutgoingCaregiverId() { return outgoingCaregiverId; }
    public void setOutgoingCaregiverId(Long outgoingCaregiverId) { this.outgoingCaregiverId = outgoingCaregiverId; }
    public String getShiftName() { return shiftName; }
    public void setShiftName(String shiftName) { this.shiftName = shiftName; }
}
