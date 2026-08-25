package com.smartcommunication.deals;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DealRepository extends JpaRepository<Deal, UUID> {
    List<Deal> findByOrganizationId(UUID organizationId);
    List<Deal> findByPipelineId(UUID pipelineId);
    Optional<Deal> findByIdAndOrganizationId(UUID id, UUID organizationId);

    long countByOrganizationId(UUID organizationId);
    long countByOrganizationIdAndStatus(UUID organizationId, String status);
    long countByOrganizationIdAndOwnerId(UUID organizationId, UUID ownerId);
    long countByOrganizationIdAndOwnerIdAndStatus(UUID organizationId, UUID ownerId, String status);
    long countByOrganizationIdAndStageId(UUID organizationId, UUID stageId);

    @Query("SELECT COALESCE(SUM(d.value), 0) FROM Deal d WHERE d.organization.id = :orgId AND d.status = :status")
    BigDecimal sumValueByOrganizationIdAndStatus(@Param("orgId") UUID organizationId, @Param("status") String status);

    @Query("SELECT COALESCE(SUM(d.value), 0) FROM Deal d WHERE d.organization.id = :orgId AND d.owner.id = :ownerId AND d.status = :status")
    BigDecimal sumValueByOrganizationIdAndOwnerIdAndStatus(@Param("orgId") UUID organizationId, @Param("ownerId") UUID ownerId, @Param("status") String status);

    @Query("SELECT COALESCE(SUM(d.value), 0) FROM Deal d WHERE d.organization.id = :orgId AND d.stage.id = :stageId")
    BigDecimal sumValueByOrganizationIdAndStageId(@Param("orgId") UUID organizationId, @Param("stageId") UUID stageId);
}
