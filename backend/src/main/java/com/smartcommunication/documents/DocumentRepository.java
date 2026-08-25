package com.smartcommunication.documents;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {

    List<Document> findByOrganizationIdOrderByCreatedAtDesc(UUID organizationId);

    List<Document> findByOrganizationIdAndStatus(UUID organizationId, String status);

    List<Document> findByOrganizationIdAndCategory(UUID organizationId, String category);

    List<Document> findByOrganizationIdAndFilenameContainingIgnoreCase(UUID organizationId, String query);

    List<Document> findByOrganizationIdAndTagsContainingIgnoreCase(UUID organizationId, String tag);

    long countByOrganizationId(UUID organizationId);

    long countByOrganizationIdAndStatus(UUID organizationId, String status);

    @Query("SELECT COALESCE(SUM(d.fileSizeBytes), 0) FROM Document d WHERE d.organization.id = :orgId AND d.status = 'ACTIVE'")
    Long sumFileSizeByOrganizationId(@Param("orgId") UUID organizationId);
}
