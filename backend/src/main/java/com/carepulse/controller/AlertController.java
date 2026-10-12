package com.carepulse.controller;

import com.carepulse.dto.AlertDto;
import com.carepulse.dto.ApiResponse;
import com.carepulse.service.AlertService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@Tag(name = "Alerts", description = "Endpoints for managing healthcare alerts and clinical notifications")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AlertDto>>> getAlerts(
            @RequestParam(required = false) Boolean unresolvedOnly,
            @RequestParam(required = false) Long patientId) {
        return ResponseEntity.ok(ApiResponse.ok(alertService.getAlerts(unresolvedOnly, patientId)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<AlertDto>> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Alert marked as read", alertService.markRead(id)));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<AlertDto>> resolveAlert(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Alert resolved", alertService.resolveAlert(id)));
    }
}
