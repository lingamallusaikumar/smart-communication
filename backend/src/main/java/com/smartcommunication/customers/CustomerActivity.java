package com.smartcommunication.customers;

import com.smartcommunication.organization.Organization;
import com.smartcommunication.users.User;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "customer_activities")
public class CustomerActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "actor_id")
    private User actor;

    @Column(nullable = false)
    private String activityType; // EMAIL_SENT, CALL_COMPLETED, MEETING, WHATSAPP_SENT, DEAL_CREATED, SUPPORT_TICKET, LEAD_CONVERTED

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private ZonedDateTime createdAt = ZonedDateTime.now();

    public CustomerActivity() {}

    public CustomerActivity(Organization organization, Customer customer, User actor, String activityType, String title, String description) {
        this.organization = organization;
        this.customer = customer;
        this.actor = actor;
        this.activityType = activityType;
        this.title = title;
        this.description = description;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public User getActor() { return actor; }
    public void setActor(User actor) { this.actor = actor; }

    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}
