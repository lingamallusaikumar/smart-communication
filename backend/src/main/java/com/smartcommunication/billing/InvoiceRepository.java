package com.smartcommunication.billing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {

    List<Invoice> findByOrganizationIdOrderByCreatedAtDesc(UUID organizationId);

    List<Invoice> findByOrganizationIdAndStatus(UUID organizationId, String status);

    List<Invoice> findByOrganizationIdAndCustomerId(UUID organizationId, UUID customerId);

    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    long countByOrganizationId(UUID organizationId);

    long countByOrganizationIdAndStatus(UUID organizationId, String status);

    @Query("SELECT COALESCE(SUM(i.grandTotal), 0) FROM Invoice i WHERE i.organization.id = :orgId AND i.status = :status")
    BigDecimal sumGrandTotalByOrganizationIdAndStatus(@Param("orgId") UUID organizationId, @Param("status") String status);

    @Query("SELECT COALESCE(SUM(i.grandTotal), 0) FROM Invoice i WHERE i.organization.id = :orgId")
    BigDecimal sumGrandTotalByOrganizationId(@Param("orgId") UUID organizationId);
}
