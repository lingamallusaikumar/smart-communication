package com.smartcommunication.leads;

import com.smartcommunication.customers.Customer;
import com.smartcommunication.users.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/leads")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @GetMapping
    public ResponseEntity<List<Lead>> getAllLeads() {
        return ResponseEntity.ok(leadService.getAllLeads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lead> getLeadById(@PathVariable UUID id) {
        return ResponseEntity.ok(leadService.getLeadById(id));
    }

    @PostMapping
    public ResponseEntity<Lead> createLead(@RequestBody Lead lead, @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(leadService.createLead(lead, currentUser));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Lead> updateStatus(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        return ResponseEntity.ok(leadService.updateLeadStatus(id, newStatus));
    }

    @PostMapping("/{id}/convert")
    public ResponseEntity<Customer> convertToCustomer(@PathVariable UUID id, @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(leadService.convertLeadToCustomer(id, currentUser));
    }
}
