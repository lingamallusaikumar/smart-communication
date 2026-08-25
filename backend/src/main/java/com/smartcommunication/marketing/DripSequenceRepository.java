package com.smartcommunication.marketing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface DripSequenceRepository extends JpaRepository<DripSequence, UUID> {
    List<DripSequence> findByOrganizationIdOrderByCreatedAtDesc(UUID organizationId);
    List<DripSequence> findByOrganizationIdAndStatus(UUID organizationId, String status);
    long countByOrganizationId(UUID organizationId);
}
