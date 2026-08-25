package com.smartcommunication.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    List<User> findByOrganizationId(UUID organizationId);
    boolean existsByEmail(String email);
    long countByOrganizationId(UUID organizationId);
}
