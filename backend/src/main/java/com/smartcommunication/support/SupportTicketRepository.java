package com.smartcommunication.support;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, UUID> {
    List<SupportTicket> findByOrganizationIdOrderByUpdatedAtDesc(UUID organizationId);
    List<SupportTicket> findByOrganizationIdAndStatusOrderByUpdatedAtDesc(UUID organizationId, String status);
    List<SupportTicket> findByOrganizationIdAndAssignedToIdOrderByUpdatedAtDesc(UUID organizationId, UUID assignedToId);
    List<SupportTicket> findByOrganizationIdAndCustomerIdOrderByUpdatedAtDesc(UUID organizationId, UUID customerId);
    long countByOrganizationId(UUID organizationId);
    long countByOrganizationIdAndStatus(UUID organizationId, String status);
}
