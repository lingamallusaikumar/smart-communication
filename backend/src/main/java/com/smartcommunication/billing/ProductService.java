package com.smartcommunication.billing;

import com.smartcommunication.organization.Organization;
import com.smartcommunication.organization.OrganizationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final OrganizationRepository organizationRepository;

    public ProductService(ProductRepository productRepository,
                          OrganizationRepository organizationRepository) {
        this.productRepository = productRepository;
        this.organizationRepository = organizationRepository;
    }

    public List<Product> getAllProducts(UUID orgId) {
        return productRepository.findByOrganizationId(orgId);
    }

    public List<Product> getActiveProducts(UUID orgId) {
        return productRepository.findByOrganizationIdAndActiveTrue(orgId);
    }

    public Product getProductById(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public Product createProduct(Product product, UUID orgId) {
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found with id: " + orgId));
        product.setOrganization(org);
        product.setCreatedAt(ZonedDateTime.now());
        product.setUpdatedAt(ZonedDateTime.now());
        return productRepository.save(product);
    }

    public Product updateProduct(UUID id, Product updates) {
        Product existing = getProductById(id);
        if (updates.getName() != null) existing.setName(updates.getName());
        if (updates.getSku() != null) existing.setSku(updates.getSku());
        if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
        if (updates.getUnitPrice() != null) existing.setUnitPrice(updates.getUnitPrice());
        if (updates.getActive() != null) existing.setActive(updates.getActive());
        existing.setUpdatedAt(ZonedDateTime.now());
        return productRepository.save(existing);
    }

    public void deleteProduct(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public List<Product> searchProducts(UUID orgId, String query) {
        List<Product> byName = productRepository.findByOrganizationIdAndNameContainingIgnoreCase(orgId, query);
        List<Product> bySku = productRepository.findByOrganizationIdAndSkuContainingIgnoreCase(orgId, query);
        byName.addAll(bySku);
        return byName.stream().distinct().toList();
    }

    public long countProducts(UUID orgId) {
        return productRepository.countByOrganizationId(orgId);
    }

    public long countActiveProducts(UUID orgId) {
        return productRepository.countByOrganizationIdAndActiveTrue(orgId);
    }

    public BigDecimal getTotalCatalogValue(UUID orgId) {
        return productRepository.sumUnitPriceByOrganizationId(orgId);
    }
}
