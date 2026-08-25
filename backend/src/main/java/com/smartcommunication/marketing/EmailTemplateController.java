package com.smartcommunication.marketing;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/marketing/templates")
public class EmailTemplateController {

    private final EmailTemplateService templateService;

    public EmailTemplateController(EmailTemplateService templateService) {
        this.templateService = templateService;
    }

    @GetMapping
    public ResponseEntity<List<EmailTemplate>> getAllTemplates(@RequestParam UUID orgId) {
        return ResponseEntity.ok(templateService.getAllTemplates(orgId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmailTemplate> getTemplateById(@PathVariable UUID id) {
        return ResponseEntity.ok(templateService.getTemplateById(id));
    }

    @PostMapping
    public ResponseEntity<EmailTemplate> createTemplate(@RequestBody EmailTemplate template, @RequestParam UUID orgId) {
        return ResponseEntity.ok(templateService.createTemplate(template, orgId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmailTemplate> updateTemplate(@PathVariable UUID id, @RequestBody EmailTemplate updates) {
        return ResponseEntity.ok(templateService.updateTemplate(id, updates));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable UUID id) {
        templateService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-category")
    public ResponseEntity<List<EmailTemplate>> getTemplatesByCategory(@RequestParam UUID orgId, @RequestParam String category) {
        return ResponseEntity.ok(templateService.getTemplatesByCategory(orgId, category));
    }

    @PostMapping("/{id}/render")
    public ResponseEntity<String> renderTemplate(@PathVariable UUID id, @RequestBody Map<String, String> variables) {
        return ResponseEntity.ok(templateService.renderTemplate(id, variables));
    }
}
