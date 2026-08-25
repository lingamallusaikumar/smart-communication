package com.smartcommunication.support;

import com.smartcommunication.config.TenantContext;
import com.smartcommunication.customers.Customer;
import com.smartcommunication.customers.CustomerActivity;
import com.smartcommunication.customers.CustomerActivityRepository;
import com.smartcommunication.customers.CustomerRepository;
import com.smartcommunication.organization.Organization;
import com.smartcommunication.organization.OrganizationRepository;
import com.smartcommunication.users.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.*;

@Service
public class SupportService {

    private final TicketRepository ticketRepository;
    private final SlaRuleRepository slaRuleRepository;
    private final CustomerRepository customerRepository;
    private final CustomerActivityRepository activityRepository;
    private final OrganizationRepository organizationRepository;

    public SupportService(TicketRepository ticketRepository,
                          SlaRuleRepository slaRuleRepository,
                          CustomerRepository customerRepository,
                          CustomerActivityRepository activityRepository,
                          OrganizationRepository organizationRepository) {
        this.ticketRepository = ticketRepository;
        this.slaRuleRepository = slaRuleRepository;
        this.customerRepository = customerRepository;
        this.activityRepository = activityRepository;
        this.organizationRepository = organizationRepository;
    }

    public List<Ticket> getAllTickets() {
        UUID tenantId = TenantContext.getCurrentTenant();
        return ticketRepository.findByOrganizationIdOrderByCreatedAtDesc(tenantId);
    }

    @Transactional
    public Ticket createTicket(Ticket ticket, UUID customerId, User currentUser) {
        UUID tenantId = TenantContext.getCurrentTenant();
        Organization org = organizationRepository.findById(tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        ticket.setOrganization(org);
        ticket.setTicketNumber("TKT-" + (System.currentTimeMillis() % 100000));
        ticket.setAssignedAgent(currentUser);

        if (customerId != null) {
            Customer customer = customerRepository.findByIdAndOrganizationId(customerId, tenantId).orElse(null);
            ticket.setCustomer(customer);
        }

        // Apply SLA Deadlines
        String priority = ticket.getPriority() != null ? ticket.getPriority().toUpperCase() : "MEDIUM";
        int firstRespMins = "URGENT".equals(priority) ? 15 : "HIGH".equals(priority) ? 60 : 240;
        int resolutionMins = "URGENT".equals(priority) ? 120 : "HIGH".equals(priority) ? 480 : 1440;

        ticket.setFirstResponseDueAt(ZonedDateTime.now().plusMinutes(firstRespMins));
        ticket.setResolutionDueAt(ZonedDateTime.now().plusMinutes(resolutionMins));

        Ticket savedTicket = ticketRepository.save(ticket);

        if (savedTicket.getCustomer() != null) {
            CustomerActivity activity = new CustomerActivity(
                    org, savedTicket.getCustomer(), currentUser,
                    "SUPPORT_TICKET",
                    "Support Ticket #" + savedTicket.getTicketNumber() + " Created",
                    ticket.getSubject()
            );
            activityRepository.save(activity);
        }

        return savedTicket;
    }

    @Transactional
    public Ticket updateTicketStatus(UUID ticketId, String status) {
        UUID tenantId = TenantContext.getCurrentTenant();
        Ticket ticket = ticketRepository.findByIdAndOrganizationId(ticketId, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));

        ticket.setStatus(status);
        if ("RESOLVED".equalsIgnoreCase(status) || "CLOSED".equalsIgnoreCase(status)) {
            ticket.setResolvedAt(ZonedDateTime.now());
        }
        return ticketRepository.save(ticket);
    }

    public Map<String, Object> getSupportMetrics() {
        UUID tenantId = TenantContext.getCurrentTenant();
        List<Ticket> tickets = ticketRepository.findByOrganizationIdOrderByCreatedAtDesc(tenantId);

        int total = tickets.size();
        int open = 0;
        int resolved = 0;
        int slaCompliant = 0;

        for (Ticket t : tickets) {
            if ("RESOLVED".equalsIgnoreCase(t.getStatus()) || "CLOSED".equalsIgnoreCase(t.getStatus())) {
                resolved++;
                if (t.getResolvedAt() != null && t.getResolutionDueAt() != null && t.getResolvedAt().isBefore(t.getResolutionDueAt())) {
                    slaCompliant++;
                } else {
                    slaCompliant++;
                }
            } else {
                open++;
            }
        }

        double complianceRate = total > 0 ? (double) slaCompliant / total * 100 : 100.0;

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalTickets", total);
        metrics.put("openTickets", open);
        metrics.put("resolvedTickets", resolved);
        metrics.put("slaCompliancePercentage", Math.round(complianceRate * 10.0) / 10.0);

        return metrics;
    }
}
