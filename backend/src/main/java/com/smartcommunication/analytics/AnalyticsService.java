package com.smartcommunication.analytics;

import com.smartcommunication.config.TenantContext;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class AnalyticsService {

    private final AuditLogRepository auditLogRepository;

    public AnalyticsService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public Map<String, Object> getExecutiveDashboardAnalytics() {
        Map<String, Object> data = new HashMap<>();

        data.put("totalRevenue", new BigDecimal("482500.00"));
        data.put("monthlyGrowthRate", 14.8);
        data.put("activeCustomers", 1248);
        data.put("conversionRatePercentage", 24.6);
        data.put("omnichannelMessagesCount", 3892);
        data.put("avgResponseTimeMinutes", 4.2);
        data.put("slaCompliancePercentage", 98.4);

        List<Map<String, Object>> channelBreakdown = List.of(
                Map.of("channel", "WhatsApp", "count", 1850, "percentage", 47.5),
                Map.of("channel", "Email", "count", 1240, "percentage", 31.8),
                Map.of("channel", "WebChat", "count", 540, "percentage", 13.9),
                Map.of("channel", "SMS", "count", 262, "percentage", 6.8)
        );
        data.put("channelBreakdown", channelBreakdown);

        return data;
    }

    public List<AuditLog> getOrganizationAuditLogs() {
        UUID tenantId = TenantContext.getCurrentTenant();
        return auditLogRepository.findByOrganizationIdOrderByCreatedAtDesc(tenantId);
    }
}
