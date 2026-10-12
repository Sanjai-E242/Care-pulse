package com.carepulse.controller;

import com.carepulse.dto.ApiResponse;
import com.carepulse.dto.DashboardSummaryDto;
import com.carepulse.service.DashboardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Unified role-based dashboard overview endpoint")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardSummaryDto>> getDashboardSummary() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getDashboardSummary()));
    }
}
