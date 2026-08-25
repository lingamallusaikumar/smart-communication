package com.smartcommunication.deals;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DealRepository extends JpaRepository<Deal, UUID> {
    List<Deal> findByOrganizationId(UUID organizationId);
    List<Deal> findByPipelineId(UUID pipelineId);
    Optional<Deal> findByIdAndOrganizationId(UUID id, UUID organizationId);
}
