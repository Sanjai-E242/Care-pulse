package com.carepulse.controller;

import com.carepulse.dto.ApiResponse;
import com.carepulse.dto.CareTaskDto;
import com.carepulse.dto.TaskReassignRequest;
import com.carepulse.service.CareTaskService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Care Tasks", description = "Endpoints for care task management, status updates, and reassignment")
public class CareTaskController {

    private final CareTaskService careTaskService;

    public CareTaskController(CareTaskService careTaskService) {
        this.careTaskService = careTaskService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CareTaskDto>>> getTasks(
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) Long caregiverId) {
        return ResponseEntity.ok(ApiResponse.ok(careTaskService.getTasks(patientId, caregiverId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CareTaskDto>> createTask(@Valid @RequestBody CareTaskDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Task created successfully", careTaskService.createTask(dto)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<CareTaskDto>> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.ok("Task status updated", careTaskService.updateStatus(id, status)));
    }

    @PostMapping("/reassign")
    public ResponseEntity<ApiResponse<CareTaskDto>> reassignTask(@Valid @RequestBody TaskReassignRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Task reassigned successfully", careTaskService.reassignTask(req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        careTaskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.ok("Task deleted", null));
    }
}
