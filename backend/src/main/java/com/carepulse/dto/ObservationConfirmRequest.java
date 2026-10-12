package com.carepulse.dto;

import jakarta.validation.constraints.NotNull;

public class ObservationConfirmRequest {
    @NotNull
    private Long patientId;
    private Long caregiverId;
    private String rawText;
    private String inputMethod = "TEXT";
    private Integer audioDurationSeconds;
    private ObservationExtractionResult extractedData;

    public ObservationConfirmRequest() {}

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
    public ObservationExtractionResult getExtractedData() { return extractedData; }
    public void setExtractedData(ObservationExtractionResult extractedData) { this.extractedData = extractedData; }
}
