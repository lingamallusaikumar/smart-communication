package com.smartcommunication.support;

import com.smartcommunication.customers.Customer;
import com.smartcommunication.customers.CustomerRepository;
import com.smartcommunication.organization.Organization;
import com.smartcommunication.organization.OrganizationRepository;
import com.smartcommunication.users.User;
import com.smartcommunication.users.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@Transactional
public class SupportService {

    private final SupportTicketRepository ticketRepository;
    private final TicketCommentRepository commentRepository;
    private final OrganizationRepository organizationRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    
    // Simulate a sequence for ticket numbers
    private static final AtomicInteger ticketCounter = new AtomicInteger(1000);

    public SupportService(SupportTicketRepository ticketRepository,
                          TicketCommentRepository commentRepository,
                          OrganizationRepository organizationRepository,
                          CustomerRepository customerRepository,
                          UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.commentRepository = commentRepository;
        this.organizationRepository = organizationRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }

    public List<SupportTicket> getAllTickets(UUID orgId) {
        return ticketRepository.findByOrganizationIdOrderByUpdatedAtDesc(orgId);
    }

    public SupportTicket getTicketById(UUID id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public SupportTicket createTicket(SupportTicket ticket, UUID orgId, UUID customerId, UUID assignedToId) {
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        ticket.setOrganization(org);
        ticket.setCustomer(customer);
        ticket.setTicketNumber("TCK-" + ticketCounter.getAndIncrement());
        
        if (assignedToId != null) {
            User user = userRepository.findById(assignedToId).orElse(null);
            ticket.setAssignedTo(user);
        }
        
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(ZonedDateTime.now());
        ticket.setUpdatedAt(ZonedDateTime.now());
        
        return ticketRepository.save(ticket);
    }

    public SupportTicket updateTicket(UUID id, SupportTicket updates, UUID assignedToId) {
        SupportTicket existing = getTicketById(id);
        
        if (updates.getSubject() != null) existing.setSubject(updates.getSubject());
        if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
        if (updates.getPriority() != null) existing.setPriority(updates.getPriority());
        if (updates.getCategory() != null) existing.setCategory(updates.getCategory());
        
        if (assignedToId != null) {
            User user = userRepository.findById(assignedToId).orElse(null);
            existing.setAssignedTo(user);
        }

        existing.setUpdatedAt(ZonedDateTime.now());
        return ticketRepository.save(existing);
    }

    public SupportTicket updateTicketStatus(UUID id, String status) {
        SupportTicket existing = getTicketById(id);
        existing.setStatus(status);
        
        if ("RESOLVED".equals(status) && existing.getResolvedAt() == null) {
            existing.setResolvedAt(ZonedDateTime.now());
        }
        if ("CLOSED".equals(status) && existing.getClosedAt() == null) {
            existing.setClosedAt(ZonedDateTime.now());
            if (existing.getResolvedAt() == null) {
                existing.setResolvedAt(ZonedDateTime.now());
            }
        }
        
        existing.setUpdatedAt(ZonedDateTime.now());
        return ticketRepository.save(existing);
    }

    public TicketComment addComment(UUID ticketId, TicketComment comment, UUID authorId) {
        SupportTicket ticket = getTicketById(ticketId);
        
        if (authorId != null) {
            User author = userRepository.findById(authorId).orElse(null);
            comment.setAuthor(author);
            
            // Auto-assign first responder if not assigned
            if (ticket.getAssignedTo() == null && !comment.isInternal() && author != null) {
                ticket.setAssignedTo(author);
            }
            
            // Set first response time
            if (ticket.getFirstResponseAt() == null && !comment.isInternal() && author != null) {
                ticket.setFirstResponseAt(ZonedDateTime.now());
            }
        }
        
        comment.setCreatedAt(ZonedDateTime.now());
        ticket.addComment(comment);
        ticket.setUpdatedAt(ZonedDateTime.now());
        
        ticketRepository.save(ticket);
        return comment;
    }

    public void deleteTicket(UUID id) {
        ticketRepository.deleteById(id);
    }

    public List<SupportTicket> getTicketsByStatus(UUID orgId, String status) {
        return ticketRepository.findByOrganizationIdAndStatusOrderByUpdatedAtDesc(orgId, status);
    }
    
    public List<SupportTicket> getTicketsByAssignee(UUID orgId, UUID assigneeId) {
        return ticketRepository.findByOrganizationIdAndAssignedToIdOrderByUpdatedAtDesc(orgId, assigneeId);
    }

    public Map<String, Object> getSupportMetrics(UUID orgId) {
        Map<String, Object> metrics = new LinkedHashMap<>();
        
        metrics.put("totalTickets", ticketRepository.countByOrganizationId(orgId));
        metrics.put("openTickets", ticketRepository.countByOrganizationIdAndStatus(orgId, "OPEN"));
        metrics.put("inProgressTickets", ticketRepository.countByOrganizationIdAndStatus(orgId, "IN_PROGRESS"));
        metrics.put("resolvedTickets", ticketRepository.countByOrganizationIdAndStatus(orgId, "RESOLVED"));
        
        // Active tickets is OPEN + IN_PROGRESS + PENDING_CUSTOMER
        long active = ticketRepository.countByOrganizationIdAndStatus(orgId, "OPEN") +
                      ticketRepository.countByOrganizationIdAndStatus(orgId, "IN_PROGRESS") + 
                      ticketRepository.countByOrganizationIdAndStatus(orgId, "PENDING_CUSTOMER");
        metrics.put("activeTickets", active);
        
        return metrics;
    }
}
