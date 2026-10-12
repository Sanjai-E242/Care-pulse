package com.carepulse.service;

import com.carepulse.dto.AlertDto;
import com.carepulse.entity.Alert;
import com.carepulse.exception.ResourceNotFoundException;
import com.carepulse.repository.AlertRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertService {

    private final AlertRepository alertRepository;

    public AlertService(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    public List<AlertDto> getAlerts(Boolean unresolvedOnly, Long patientId) {
        List<Alert> list;
        if (patientId != null) {
            list = alertRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
        } else if (Boolean.TRUE.equals(unresolvedOnly)) {
            list = alertRepository.findByIsResolvedFalseOrderByCreatedAtDesc();
        } else {
            list = alertRepository.findAllByOrderByCreatedAtDesc();
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public AlertDto markRead(Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found"));
        alert.setRead(true);
        alert = alertRepository.save(alert);
        return toDto(alert);
    }

    @Transactional
    public AlertDto resolveAlert(Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found"));
        alert.setResolved(true);
        alert.setResolvedAt(LocalDateTime.now());
        alert = alertRepository.save(alert);
        return toDto(alert);
    }

    public AlertDto toDto(Alert a) {
        AlertDto dto = new AlertDto();
        dto.setId(a.getId());
        if (a.getPatient() != null) {
            dto.setPatientId(a.getPatient().getId());
            dto.setPatientName(a.getPatient().getFullName());
        }
        if (a.getObservation() != null) {
            dto.setObservationId(a.getObservation().getId());
        }
        dto.setAlertType(a.getAlertType());
        dto.setSeverity(a.getSeverity());
        dto.setTitle(a.getTitle());
        dto.setMessage(a.getMessage());
        dto.setRead(a.isRead());
        dto.setResolved(a.isResolved());
        dto.setCreatedAt(a.getCreatedAt());
        dto.setResolvedAt(a.getResolvedAt());
        return dto;
    }
}
