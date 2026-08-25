package com.smartcommunication.billing;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/billing/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(@RequestParam UUID orgId) {
        return ResponseEntity.ok(productService.getAllProducts(orgId));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Product>> getActiveProducts(@RequestParam UUID orgId) {
        return ResponseEntity.ok(productService.getActiveProducts(orgId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product, @RequestParam UUID orgId) {
        return ResponseEntity.ok(productService.createProduct(product, orgId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable UUID id, @RequestBody Product updates) {
        return ResponseEntity.ok(productService.updateProduct(id, updates));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam UUID orgId, @RequestParam String q) {
        return ResponseEntity.ok(productService.searchProducts(orgId, q));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getProductStats(@RequestParam UUID orgId) {
        Map<String, Object> stats = Map.of(
                "totalProducts", productService.countProducts(orgId),
                "activeProducts", productService.countActiveProducts(orgId),
                "totalCatalogValue", productService.getTotalCatalogValue(orgId)
        );
        return ResponseEntity.ok(stats);
    }
}
