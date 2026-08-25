package com.smartcommunication.marketing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CampaignRecipientRepository extends JpaRepository<CampaignRecipient, UUID> {
    List<CampaignRecipient> findByCampaignId(UUID campaignId);
    List<CampaignRecipient> findByCampaignIdAndStatus(UUID campaignId, String status);
    long countByCampaignId(UUID campaignId);
    long countByCampaignIdAndStatus(UUID campaignId, String status);
}
