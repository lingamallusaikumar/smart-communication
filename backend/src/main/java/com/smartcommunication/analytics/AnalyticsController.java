package com.smartcommunication.analytics;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardSummary(@RequestParam UUID orgId) {
        return ResponseEntity.ok(analyticsService.getDashboardSummary(orgId));
    }

    @GetMapping("/sales-performance")
    public ResponseEntity<Map<String, Object>> getSalesPerformance(
            @RequestParam UUID orgId,
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(analyticsService.getSalesPerformance(orgId, days));
    }

    @GetMapping("/pipeline")
    public ResponseEntity<Map<String, Object>> getPipelineAnalytics(@RequestParam UUID orgId) {
        return ResponseEntity.ok(analyticsService.getPipelineAnalytics(orgId));
    }

    @GetMapping("/customer-growth")
    public ResponseEntity<Map<String, Object>> getCustomerGrowth(
            @RequestParam UUID orgId,
            @RequestParam(defaultValue = "12") int months) {
        return ResponseEntity.ok(analyticsService.getCustomerGrowth(orgId, months));
    }

    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueAnalytics(@RequestParam UUID orgId) {
        return ResponseEntity.ok(analyticsService.getRevenueAnalytics(orgId));
    }

    @GetMapping("/activity")
    public ResponseEntity<Map<String, Object>> getActivityMetrics(@RequestParam UUID orgId) {
        return ResponseEntity.ok(analyticsService.getActivityMetrics(orgId));
    }
}
