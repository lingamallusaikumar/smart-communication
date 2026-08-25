package com.smartcommunication.marketing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, UUID> {
    List<Campaign> findByOrganizationIdOrderByCreatedAtDesc(UUID organizationId);
    List<Campaign> findByOrganizationIdAndStatus(UUID organizationId, String status);
    long countByOrganizationId(UUID organizationId);
    long countByOrganizationIdAndStatus(UUID organizationId, String status);
}
