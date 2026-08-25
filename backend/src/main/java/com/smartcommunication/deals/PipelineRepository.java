package com.smartcommunication.deals;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PipelineRepository extends JpaRepository<Pipeline, UUID> {
    List<Pipeline> findByOrganizationId(UUID organizationId);
    Optional<Pipeline> findByOrganizationIdAndIsDefaultTrue(UUID organizationId);
}
