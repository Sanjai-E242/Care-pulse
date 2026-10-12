package com.carepulse.service;

import com.carepulse.dto.CareTaskDto;
import com.carepulse.dto.TaskReassignRequest;
import com.carepulse.entity.CareTask;
import com.carepulse.entity.Patient;
import com.carepulse.entity.User;
import com.carepulse.exception.ResourceNotFoundException;
import com.carepulse.repository.CareTaskRepository;
import com.carepulse.repository.PatientRepository;
import com.carepulse.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CareTaskService {

    private final CareTaskRepository careTaskRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    public CareTaskService(CareTaskRepository careTaskRepository,
                           PatientRepository patientRepository,
                           UserRepository userRepository,
                           AuthService authService) {
        this.careTaskRepository = careTaskRepository;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    public List<CareTaskDto> getTasks(Long patientId, Long caregiverId) {
        List<CareTask> list;
        if (patientId != null) {
            list = careTaskRepository.findByPatientIdOrderByDueDateAsc(patientId);
        } else if (caregiverId != null) {
            list = careTaskRepository.findByAssignedCaregiverIdOrderByDueDateAsc(caregiverId);
        } else {
            list = careTaskRepository.findAll();
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public CareTaskDto createTask(CareTaskDto dto) {
        User creator = authService.getCurrentUser();
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        CareTask task = new CareTask();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setPatient(patient);
        task.setCreatedBy(creator);
        task.setPriority(dto.getPriority() != null ? dto.getPriority() : "MEDIUM");
        task.setStatus(dto.getStatus() != null ? dto.getStatus() : "TODO");
        task.setCategory(dto.getCategory() != null ? dto.getCategory() : "GENERAL");
        task.setDueDate(dto.getDueDate() != null ? dto.getDueDate() : LocalDateTime.now().plusHours(4));

        if (dto.getAssignedCaregiverId() != null) {
            User caregiver = userRepository.findById(dto.getAssignedCaregiverId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned caregiver not found"));
            task.setAssignedCaregiver(caregiver);
        } else {
            task.setAssignedCaregiver(creator);
        }

        task = careTaskRepository.save(task);
        return toDto(task);
    }

    @Transactional
    public CareTaskDto updateStatus(Long id, String status) {
        CareTask task = careTaskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        task.setStatus(status);
        if ("COMPLETED".equalsIgnoreCase(status)) {
            task.setCompletedAt(LocalDateTime.now());
        }
        task = careTaskRepository.save(task);
        return toDto(task);
    }

    @Transactional
    public CareTaskDto reassignTask(TaskReassignRequest req) {
        CareTask task = careTaskRepository.findById(req.getTaskId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        User newCaregiver = userRepository.findById(req.getNewCaregiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Target caregiver not found"));

        task.setAssignedCaregiver(newCaregiver);
        task = careTaskRepository.save(task);
        return toDto(task);
    }

    @Transactional
    public void deleteTask(Long id) {
        careTaskRepository.deleteById(id);
    }

    public CareTaskDto toDto(CareTask t) {
        CareTaskDto dto = new CareTaskDto();
        dto.setId(t.getId());
        dto.setTitle(t.getTitle());
        dto.setDescription(t.getDescription());
        dto.setPatientId(t.getPatient().getId());
        dto.setPatientName(t.getPatient().getFullName());
        if (t.getAssignedCaregiver() != null) {
            dto.setAssignedCaregiverId(t.getAssignedCaregiver().getId());
            dto.setAssignedCaregiverName(t.getAssignedCaregiver().getFullName());
        }
        if (t.getCreatedBy() != null) {
            dto.setCreatedById(t.getCreatedBy().getId());
            dto.setCreatedByName(t.getCreatedBy().getFullName());
        }
        dto.setDueDate(t.getDueDate());
        dto.setPriority(t.getPriority());
        dto.setStatus(t.getStatus());
        dto.setCategory(t.getCategory());
        dto.setCreatedAt(t.getCreatedAt());
        dto.setCompletedAt(t.getCompletedAt());
        return dto;
    }
}
