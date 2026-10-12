package com.carepulse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ObservationRequest {
    @NotNull
    private Long patientId;

    private Long caregiverId;

    @NotBlank
    private String rawText;

    private String inputMethod = "TEXT";
    private Integer audioDurationSeconds;

    public ObservationRequest() {}

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public Long getCaregiverId() { return caregiverId; }
    public void setCaregiverId(Long caregiverId) { this.caregiverId = caregiverId; }
    public String getRawText() { return rawText; }
    public void setRawText(String rawText) { this.rawText = rawText; }
    public String getInputMethod() { return inputMethod; }
    public void setInputMethod(String inputMethod) { this.inputMethod = inputMethod; }
    public Integer getAudioDurationSeconds() { return audioDurationSeconds; }
    public void setAudioDurationSeconds(Integer audioDurationSeconds) { this.audioDurationSeconds = audioDurationSeconds; }
}
