package com.smartcommunication.communication;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    List<Conversation> findByOrganizationIdOrderByLastMessageAtDesc(UUID organizationId);
    List<Conversation> findByOrganizationIdAndChannelTypeOrderByLastMessageAtDesc(UUID organizationId, String channelType);
    Optional<Conversation> findByIdAndOrganizationId(UUID id, UUID organizationId);
}
