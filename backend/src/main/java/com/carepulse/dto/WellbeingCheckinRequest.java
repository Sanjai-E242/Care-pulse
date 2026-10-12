package com.carepulse.dto;

import jakarta.validation.constraints.NotBlank;

public class WellbeingCheckinRequest {
    private Long caregiverId;

    @NotBlank
    private String moodRating;

    private String notes;

    public WellbeingCheckinRequest() {}

    public Long getCaregiverId() { return caregiverId; }
    public void setCaregiverId(Long caregiverId) { this.caregiverId = caregiverId; }
    public String getMoodRating() { return moodRating; }
    public void setMoodRating(String moodRating) { this.moodRating = moodRating; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
