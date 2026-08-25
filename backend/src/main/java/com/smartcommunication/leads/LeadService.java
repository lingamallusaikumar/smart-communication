package com.smartcommunication.leads;

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

import java.util.List;
import java.util.UUID;

@Service
public class LeadService {

    private final LeadRepository leadRepository;
    private final CustomerRepository customerRepository;
    private final CustomerActivityRepository customerActivityRepository;
    private final OrganizationRepository organizationRepository;

    public LeadService(LeadRepository leadRepository,
                       CustomerRepository customerRepository,
                       CustomerActivityRepository customerActivityRepository,
                       OrganizationRepository organizationRepository) {
        this.leadRepository = leadRepository;
        this.customerRepository = customerRepository;
        this.customerActivityRepository = customerActivityRepository;
        this.organizationRepository = organizationRepository;
    }

    public List<Lead> getAllLeads() {
        UUID tenantId = TenantContext.getCurrentTenant();
        return leadRepository.findByOrganizationId(tenantId);
    }

    public Lead getLeadById(UUID id) {
        UUID tenantId = TenantContext.getCurrentTenant();
        return leadRepository.findByIdAndOrganizationId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found"));
    }

    @Transactional
    public Lead createLead(Lead lead, User currentUser) {
        UUID tenantId = TenantContext.getCurrentTenant();
        Organization org = organizationRepository.findById(tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        lead.setOrganization(org);
        if (lead.getAssignedUser() == null) {
            lead.setAssignedUser(currentUser);
        }
        return leadRepository.save(lead);
    }

    @Transactional
    public Lead updateLeadStatus(UUID leadId, String newStatus) {
        Lead lead = getLeadById(leadId);
        lead.setStatus(newStatus);
        return leadRepository.save(lead);
    }

    @Transactional
    public Customer convertLeadToCustomer(UUID leadId, User currentUser) {
        Lead lead = getLeadById(leadId);

        if ("CONVERTED".equalsIgnoreCase(lead.getStatus())) {
            throw new IllegalStateException("Lead is already converted");
        }

        // Create Customer from Lead
        Customer customer = new Customer();
        customer.setOrganization(lead.getOrganization());
        customer.setFirstName(lead.getFirstName());
        customer.setLastName(lead.getLastName());
        customer.setEmail(lead.getEmail());
        customer.setPhoneNumber(lead.getPhone());
        customer.setAssignedOwner(lead.getAssignedUser() != null ? lead.getAssignedUser() : currentUser);
        Customer savedCustomer = customerRepository.save(customer);

        // Update Lead status
        lead.setStatus("CONVERTED");
        lead.setConvertedCustomer(savedCustomer);
        leadRepository.save(lead);

        // Record Activity on 360 Timeline
        CustomerActivity activity = new CustomerActivity(
                lead.getOrganization(), savedCustomer, currentUser,
                "LEAD_CONVERTED",
                "Lead Converted to Customer",
                "Lead from " + lead.getCompanyName() + " was successfully qualified and converted to active customer."
        );
        customerActivityRepository.save(activity);

        return savedCustomer;
    }
}
