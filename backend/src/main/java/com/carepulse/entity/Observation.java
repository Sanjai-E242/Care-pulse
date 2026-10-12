package com.carepulse.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "observations")
public class Observation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "caregiver_id", nullable = false)
    private User caregiver;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String rawText;

    private Integer audioDurationSeconds;
    private String inputMethod = "TEXT";
    private String status = "CONFIRMED";

    @OneToOne(mappedBy = "observation", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private StructuredObservation structuredObservation;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Observation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public User getCaregiver() { return caregiver; }
    public void setCaregiver(User caregiver) { this.caregiver = caregiver; }
    public String getRawText() { return rawText; }
    public void setRawText(String rawText) { this.rawText = rawText; }
    public Integer getAudioDurationSeconds() { return audioDurationSeconds; }
    public void setAudioDurationSeconds(Integer audioDurationSeconds) { this.audioDurationSeconds = audioDurationSeconds; }
    public String getInputMethod() { return inputMethod; }
    public void setInputMethod(String inputMethod) { this.inputMethod = inputMethod; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public StructuredObservation getStructuredObservation() { return structuredObservation; }
    public void setStructuredObservation(StructuredObservation structuredObservation) { this.structuredObservation = structuredObservation; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
