package com.smartcommunication.billing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    List<Product> findByOrganizationId(UUID organizationId);

    List<Product> findByOrganizationIdAndActiveTrue(UUID organizationId);

    List<Product> findByOrganizationIdAndNameContainingIgnoreCase(UUID organizationId, String name);

    List<Product> findByOrganizationIdAndSkuContainingIgnoreCase(UUID organizationId, String sku);

    Optional<Product> findByOrganizationIdAndSku(UUID organizationId, String sku);

    long countByOrganizationId(UUID organizationId);

    long countByOrganizationIdAndActiveTrue(UUID organizationId);

    @Query("SELECT COALESCE(SUM(p.unitPrice), 0) FROM Product p WHERE p.organization.id = :orgId AND p.active = true")
    java.math.BigDecimal sumUnitPriceByOrganizationId(@Param("orgId") UUID organizationId);
}
