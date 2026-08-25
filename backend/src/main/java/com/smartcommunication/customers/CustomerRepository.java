package com.smartcommunication.customers;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID> {
    List<Customer> findByOrganizationId(UUID organizationId);
    Optional<Customer> findByIdAndOrganizationId(UUID id, UUID organizationId);
    List<Customer> findByOrganizationIdAndEmailContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            UUID organizationId, String email, String firstName, String lastName);
    long countByOrganizationId(UUID organizationId);
}

