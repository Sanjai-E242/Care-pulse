package com.carepulse.controller;

import com.carepulse.dto.ApiResponse;
import com.carepulse.dto.ObservationDto;
import com.carepulse.dto.PatientDto;
import com.carepulse.service.ObservationService;
import com.carepulse.service.PatientService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@Tag(name = "Patients", description = "Endpoints for patient profiles, medical overview, and timelines")
public class PatientController {

    private final PatientService patientService;
    private final ObservationService observationService;

    public PatientController(PatientService patientService, ObservationService observationService) {
        this.patientService = patientService;
        this.observationService = observationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PatientDto>>> getAllPatients() {
        return ResponseEntity.ok(ApiResponse.ok(patientService.getAllPatients()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientDto>> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(patientService.getPatientById(id)));
    }

    @GetMapping("/{id}/timeline")
    public ResponseEntity<ApiResponse<List<ObservationDto>>> getPatientTimeline(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(observationService.getObservationsForPatient(id)));
    }
}
