package com.carepulse.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    private final DataSource dataSource;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new LinkedHashMap<>();
        response.put("status", "UP");
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(2)) {
                response.put("database", "UP");
            } else {
                response.put("database", "DOWN");
            }
        } catch (Exception e) {
            response.put("database", "DOWN");
        }
        return ResponseEntity.ok(response);
    }
}
