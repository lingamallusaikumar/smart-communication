package com.smartcommunication.leads;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LeadRepository extends JpaRepository<Lead, UUID> {
    List<Lead> findByOrganizationId(UUID organizationId);
    Optional<Lead> findByIdAndOrganizationId(UUID id, UUID organizationId);
}
