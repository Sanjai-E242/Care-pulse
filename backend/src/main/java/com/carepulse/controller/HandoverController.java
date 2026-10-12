package com.carepulse.controller;

import com.carepulse.dto.ApiResponse;
import com.carepulse.dto.HandoverDto;
import com.carepulse.dto.HandoverGenerateRequest;
import com.carepulse.service.HandoverService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/handover")
@Tag(name = "Shift Handover", description = "Endpoints for generating and reviewing intelligent shift handovers")
public class HandoverController {

    private final HandoverService handoverService;

    public HandoverController(HandoverService handoverService) {
        this.handoverService = handoverService;
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<HandoverDto>> generateHandover(@Valid @RequestBody HandoverGenerateRequest req) {
        HandoverDto handover = handoverService.generateAndSaveHandover(req);
        return ResponseEntity.ok(ApiResponse.ok("Intelligent shift handover synthesized successfully", handover));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<HandoverDto>>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.ok(handoverService.getHandoversForPatient(patientId)));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<HandoverDto>>> getRecent() {
        return ResponseEntity.ok(ApiResponse.ok(handoverService.getAllRecent()));
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<ApiResponse<HandoverDto>> markReviewed(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Handover marked as reviewed", handoverService.markReviewed(id)));
    }
}
