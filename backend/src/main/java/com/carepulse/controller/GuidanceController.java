package com.carepulse.controller;

import com.carepulse.dto.ApiResponse;
import com.carepulse.dto.ClinicalScenarioDto;
import com.carepulse.dto.GuidanceResponseDto;
import com.carepulse.service.GuidanceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/guidance")
@Tag(name = "Clinical Guidance", description = "Endpoints for decision-support guidance scenarios and emergency warning protocols")
public class GuidanceController {

    private final GuidanceService guidanceService;

    public GuidanceController(GuidanceService guidanceService) {
        this.guidanceService = guidanceService;
    }

    @GetMapping("/scenarios")
    public ResponseEntity<ApiResponse<List<ClinicalScenarioDto>>> getScenarios() {
        return ResponseEntity.ok(ApiResponse.ok(guidanceService.getScenarios()));
    }

    @PostMapping("/query")
    public ResponseEntity<ApiResponse<GuidanceResponseDto>> queryGuidance(@RequestBody Map<String, String> body) {
        String text = body.getOrDefault("query", "");
        return ResponseEntity.ok(ApiResponse.ok(guidanceService.getGuidanceForObservation(text)));
    }
}
