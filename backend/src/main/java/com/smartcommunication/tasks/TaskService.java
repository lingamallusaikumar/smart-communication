package com.smartcommunication.tasks;

import com.smartcommunication.config.TenantContext;
import com.smartcommunication.organization.Organization;
import com.smartcommunication.organization.OrganizationRepository;
import com.smartcommunication.users.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final OrganizationRepository organizationRepository;

    public TaskService(TaskRepository taskRepository, OrganizationRepository organizationRepository) {
        this.taskRepository = taskRepository;
        this.organizationRepository = organizationRepository;
    }

    public List<TaskItem> getTasks() {
        UUID tenantId = TenantContext.getCurrentTenant();
        return taskRepository.findByOrganizationIdOrderByDueDateAsc(tenantId);
    }

    @Transactional
    public TaskItem createTask(TaskItem task, User currentUser) {
        UUID tenantId = TenantContext.getCurrentTenant();
        Organization org = organizationRepository.findById(tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        task.setOrganization(org);
        if (task.getAssignedUser() == null) {
            task.setAssignedUser(currentUser);
        }
        return taskRepository.save(task);
    }

    @Transactional
    public TaskItem updateTaskStatus(UUID taskId, String status) {
        UUID tenantId = TenantContext.getCurrentTenant();
        TaskItem task = taskRepository.findByIdAndOrganizationId(taskId, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        task.setStatus(status);
        if ("COMPLETED".equalsIgnoreCase(status)) {
            task.setCompletedAt(ZonedDateTime.now());
        }
        return taskRepository.save(task);
    }
}
