package com.carepulse.controller;

import com.carepulse.dto.*;
import com.carepulse.service.ObservationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/observations")
@Tag(name = "Observations", description = "Endpoints for capturing observations and AI structured signal extraction")
public class ObservationController {

    private final ObservationService observationService;

    public ObservationController(ObservationService observationService) {
        this.observationService = observationService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<ObservationExtractionResult>> analyzeObservation(@Valid @RequestBody ObservationRequest request) {
        ObservationExtractionResult result = observationService.analyzeObservation(request);
        return ResponseEntity.ok(ApiResponse.ok("Observation parsed by AI successfully", result));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ObservationExtractionResult>> postObservationDirect(@Valid @RequestBody ObservationRequest request) {
        ObservationExtractionResult result = observationService.analyzeObservation(request);
        return ResponseEntity.ok(ApiResponse.ok("Observation parsed by AI successfully", result));
    }

    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<ObservationDto>> confirmObservation(@Valid @RequestBody ObservationConfirmRequest request) {
        ObservationDto saved = observationService.confirmAndSave(request);
        return ResponseEntity.ok(ApiResponse.ok("Observation saved and patient care signals updated", saved));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<ObservationDto>>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.ok(observationService.getObservationsForPatient(patientId)));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<ObservationDto>>> getRecentObservations() {
        return ResponseEntity.ok(ApiResponse.ok(observationService.getAllRecent()));
    }
}
