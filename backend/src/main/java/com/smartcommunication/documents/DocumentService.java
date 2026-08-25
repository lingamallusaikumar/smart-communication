package com.smartcommunication.documents;

import com.smartcommunication.organization.Organization;
import com.smartcommunication.organization.OrganizationRepository;
import com.smartcommunication.users.User;
import com.smartcommunication.users.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.ZonedDateTime;
import java.util.*;

@Service
@Transactional
public class DocumentService {

    private static final String UPLOAD_DIR = "uploads/documents";

    private final DocumentRepository documentRepository;
    private final DocumentShareLinkRepository shareLinkRepository;
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;

    public DocumentService(DocumentRepository documentRepository,
                           DocumentShareLinkRepository shareLinkRepository,
                           OrganizationRepository organizationRepository,
                           UserRepository userRepository) {
        this.documentRepository = documentRepository;
        this.shareLinkRepository = shareLinkRepository;
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
    }

    public List<Document> getAllDocuments(UUID orgId) {
        return documentRepository.findByOrganizationIdOrderByCreatedAtDesc(orgId);
    }

    public List<Document> getActiveDocuments(UUID orgId) {
        return documentRepository.findByOrganizationIdAndStatus(orgId, "ACTIVE");
    }

    public Document getDocumentById(UUID id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
    }

    public Document uploadDocument(MultipartFile file, UUID orgId, UUID userId,
                                   String category, String description, String tags) {
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found: " + orgId));

        String originalFilename = file.getOriginalFilename();
        String ext = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String storageFilename = UUID.randomUUID() + ext;
        String storageKey = UPLOAD_DIR + "/" + orgId + "/" + storageFilename;

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR, orgId.toString());
            Files.createDirectories(uploadPath);
            Path targetPath = uploadPath.resolve(storageFilename);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }

        Document doc = new Document();
        doc.setOrganization(org);
        doc.setFilename(storageFilename);
        doc.setOriginalFilename(originalFilename);
        doc.setContentType(file.getContentType());
        doc.setFileSizeBytes(file.getSize());
        doc.setStorageKey(storageKey);
        doc.setStorageProvider("LOCAL");
        doc.setCategory(category);
        doc.setDescription(description);
        doc.setTags(tags);
        doc.setStatus("ACTIVE");
        doc.setCreatedAt(ZonedDateTime.now());
        doc.setUpdatedAt(ZonedDateTime.now());

        if (userId != null) {
            userRepository.findById(userId).ifPresent(doc::setUploadedBy);
        }

        return documentRepository.save(doc);
    }

    public Document updateDocument(UUID id, String category, String description, String tags) {
        Document doc = getDocumentById(id);
        if (category != null) doc.setCategory(category);
        if (description != null) doc.setDescription(description);
        if (tags != null) doc.setTags(tags);
        doc.setUpdatedAt(ZonedDateTime.now());
        return documentRepository.save(doc);
    }

    public void archiveDocument(UUID id) {
        Document doc = getDocumentById(id);
        doc.setStatus("ARCHIVED");
        doc.setUpdatedAt(ZonedDateTime.now());
        documentRepository.save(doc);
    }

    public void deleteDocument(UUID id) {
        Document doc = getDocumentById(id);
        doc.setStatus("DELETED");
        doc.setUpdatedAt(ZonedDateTime.now());
        documentRepository.save(doc);
    }

    public List<Document> searchDocuments(UUID orgId, String query) {
        if (query == null || query.isBlank()) return getAllDocuments(orgId);
        List<Document> byName = documentRepository.findByOrganizationIdAndFilenameContainingIgnoreCase(orgId, query);
        List<Document> byTag = documentRepository.findByOrganizationIdAndTagsContainingIgnoreCase(orgId, query);
        Set<UUID> seen = new HashSet<>();
        List<Document> results = new ArrayList<>();
        for (Document d : byName) { if (seen.add(d.getId())) results.add(d); }
        for (Document d : byTag) { if (seen.add(d.getId())) results.add(d); }
        return results;
    }

    public List<Document> getDocumentsByCategory(UUID orgId, String category) {
        return documentRepository.findByOrganizationIdAndCategory(orgId, category);
    }

    public DocumentShareLink createShareLink(UUID documentId, UUID userId, ZonedDateTime expiresAt, String password) {
        Document document = getDocumentById(documentId);
        DocumentShareLink link = new DocumentShareLink();
        link.setDocument(document);
        link.setShareToken(UUID.randomUUID().toString().replace("-", ""));
        link.setExpiresAt(expiresAt);
        link.setPassword(password);
        link.setCreatedAt(ZonedDateTime.now());
        if (userId != null) {
            userRepository.findById(userId).ifPresent(link::setCreatedBy);
        }
        return shareLinkRepository.save(link);
    }

    public Document getDocumentByShareToken(String token) {
        DocumentShareLink link = shareLinkRepository.findByShareToken(token)
                .orElseThrow(() -> new RuntimeException("Share link not found or expired"));
        if (!link.isActive()) throw new RuntimeException("Share link is no longer active");
        if (link.getExpiresAt() != null && ZonedDateTime.now().isAfter(link.getExpiresAt())) {
            throw new RuntimeException("Share link has expired");
        }
        link.setAccessCount(link.getAccessCount() + 1);
        shareLinkRepository.save(link);
        Document doc = link.getDocument();
        doc.setDownloadCount(doc.getDownloadCount() + 1);
        return documentRepository.save(doc);
    }

    public Map<String, Object> getDocumentMetrics(UUID orgId) {
        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("totalDocuments", documentRepository.countByOrganizationId(orgId));
        metrics.put("activeDocuments", documentRepository.countByOrganizationIdAndStatus(orgId, "ACTIVE"));
        metrics.put("archivedDocuments", documentRepository.countByOrganizationIdAndStatus(orgId, "ARCHIVED"));
        Long totalSizeBytes = documentRepository.sumFileSizeByOrganizationId(orgId);
        metrics.put("totalStorageBytes", totalSizeBytes != null ? totalSizeBytes : 0L);
        metrics.put("totalStorageMB", totalSizeBytes != null ? Math.round(totalSizeBytes / 1024.0 / 1024.0 * 100.0) / 100.0 : 0.0);
        return metrics;
    }
}
