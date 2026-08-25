package com.smartcommunication.communication;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommunicationTemplateRepository extends JpaRepository<CommunicationTemplate, UUID> {
    List<CommunicationTemplate> findByOrganizationId(UUID organizationId);
}
