package com.smartcommunication.integration;

import com.smartcommunication.customers.Customer;
import com.smartcommunication.customers.CustomerRepository;
import com.smartcommunication.organization.Organization;
import com.smartcommunication.organization.OrganizationRepository;
import com.smartcommunication.support.SupportService;
import com.smartcommunication.support.SupportTicket;
import com.smartcommunication.support.TicketComment;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
public class SupportServiceIntegrationTest {

    @Autowired
    private SupportService supportService;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private CustomerRepository customerRepository;

    private Organization org;
    private Customer customer;

    @BeforeEach
    void setup() {
        org = new Organization();
        org.setName("Test Org");
        org.setSlug("test-org");
        org = organizationRepository.save(org);

        customer = new Customer();
        customer.setOrganization(org);
        customer.setFirstName("John");
        customer.setLastName("Doe");
        customer.setEmail("john@test.com");
        customer.setStatus("ACTIVE");
        customer = customerRepository.save(customer);
    }

    @Test
    void testCreateTicket() {
        SupportTicket ticket = new SupportTicket();
        ticket.setSubject("Test Issue");
        ticket.setDescription("This is a test description.");

        SupportTicket created = supportService.createTicket(ticket, org.getId(), customer.getId(), null);

        assertNotNull(created.getId());
        assertEquals("Test Issue", created.getSubject());
        assertEquals("OPEN", created.getStatus());
        assertTrue(created.getTicketNumber().startsWith("TCK-"));
    }

    @Test
    void testUpdateTicketStatus() {
        SupportTicket ticket = new SupportTicket();
        ticket.setSubject("Test Issue 2");
        ticket.setDescription("This is a test description 2.");
        SupportTicket created = supportService.createTicket(ticket, org.getId(), customer.getId(), null);

        SupportTicket updated = supportService.updateTicketStatus(created.getId(), "RESOLVED");

        assertEquals("RESOLVED", updated.getStatus());
        assertNotNull(updated.getResolvedAt());
    }

    @Test
    void testAddComment() {
        SupportTicket ticket = new SupportTicket();
        ticket.setSubject("Test Issue 3");
        ticket.setDescription("This is a test description 3.");
        SupportTicket created = supportService.createTicket(ticket, org.getId(), customer.getId(), null);

        TicketComment comment = new TicketComment();
        comment.setContent("We are looking into this.");
        comment.setInternal(false);

        TicketComment saved = supportService.addComment(created.getId(), comment, null);

        assertNotNull(saved.getId());
        assertEquals("We are looking into this.", saved.getContent());

        SupportTicket fetched = supportService.getTicketById(created.getId());
        assertEquals(1, fetched.getComments().size());
    }
}
