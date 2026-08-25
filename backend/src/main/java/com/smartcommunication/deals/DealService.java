package com.smartcommunication.deals;

import com.smartcommunication.config.TenantContext;
import com.smartcommunication.customers.*;
import com.smartcommunication.organization.Organization;
import com.smartcommunication.organization.OrganizationRepository;
import com.smartcommunication.users.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class DealService {

    private final DealRepository dealRepository;
    private final PipelineRepository pipelineRepository;
    private final PipelineStageRepository stageRepository;
    private final CustomerRepository customerRepository;
    private final CompanyRepository companyRepository;
    private final CustomerActivityRepository activityRepository;
    private final OrganizationRepository organizationRepository;

    public DealService(DealRepository dealRepository,
                       PipelineRepository pipelineRepository,
                       PipelineStageRepository stageRepository,
                       CustomerRepository customerRepository,
                       CompanyRepository companyRepository,
                       CustomerActivityRepository activityRepository,
                       OrganizationRepository organizationRepository) {
        this.dealRepository = dealRepository;
        this.pipelineRepository = pipelineRepository;
        this.stageRepository = stageRepository;
        this.customerRepository = customerRepository;
        this.companyRepository = companyRepository;
        this.activityRepository = activityRepository;
        this.organizationRepository = organizationRepository;
    }

    public List<Pipeline> getPipelines() {
        UUID tenantId = TenantContext.getCurrentTenant();
        List<Pipeline> pipelines = pipelineRepository.findByOrganizationId(tenantId);
        if (pipelines.isEmpty()) {
            Organization org = organizationRepository.findById(tenantId)
                    .orElseThrow(() -> new IllegalArgumentException("Organization not found"));
            Pipeline defaultPipeline = createDefaultPipeline(org);
            return List.of(defaultPipeline);
        }
        return pipelines;
    }

    @Transactional
    public Pipeline createDefaultPipeline(Organization org) {
        Pipeline pipeline = new Pipeline(org, "Standard Sales Pipeline", true);
        pipeline = pipelineRepository.save(pipeline);

        List<PipelineStage> stages = List.of(
                new PipelineStage(pipeline, "Qualification", 20, 1),
                new PipelineStage(pipeline, "Proposal / Demo", 40, 2),
                new PipelineStage(pipeline, "Negotiation", 70, 3),
                new PipelineStage(pipeline, "Closed Won", 100, 4),
                new PipelineStage(pipeline, "Closed Lost", 0, 5)
        );
        stageRepository.saveAll(stages);
        pipeline.setStages(stages);
        return pipeline;
    }

    public List<Deal> getDeals(UUID pipelineId) {
        UUID tenantId = TenantContext.getCurrentTenant();
        if (pipelineId != null) {
            return dealRepository.findByPipelineId(pipelineId);
        }
        return dealRepository.findByOrganizationId(tenantId);
    }

    @Transactional
    public Deal createDeal(Deal deal, UUID pipelineId, UUID stageId, UUID customerId, UUID companyId, User currentUser) {
        UUID tenantId = TenantContext.getCurrentTenant();
        Organization org = organizationRepository.findById(tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        Pipeline pipeline = pipelineRepository.findById(pipelineId)
                .orElseThrow(() -> new IllegalArgumentException("Pipeline not found"));
        PipelineStage stage = stageRepository.findById(stageId)
                .orElseThrow(() -> new IllegalArgumentException("Stage not found"));

        deal.setOrganization(org);
        deal.setPipeline(pipeline);
        deal.setStage(stage);
        deal.setOwner(currentUser);

        if (customerId != null) {
            Customer customer = customerRepository.findByIdAndOrganizationId(customerId, tenantId).orElse(null);
            deal.setCustomer(customer);
        }
        if (companyId != null) {
            Company company = companyRepository.findByIdAndOrganizationId(companyId, tenantId).orElse(null);
            deal.setCompany(company);
        }

        Deal savedDeal = dealRepository.save(deal);

        if (savedDeal.getCustomer() != null) {
            CustomerActivity activity = new CustomerActivity(
                    org, savedDeal.getCustomer(), currentUser,
                    "DEAL_CREATED",
                    "New Opportunity: " + deal.getTitle(),
                    "Sales opportunity valued at $" + deal.getValue() + " created in stage " + stage.getName()
            );
            activityRepository.save(activity);
        }

        return savedDeal;
    }

    @Transactional
    public Deal updateDealStage(UUID dealId, UUID stageId, String status) {
        UUID tenantId = TenantContext.getCurrentTenant();
        Deal deal = dealRepository.findByIdAndOrganizationId(dealId, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Deal not found"));

        PipelineStage stage = stageRepository.findById(stageId)
                .orElseThrow(() -> new IllegalArgumentException("Stage not found"));

        deal.setStage(stage);
        if (status != null) {
            deal.setStatus(status);
        }

        return dealRepository.save(deal);
    }

    public Map<String, Object> getSalesForecast() {
        UUID tenantId = TenantContext.getCurrentTenant();
        List<Deal> deals = dealRepository.findByOrganizationId(tenantId);

        BigDecimal totalPipelineValue = BigDecimal.ZERO;
        BigDecimal weightedForecast = BigDecimal.ZERO;
        BigDecimal wonRevenue = BigDecimal.ZERO;
        int openCount = 0;
        int wonCount = 0;

        for (Deal d : deals) {
            if ("WON".equalsIgnoreCase(d.getStatus())) {
                wonRevenue = wonRevenue.add(d.getValue());
                wonCount++;
            } else if ("OPEN".equalsIgnoreCase(d.getStatus())) {
                totalPipelineValue = totalPipelineValue.add(d.getValue());
                int prob = d.getStage() != null ? d.getStage().getWinProbability() : 10;
                BigDecimal weighted = d.getValue().multiply(BigDecimal.valueOf(prob)).divide(BigDecimal.valueOf(100));
                weightedForecast = weightedForecast.add(weighted);
                openCount++;
            }
        }

        Map<String, Object> forecast = new HashMap<>();
        forecast.put("totalPipelineValue", totalPipelineValue);
        forecast.put("weightedForecast", weightedForecast);
        forecast.put("wonRevenue", wonRevenue);
        forecast.put("openDealsCount", openCount);
        forecast.put("wonDealsCount", wonCount);

        return forecast;
    }
}
