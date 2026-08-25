package com.smartcommunication.ai;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeText(@RequestBody Map<String, String> body) {
        String text = body.get("text");
        return ResponseEntity.ok(aiService.analyzeConversationText(text));
    }

    @GetMapping("/memory/{customerId}")
    public ResponseEntity<SmartCustomerMemory> getMemory(@PathVariable UUID customerId) {
        return ResponseEntity.ok(aiService.getSmartCustomerMemory(customerId));
    }

    @PutMapping("/memory/{customerId}")
    public ResponseEntity<SmartCustomerMemory> updateMemory(@PathVariable UUID customerId, @RequestBody SmartCustomerMemory memoryData) {
        return ResponseEntity.ok(aiService.updateSmartCustomerMemory(customerId, memoryData));
    }

    @GetMapping("/insights")
    public ResponseEntity<List<AiInsight>> getInsights() {
        return ResponseEntity.ok(aiService.getOrganizationAiInsights());
    }
}
