package com.example.demo.controller;

import com.example.demo.service.AnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {
    
    private final AnalyticsService analyticsService;
    
    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }
    
    @GetMapping("/stats")
    public Map<String, Object> getStatistics() {
        return analyticsService.getStatistics();
    }
}