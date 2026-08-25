package com.smartcommunication.marketing;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/marketing/campaigns")
public class CampaignController {

    private final CampaignService campaignService;

    public CampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @GetMapping
    public ResponseEntity<List<Campaign>> getAllCampaigns(@RequestParam UUID orgId) {
        return ResponseEntity.ok(campaignService.getAllCampaigns(orgId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Campaign> getCampaignById(@PathVariable UUID id) {
        return ResponseEntity.ok(campaignService.getCampaignById(id));
    }

    @PostMapping
    public ResponseEntity<Campaign> createCampaign(@RequestBody Campaign campaign, @RequestParam UUID orgId) {
        return ResponseEntity.ok(campaignService.createCampaign(campaign, orgId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Campaign> updateCampaign(@PathVariable UUID id, @RequestBody Campaign updates) {
        return ResponseEntity.ok(campaignService.updateCampaign(id, updates));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable UUID id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/launch")
    public ResponseEntity<Campaign> launchCampaign(@PathVariable UUID id) {
        return ResponseEntity.ok(campaignService.launchCampaign(id));
    }

    @PostMapping("/{id}/pause")
    public ResponseEntity<Campaign> pauseCampaign(@PathVariable UUID id) {
        return ResponseEntity.ok(campaignService.pauseCampaign(id));
    }

    @GetMapping("/{id}/analytics")
    public ResponseEntity<Map<String, Object>> getCampaignAnalytics(@PathVariable UUID id) {
        return ResponseEntity.ok(campaignService.getCampaignAnalytics(id));
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMarketingMetrics(@RequestParam UUID orgId) {
        return ResponseEntity.ok(campaignService.getMarketingMetrics(orgId));
    }

    @GetMapping("/by-status")
    public ResponseEntity<List<Campaign>> getCampaignsByStatus(@RequestParam UUID orgId, @RequestParam String status) {
        return ResponseEntity.ok(campaignService.getCampaignsByStatus(orgId, status));
    }
}
