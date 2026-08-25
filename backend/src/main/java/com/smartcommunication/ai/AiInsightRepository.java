package com.smartcommunication.ai;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AiInsightRepository extends JpaRepository<AiInsight, UUID> {
    List<AiInsight> findByOrganizationIdOrderByCreatedAtDesc(UUID organizationId);
    List<AiInsight> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);
}
