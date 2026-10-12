package com.carepulse.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "patient_caregivers")
public class PatientCaregiver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caregiver_id", nullable = false)
    private User caregiver;

    private String relationship;
    private boolean isPrimary;

    public PatientCaregiver() {}
    public PatientCaregiver(Patient patient, User caregiver, String relationship, boolean isPrimary) {
        this.patient = patient;
        this.caregiver = caregiver;
        this.relationship = relationship;
        this.isPrimary = isPrimary;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public User getCaregiver() { return caregiver; }
    public void setCaregiver(User caregiver) { this.caregiver = caregiver; }
    public String getRelationship() { return relationship; }
    public void setRelationship(String relationship) { this.relationship = relationship; }
    public boolean isPrimary() { return isPrimary; }
    public void setPrimary(boolean primary) { isPrimary = primary; }
}
