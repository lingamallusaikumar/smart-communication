package com.smartcommunication.deals;

import com.smartcommunication.users.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/deals")
public class DealController {

    private final DealService dealService;

    public DealController(DealService dealService) {
        this.dealService = dealService;
    }

    @GetMapping("/pipelines")
    public ResponseEntity<List<Pipeline>> getPipelines() {
        return ResponseEntity.ok(dealService.getPipelines());
    }

    @GetMapping
    public ResponseEntity<List<Deal>> getDeals(@RequestParam(required = false) UUID pipelineId) {
        return ResponseEntity.ok(dealService.getDeals(pipelineId));
    }

    @PostMapping
    public ResponseEntity<Deal> createDeal(@RequestBody Deal deal,
                                           @RequestParam UUID pipelineId,
                                           @RequestParam UUID stageId,
                                           @RequestParam(required = false) UUID customerId,
                                           @RequestParam(required = false) UUID companyId,
                                           @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(dealService.createDeal(deal, pipelineId, stageId, customerId, companyId, currentUser));
    }

    @PatchMapping("/{id}/stage")
    public ResponseEntity<Deal> updateStage(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        UUID stageId = UUID.fromString(body.get("stageId"));
        String status = body.get("status");
        return ResponseEntity.ok(dealService.updateDealStage(id, stageId, status));
    }

    @GetMapping("/forecast")
    public ResponseEntity<Map<String, Object>> getForecast() {
        return ResponseEntity.ok(dealService.getSalesForecast());
    }
}
