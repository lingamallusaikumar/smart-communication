package com.smartcommunication.support;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/support/tickets")
public class SupportController {

    private final SupportService supportService;

    public SupportController(SupportService supportService) {
        this.supportService = supportService;
    }

    @GetMapping
    public ResponseEntity<List<SupportTicket>> getAllTickets(@RequestParam UUID orgId) {
        return ResponseEntity.ok(supportService.getAllTickets(orgId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupportTicket> getTicketById(@PathVariable UUID id) {
        return ResponseEntity.ok(supportService.getTicketById(id));
    }

    @PostMapping
    public ResponseEntity<SupportTicket> createTicket(@RequestBody SupportTicket ticket,
                                                      @RequestParam UUID orgId,
                                                      @RequestParam UUID customerId,
                                                      @RequestParam(required = false) UUID assignedToId) {
        return ResponseEntity.ok(supportService.createTicket(ticket, orgId, customerId, assignedToId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupportTicket> updateTicket(@PathVariable UUID id,
                                                      @RequestBody SupportTicket updates,
                                                      @RequestParam(required = false) UUID assignedToId) {
        return ResponseEntity.ok(supportService.updateTicket(id, updates, assignedToId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SupportTicket> updateTicketStatus(@PathVariable UUID id,
                                                            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(supportService.updateTicketStatus(id, body.get("status")));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketComment> addComment(@PathVariable UUID id,
                                                    @RequestBody TicketComment comment,
                                                    @RequestParam(required = false) UUID authorId) {
        return ResponseEntity.ok(supportService.addComment(id, comment, authorId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable UUID id) {
        supportService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-status")
    public ResponseEntity<List<SupportTicket>> getTicketsByStatus(@RequestParam UUID orgId,
                                                                  @RequestParam String status) {
        return ResponseEntity.ok(supportService.getTicketsByStatus(orgId, status));
    }

    @GetMapping("/by-assignee")
    public ResponseEntity<List<SupportTicket>> getTicketsByAssignee(@RequestParam UUID orgId,
                                                                    @RequestParam UUID assigneeId) {
        return ResponseEntity.ok(supportService.getTicketsByAssignee(orgId, assigneeId));
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getSupportMetrics(@RequestParam UUID orgId) {
        return ResponseEntity.ok(supportService.getSupportMetrics(orgId));
    }
}
