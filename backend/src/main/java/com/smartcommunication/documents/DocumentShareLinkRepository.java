package com.smartcommunication.documents;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DocumentShareLinkRepository extends JpaRepository<DocumentShareLink, UUID> {
    Optional<DocumentShareLink> findByShareToken(String shareToken);
    long countByDocumentId(UUID documentId);
}
