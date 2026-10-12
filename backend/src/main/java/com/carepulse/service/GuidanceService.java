package com.carepulse.service;

import com.carepulse.ai.GuidanceAgent;
import com.carepulse.dto.ClinicalScenarioDto;
import com.carepulse.dto.GuidanceResponseDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GuidanceService {

    private final GuidanceAgent guidanceAgent;

    public GuidanceService(GuidanceAgent guidanceAgent) {
        this.guidanceAgent = guidanceAgent;
    }

    public List<ClinicalScenarioDto> getScenarios() {
        return guidanceAgent.getAllScenarios();
    }

    public GuidanceResponseDto getGuidanceForObservation(String text) {
        return guidanceAgent.getGuidanceForObservation(text);
    }
}
