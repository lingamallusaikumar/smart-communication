package com.smartcommunication.tasks;

import com.smartcommunication.customers.Customer;
import com.smartcommunication.deals.Deal;
import com.smartcommunication.organization.Organization;
import com.smartcommunication.users.User;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "tasks")
public class TaskItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "deal_id")
    private Deal deal;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, URGENT

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, IN_PROGRESS, COMPLETED, CANCELLED

    private ZonedDateTime dueDate;
    private ZonedDateTime completedAt;

    private ZonedDateTime createdAt = ZonedDateTime.now();
    private ZonedDateTime updatedAt = ZonedDateTime.now();

    public TaskItem() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }

    public User getAssignedUser() { return assignedUser; }
    public void setAssignedUser(User assignedUser) { this.assignedUser = assignedUser; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public Deal getDeal() { return deal; }
    public void setDeal(Deal deal) { this.deal = deal; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public ZonedDateTime getDueDate() { return dueDate; }
    public void setDueDate(ZonedDateTime dueDate) { this.dueDate = dueDate; }

    public ZonedDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(ZonedDateTime completedAt) { this.completedAt = completedAt; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }

    public ZonedDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(ZonedDateTime updatedAt) { this.updatedAt = updatedAt; }
}
