package com.smartcommunication.customers;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CustomerActivityRepository extends JpaRepository<CustomerActivity, UUID> {
    List<CustomerActivity> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);
    List<CustomerActivity> findByOrganizationIdOrderByCreatedAtDesc(UUID organizationId);
}
