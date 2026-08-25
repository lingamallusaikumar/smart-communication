package com.smartcommunication.customers;

import com.smartcommunication.config.TenantContext;
import com.smartcommunication.organization.Organization;
import com.smartcommunication.organization.OrganizationRepository;
import com.smartcommunication.users.User;
import com.smartcommunication.users.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerNoteRepository customerNoteRepository;
    private final CustomerActivityRepository customerActivityRepository;
    private final CompanyRepository companyRepository;
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;

    public CustomerService(CustomerRepository customerRepository,
                           CustomerNoteRepository customerNoteRepository,
                           CustomerActivityRepository customerActivityRepository,
                           CompanyRepository companyRepository,
                           OrganizationRepository organizationRepository,
                           UserRepository userRepository) {
        this.customerRepository = customerRepository;
        this.customerNoteRepository = customerNoteRepository;
        this.customerActivityRepository = customerActivityRepository;
        this.companyRepository = companyRepository;
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
    }

    public List<Customer> getAllCustomers() {
        UUID tenantId = TenantContext.getCurrentTenant();
        return customerRepository.findByOrganizationId(tenantId);
    }

    public Customer getCustomerById(UUID id) {
        UUID tenantId = TenantContext.getCurrentTenant();
        return customerRepository.findByIdAndOrganizationId(id, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
    }

    @Transactional
    public Customer createCustomer(Customer customer, UUID companyId, User currentUser) {
        UUID tenantId = TenantContext.getCurrentTenant();
        Organization org = organizationRepository.findById(tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        customer.setOrganization(org);

        if (companyId != null) {
            Company company = companyRepository.findByIdAndOrganizationId(companyId, tenantId).orElse(null);
            customer.setCompany(company);
        }

        Customer savedCustomer = customerRepository.save(customer);

        // Record Initial Activity on 360 Timeline
        CustomerActivity activity = new CustomerActivity(
                org, savedCustomer, currentUser,
                "CUSTOMER_CREATED",
                "Customer Profile Created",
                "Customer " + customer.getFirstName() + " " + customer.getLastName() + " was added to CRM."
        );
        customerActivityRepository.save(activity);

        return savedCustomer;
    }

    public List<CustomerNote> getCustomerNotes(UUID customerId) {
        return customerNoteRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    @Transactional
    public CustomerNote addCustomerNote(UUID customerId, String content, User currentUser) {
        Customer customer = getCustomerById(customerId);
        CustomerNote note = new CustomerNote(customer, currentUser, content);
        CustomerNote savedNote = customerNoteRepository.save(note);

        CustomerActivity activity = new CustomerActivity(
                customer.getOrganization(), customer, currentUser,
                "NOTE_ADDED",
                "Note Added",
                content
        );
        customerActivityRepository.save(activity);

        return savedNote;
    }

    public List<CustomerActivity> getCustomerTimeline(UUID customerId) {
        return customerActivityRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }
}
