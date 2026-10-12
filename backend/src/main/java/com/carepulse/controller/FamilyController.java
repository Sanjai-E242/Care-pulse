package com.carepulse.controller;

import com.carepulse.dto.ApiResponse;
import com.carepulse.dto.FamilyDiscussionDto;
import com.carepulse.dto.FamilyDiscussionRequest;
import com.carepulse.dto.FamilySummaryDto;
import com.carepulse.entity.FamilyGroup;
import com.carepulse.entity.FamilyMember;
import com.carepulse.service.FamilyService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/family")
@Tag(name = "Family Coordination", description = "Endpoints for family care team, discussions, and AI consensus summaries")
public class FamilyController {

    private final FamilyService familyService;

    public FamilyController(FamilyService familyService) {
        this.familyService = familyService;
    }

    @GetMapping("/group/{patientId}")
    public ResponseEntity<ApiResponse<FamilyGroup>> getGroup(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.ok(familyService.getOrCreateFamilyGroup(patientId)));
    }

    @GetMapping("/members/{patientId}")
    public ResponseEntity<ApiResponse<List<FamilyMember>>> getMembers(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.ok(familyService.getMembers(patientId)));
    }

    @GetMapping("/discussions/{patientId}")
    public ResponseEntity<ApiResponse<List<FamilyDiscussionDto>>> getDiscussions(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.ok(familyService.getDiscussions(patientId)));
    }

    @PostMapping("/discussions")
    public ResponseEntity<ApiResponse<FamilyDiscussionDto>> postDiscussion(@Valid @RequestBody FamilyDiscussionRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Message posted to family circle", familyService.postMessage(req)));
    }

    @GetMapping("/summary/{patientId}")
    public ResponseEntity<ApiResponse<FamilySummaryDto>> getAiSummary(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.ok(familyService.getAiDiscussionSummary(patientId)));
    }
}
