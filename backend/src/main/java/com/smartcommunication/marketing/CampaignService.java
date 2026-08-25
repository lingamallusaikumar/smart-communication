package com.smartcommunication.marketing;

import com.smartcommunication.organization.Organization;
import com.smartcommunication.organization.OrganizationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.*;

@Service
@Transactional
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final CampaignRecipientRepository recipientRepository;
    private final OrganizationRepository organizationRepository;

    public CampaignService(CampaignRepository campaignRepository,
                           CampaignRecipientRepository recipientRepository,
                           OrganizationRepository organizationRepository) {
        this.campaignRepository = campaignRepository;
        this.recipientRepository = recipientRepository;
        this.organizationRepository = organizationRepository;
    }

    public List<Campaign> getAllCampaigns(UUID orgId) {
        return campaignRepository.findByOrganizationIdOrderByCreatedAtDesc(orgId);
    }

    public Campaign getCampaignById(UUID id) {
        return campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found with id: " + id));
    }

    public Campaign createCampaign(Campaign campaign, UUID orgId) {
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found: " + orgId));
        campaign.setOrganization(org);
        campaign.setStatus("DRAFT");
        campaign.setCreatedAt(ZonedDateTime.now());
        campaign.setUpdatedAt(ZonedDateTime.now());
        return campaignRepository.save(campaign);
    }

    public Campaign updateCampaign(UUID id, Campaign updates) {
        Campaign existing = getCampaignById(id);
        if (updates.getName() != null) existing.setName(updates.getName());
        if (updates.getSubject() != null) existing.setSubject(updates.getSubject());
        if (updates.getHtmlContent() != null) existing.setHtmlContent(updates.getHtmlContent());
        if (updates.getTextContent() != null) existing.setTextContent(updates.getTextContent());
        if (updates.getCampaignType() != null) existing.setCampaignType(updates.getCampaignType());
        if (updates.getScheduledAt() != null) existing.setScheduledAt(updates.getScheduledAt());
        existing.setUpdatedAt(ZonedDateTime.now());
        return campaignRepository.save(existing);
    }

    public void deleteCampaign(UUID id) {
        if (!campaignRepository.existsById(id)) {
            throw new RuntimeException("Campaign not found with id: " + id);
        }
        campaignRepository.deleteById(id);
    }

    public Campaign launchCampaign(UUID id) {
        Campaign campaign = getCampaignById(id);
        if (!"DRAFT".equals(campaign.getStatus()) && !"PAUSED".equals(campaign.getStatus())) {
            throw new RuntimeException("Cannot launch campaign with status: " + campaign.getStatus());
        }
        campaign.setStatus("RUNNING");
        campaign.setSentAt(ZonedDateTime.now());
        campaign.setUpdatedAt(ZonedDateTime.now());
        return campaignRepository.save(campaign);
    }

    public Campaign pauseCampaign(UUID id) {
        Campaign campaign = getCampaignById(id);
        if (!"RUNNING".equals(campaign.getStatus())) {
            throw new RuntimeException("Cannot pause campaign that is not running. Current status: " + campaign.getStatus());
        }
        campaign.setStatus("PAUSED");
        campaign.setUpdatedAt(ZonedDateTime.now());
        return campaignRepository.save(campaign);
    }

    public Map<String, Object> getCampaignAnalytics(UUID id) {
        Campaign campaign = getCampaignById(id);
        Map<String, Object> analytics = new LinkedHashMap<>();
        analytics.put("campaignId", campaign.getId());
        analytics.put("campaignName", campaign.getName());
        analytics.put("status", campaign.getStatus());
        analytics.put("totalRecipients", campaign.getTotalRecipients());
        analytics.put("totalDelivered", campaign.getTotalDelivered());
        analytics.put("totalOpened", campaign.getTotalOpened());
        analytics.put("totalClicked", campaign.getTotalClicked());
        analytics.put("totalBounced", campaign.getTotalBounced());
        analytics.put("totalUnsubscribed", campaign.getTotalUnsubscribed());

        double deliveryRate = campaign.getTotalRecipients() > 0
                ? (double) campaign.getTotalDelivered() / campaign.getTotalRecipients() * 100 : 0;
        double openRate = campaign.getTotalDelivered() > 0
                ? (double) campaign.getTotalOpened() / campaign.getTotalDelivered() * 100 : 0;
        double clickRate = campaign.getTotalOpened() > 0
                ? (double) campaign.getTotalClicked() / campaign.getTotalOpened() * 100 : 0;
        double bounceRate = campaign.getTotalRecipients() > 0
                ? (double) campaign.getTotalBounced() / campaign.getTotalRecipients() * 100 : 0;
        double unsubscribeRate = campaign.getTotalDelivered() > 0
                ? (double) campaign.getTotalUnsubscribed() / campaign.getTotalDelivered() * 100 : 0;

        analytics.put("deliveryRate", Math.round(deliveryRate * 100.0) / 100.0);
        analytics.put("openRate", Math.round(openRate * 100.0) / 100.0);
        analytics.put("clickRate", Math.round(clickRate * 100.0) / 100.0);
        analytics.put("bounceRate", Math.round(bounceRate * 100.0) / 100.0);
        analytics.put("unsubscribeRate", Math.round(unsubscribeRate * 100.0) / 100.0);

        return analytics;
    }

    public Map<String, Object> getMarketingMetrics(UUID orgId) {
        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("totalCampaigns", campaignRepository.countByOrganizationId(orgId));
        metrics.put("draftCampaigns", campaignRepository.countByOrganizationIdAndStatus(orgId, "DRAFT"));
        metrics.put("runningCampaigns", campaignRepository.countByOrganizationIdAndStatus(orgId, "RUNNING"));
        metrics.put("completedCampaigns", campaignRepository.countByOrganizationIdAndStatus(orgId, "COMPLETED"));
        metrics.put("pausedCampaigns", campaignRepository.countByOrganizationIdAndStatus(orgId, "PAUSED"));

        List<Campaign> allCampaigns = campaignRepository.findByOrganizationIdOrderByCreatedAtDesc(orgId);
        int totalRecipients = allCampaigns.stream().mapToInt(Campaign::getTotalRecipients).sum();
        int totalOpened = allCampaigns.stream().mapToInt(Campaign::getTotalOpened).sum();
        int totalClicked = allCampaigns.stream().mapToInt(Campaign::getTotalClicked).sum();

        metrics.put("totalRecipients", totalRecipients);
        metrics.put("avgOpenRate", totalRecipients > 0
                ? Math.round((double) totalOpened / totalRecipients * 10000.0) / 100.0 : 0);
        metrics.put("avgClickRate", totalOpened > 0
                ? Math.round((double) totalClicked / totalOpened * 10000.0) / 100.0 : 0);

        return metrics;
    }

    public List<Campaign> getCampaignsByStatus(UUID orgId, String status) {
        return campaignRepository.findByOrganizationIdAndStatus(orgId, status);
    }
}
