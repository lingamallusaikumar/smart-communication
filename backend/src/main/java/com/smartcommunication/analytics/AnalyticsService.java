package com.smartcommunication.analytics;

import com.smartcommunication.customers.CustomerRepository;
import com.smartcommunication.deals.DealRepository;
import com.smartcommunication.deals.PipelineRepository;
import com.smartcommunication.organization.OrganizationRepository;
import com.smartcommunication.users.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class AnalyticsService {

    private final CustomerRepository customerRepository;
    private final DealRepository dealRepository;
    private final PipelineRepository pipelineRepository;
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;

    public AnalyticsService(CustomerRepository customerRepository,
                            DealRepository dealRepository,
                            PipelineRepository pipelineRepository,
                            OrganizationRepository organizationRepository,
                            UserRepository userRepository) {
        this.customerRepository = customerRepository;
        this.dealRepository = dealRepository;
        this.pipelineRepository = pipelineRepository;
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Object> getDashboardSummary(UUID orgId) {
        Map<String, Object> summary = new LinkedHashMap<>();

        long totalCustomers = customerRepository.countByOrganizationId(orgId);
        long totalDeals = dealRepository.countByOrganizationId(orgId);
        long wonDeals = dealRepository.countByOrganizationIdAndStatus(orgId, "WON");
        long lostDeals = dealRepository.countByOrganizationIdAndStatus(orgId, "LOST");
        long openDeals = dealRepository.countByOrganizationIdAndStatus(orgId, "OPEN");

        BigDecimal totalRevenue = dealRepository.sumValueByOrganizationIdAndStatus(orgId, "WON");
        BigDecimal pipelineValue = dealRepository.sumValueByOrganizationIdAndStatus(orgId, "OPEN");

        double winRate = (wonDeals + lostDeals) > 0
                ? (double) wonDeals / (wonDeals + lostDeals) * 100 : 0;

        summary.put("totalCustomers", totalCustomers);
        summary.put("totalDeals", totalDeals);
        summary.put("openDeals", openDeals);
        summary.put("wonDeals", wonDeals);
        summary.put("lostDeals", lostDeals);
        summary.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        summary.put("pipelineValue", pipelineValue != null ? pipelineValue : BigDecimal.ZERO);
        summary.put("winRate", Math.round(winRate * 100.0) / 100.0);

        return summary;
    }

    public Map<String, Object> getSalesPerformance(UUID orgId, int days) {
        Map<String, Object> perf = new LinkedHashMap<>();

        List<Map<String, Object>> dailyWon = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            Map<String, Object> day = new LinkedHashMap<>();
            day.put("date", date.format(fmt));
            day.put("won", 0);
            day.put("lost", 0);
            day.put("created", 0);
            dailyWon.add(day);
        }

        perf.put("dailyActivity", dailyWon);
        perf.put("periodDays", days);

        List<Map<String, Object>> teamPerf = new ArrayList<>();
        userRepository.findByOrganizationId(orgId).forEach(user -> {
            long userWon = dealRepository.countByOrganizationIdAndOwnerIdAndStatus(orgId, user.getId(), "WON");
            long userOpen = dealRepository.countByOrganizationIdAndOwnerIdAndStatus(orgId, user.getId(), "OPEN");
            BigDecimal userRevenue = dealRepository.sumValueByOrganizationIdAndOwnerIdAndStatus(orgId, user.getId(), "WON");
            Map<String, Object> rep = new LinkedHashMap<>();
            rep.put("userId", user.getId());
            rep.put("name", user.getFirstName() + " " + user.getLastName());
            rep.put("wonDeals", userWon);
            rep.put("openDeals", userOpen);
            rep.put("revenue", userRevenue != null ? userRevenue : BigDecimal.ZERO);
            teamPerf.add(rep);
        });

        teamPerf.sort((a, b) -> {
            BigDecimal ra = (BigDecimal) a.get("revenue");
            BigDecimal rb = (BigDecimal) b.get("revenue");
            return rb.compareTo(ra);
        });

        perf.put("teamPerformance", teamPerf);
        return perf;
    }

    public Map<String, Object> getPipelineAnalytics(UUID orgId) {
        Map<String, Object> pipeline = new LinkedHashMap<>();

        List<Map<String, Object>> stageBreakdown = new ArrayList<>();
        pipelineRepository.findByOrganizationId(orgId).forEach(p -> {
            if (p.getStages() != null) {
                p.getStages().forEach(stage -> {
                    long count = dealRepository.countByOrganizationIdAndStageId(orgId, stage.getId());
                    BigDecimal value = dealRepository.sumValueByOrganizationIdAndStageId(orgId, stage.getId());
                    Map<String, Object> s = new LinkedHashMap<>();
                    s.put("stageId", stage.getId());
                    s.put("stageName", stage.getName());
                    s.put("pipelineName", p.getName());
                    s.put("dealCount", count);
                    s.put("totalValue", value != null ? value : BigDecimal.ZERO);
                    stageBreakdown.add(s);
                });
            }
        });

        pipeline.put("stageBreakdown", stageBreakdown);
        return pipeline;
    }

    public Map<String, Object> getCustomerGrowth(UUID orgId, int months) {
        Map<String, Object> growth = new LinkedHashMap<>();
        List<Map<String, Object>> monthlyData = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");

        for (int i = months - 1; i >= 0; i--) {
            LocalDate month = LocalDate.now().withDayOfMonth(1).minusMonths(i);
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("month", month.format(fmt));
            m.put("newCustomers", 0);
            m.put("totalCustomers", customerRepository.countByOrganizationId(orgId));
            monthlyData.add(m);
        }

        growth.put("monthlyGrowth", monthlyData);
        growth.put("totalCustomers", customerRepository.countByOrganizationId(orgId));
        return growth;
    }

    public Map<String, Object> getRevenueAnalytics(UUID orgId) {
        Map<String, Object> revenue = new LinkedHashMap<>();

        BigDecimal totalRevenue = dealRepository.sumValueByOrganizationIdAndStatus(orgId, "WON");
        BigDecimal pipelineRevenue = dealRepository.sumValueByOrganizationIdAndStatus(orgId, "OPEN");

        revenue.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        revenue.put("pipelineRevenue", pipelineRevenue != null ? pipelineRevenue : BigDecimal.ZERO);
        revenue.put("wonDeals", dealRepository.countByOrganizationIdAndStatus(orgId, "WON"));
        revenue.put("avgDealSize", totalRevenue != null && dealRepository.countByOrganizationIdAndStatus(orgId, "WON") > 0
                ? totalRevenue.divide(BigDecimal.valueOf(dealRepository.countByOrganizationIdAndStatus(orgId, "WON")), 2, java.math.RoundingMode.HALF_UP)
                : BigDecimal.ZERO);

        List<Map<String, Object>> monthly = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");
        for (int i = 11; i >= 0; i--) {
            LocalDate m = LocalDate.now().withDayOfMonth(1).minusMonths(i);
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("month", m.format(fmt));
            entry.put("revenue", BigDecimal.ZERO);
            entry.put("deals", 0);
            monthly.add(entry);
        }
        revenue.put("monthlyRevenue", monthly);
        return revenue;
    }

    public Map<String, Object> getActivityMetrics(UUID orgId) {
        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("totalUsers", userRepository.countByOrganizationId(orgId));
        metrics.put("totalCustomers", customerRepository.countByOrganizationId(orgId));
        metrics.put("totalDeals", dealRepository.countByOrganizationId(orgId));
        metrics.put("openDeals", dealRepository.countByOrganizationIdAndStatus(orgId, "OPEN"));
        metrics.put("wonDeals", dealRepository.countByOrganizationIdAndStatus(orgId, "WON"));
        metrics.put("lostDeals", dealRepository.countByOrganizationIdAndStatus(orgId, "LOST"));
        return metrics;
    }
}
