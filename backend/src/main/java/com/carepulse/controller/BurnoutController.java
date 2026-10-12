package com.carepulse.controller;

import com.carepulse.dto.ApiResponse;
import com.carepulse.dto.BurnoutRiskDto;
import com.carepulse.dto.WellbeingCheckinRequest;
import com.carepulse.entity.WellbeingCheckin;
import com.carepulse.service.BurnoutService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/burnout")
@Tag(name = "Burnout & Wellbeing", description = "Endpoints for caregiver burnout tracking and wellbeing check-ins")
public class BurnoutController {

    private final BurnoutService burnoutService;

    public BurnoutController(BurnoutService burnoutService) {
        this.burnoutService = burnoutService;
    }

    @GetMapping("/current")
    public ResponseEntity<ApiResponse<BurnoutRiskDto>> getCurrentCaregiverBurnout() {
        return ResponseEntity.ok(ApiResponse.ok(burnoutService.getBurnoutRisk(null)));
    }

    @GetMapping("/caregiver/{id}")
    public ResponseEntity<ApiResponse<BurnoutRiskDto>> getCaregiverBurnout(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(burnoutService.getBurnoutRisk(id)));
    }

    @PostMapping("/checkin")
    public ResponseEntity<ApiResponse<BurnoutRiskDto>> recordCheckin(@Valid @RequestBody WellbeingCheckinRequest req) {
        BurnoutRiskDto updated = burnoutService.recordWellbeingCheckin(req);
        return ResponseEntity.ok(ApiResponse.ok("Wellbeing check-in saved and burnout risk updated", updated));
    }

    @GetMapping("/checkin/history")
    public ResponseEntity<ApiResponse<List<WellbeingCheckin>>> getCheckinHistory(@RequestParam(required = false) Long caregiverId) {
        return ResponseEntity.ok(ApiResponse.ok(burnoutService.getWellbeingHistory(caregiverId)));
    }
}
