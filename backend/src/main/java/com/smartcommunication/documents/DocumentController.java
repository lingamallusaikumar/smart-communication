package com.smartcommunication.documents;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public ResponseEntity<List<Document>> getAllDocuments(@RequestParam UUID orgId) {
        return ResponseEntity.ok(documentService.getActiveDocuments(orgId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable UUID id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }

    @PostMapping("/upload")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam UUID orgId,
            @RequestParam(required = false) UUID userId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String tags) {
        return ResponseEntity.ok(documentService.uploadDocument(file, orgId, userId, category, description, tags));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Document> updateDocument(@PathVariable UUID id,
                                                   @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(documentService.updateDocument(id, body.get("category"), body.get("description"), body.get("tags")));
    }

    @PostMapping("/{id}/archive")
    public ResponseEntity<Void> archiveDocument(@PathVariable UUID id) {
        documentService.archiveDocument(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable UUID id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Document>> searchDocuments(@RequestParam UUID orgId, @RequestParam String q) {
        return ResponseEntity.ok(documentService.searchDocuments(orgId, q));
    }

    @GetMapping("/by-category")
    public ResponseEntity<List<Document>> getDocumentsByCategory(@RequestParam UUID orgId, @RequestParam String category) {
        return ResponseEntity.ok(documentService.getDocumentsByCategory(orgId, category));
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<DocumentShareLink> createShareLink(
            @PathVariable UUID id,
            @RequestParam(required = false) UUID userId,
            @RequestParam(required = false) String expiresAt,
            @RequestParam(required = false) String password) {
        ZonedDateTime expiry = expiresAt != null ? ZonedDateTime.parse(expiresAt) : null;
        return ResponseEntity.ok(documentService.createShareLink(id, userId, expiry, password));
    }

    @GetMapping("/shared/{token}")
    public ResponseEntity<Document> getByShareToken(@PathVariable String token) {
        return ResponseEntity.ok(documentService.getDocumentByShareToken(token));
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getDocumentMetrics(@RequestParam UUID orgId) {
        return ResponseEntity.ok(documentService.getDocumentMetrics(orgId));
    }
}
