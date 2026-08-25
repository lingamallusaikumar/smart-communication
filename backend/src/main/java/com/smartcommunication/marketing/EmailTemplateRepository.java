package com.smartcommunication.marketing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface EmailTemplateRepository extends JpaRepository<EmailTemplate, UUID> {
    List<EmailTemplate> findByOrganizationIdOrderByCreatedAtDesc(UUID organizationId);
    List<EmailTemplate> findByOrganizationIdAndActiveTrue(UUID organizationId);
    List<EmailTemplate> findByOrganizationIdAndCategory(UUID organizationId, String category);
    long countByOrganizationId(UUID organizationId);
}
