package com.carepulse.service;

import com.carepulse.dto.PatientDto;
import com.carepulse.entity.Patient;
import com.carepulse.entity.User;
import com.carepulse.exception.ResourceNotFoundException;
import com.carepulse.repository.PatientRepository;
import com.carepulse.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientService(PatientRepository patientRepository, UserRepository userRepository) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    public List<PatientDto> getAllPatients() {
        return patientRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public PatientDto getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        return toDto(patient);
    }

    public Patient getEntityById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
    }

    public PatientDto toDto(Patient p) {
        PatientDto dto = new PatientDto();
        dto.setId(p.getId());
        dto.setFullName(p.getFullName());
        dto.setAge(p.getAge());
        dto.setDateOfBirth(p.getDateOfBirth());
        dto.setGender(p.getGender());
        dto.setBloodGroup(p.getBloodGroup());
        dto.setEmergencyContact(p.getEmergencyContact());
        dto.setPrimaryCaregiverId(p.getPrimaryCaregiverId());
        if (p.getPrimaryCaregiverId() != null) {
            userRepository.findById(p.getPrimaryCaregiverId()).ifPresent(u -> dto.setPrimaryCaregiverName(u.getFullName()));
        }
        dto.setConditions(p.getConditions());
        dto.setAllergies(p.getAllergies());
        dto.setMedications(p.getMedications());
        dto.setMobilityStatus(p.getMobilityStatus());
        dto.setCognitiveStatus(p.getCognitiveStatus());
        dto.setCurrentMood(p.getCurrentMood());
        dto.setCurrentAppetite(p.getCurrentAppetite());
        dto.setCurrentSleep(p.getCurrentSleep());
        dto.setCurrentMobility(p.getCurrentMobility());
        dto.setCurrentBehavior(p.getCurrentBehavior());
        dto.setUpdatedAt(p.getUpdatedAt());
        return dto;
    }
}
