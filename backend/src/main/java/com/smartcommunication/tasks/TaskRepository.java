package com.smartcommunication.tasks;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<TaskItem, UUID> {
    List<TaskItem> findByOrganizationIdOrderByDueDateAsc(UUID organizationId);
    Optional<TaskItem> findByIdAndOrganizationId(UUID id, UUID organizationId);
}
