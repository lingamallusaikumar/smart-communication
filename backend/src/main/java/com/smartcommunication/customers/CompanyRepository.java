package com.smartcommunication.customers;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID> {
    List<Company> findByOrganizationId(UUID organizationId);
    Optional<Company> findByIdAndOrganizationId(UUID id, UUID organizationId);
}
