package com.smartcommunication.marketing;

import com.smartcommunication.organization.Organization;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "drip_sequences")
public class DripSequence {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String status = "DRAFT"; // ACTIVE, PAUSED, DRAFT

    @Column(nullable = false)
    private String triggerEvent = "MANUAL"; // SIGNUP, PURCHASE, ABANDONED_CART, MANUAL

    private int totalEnrolled = 0;
    private int totalCompleted = 0;
    private int totalDropped = 0;

    @OneToMany(mappedBy = "dripSequence", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("stepOrder ASC")
    private List<DripStep> steps = new ArrayList<>();

    private ZonedDateTime createdAt = ZonedDateTime.now();
    private ZonedDateTime updatedAt = ZonedDateTime.now();

    public DripSequence() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTriggerEvent() { return triggerEvent; }
    public void setTriggerEvent(String triggerEvent) { this.triggerEvent = triggerEvent; }

    public int getTotalEnrolled() { return totalEnrolled; }
    public void setTotalEnrolled(int totalEnrolled) { this.totalEnrolled = totalEnrolled; }

    public int getTotalCompleted() { return totalCompleted; }
    public void setTotalCompleted(int totalCompleted) { this.totalCompleted = totalCompleted; }

    public int getTotalDropped() { return totalDropped; }
    public void setTotalDropped(int totalDropped) { this.totalDropped = totalDropped; }

    public List<DripStep> getSteps() { return steps; }
    public void setSteps(List<DripStep> steps) { this.steps = steps; }

    public void addStep(DripStep step) {
        steps.add(step);
        step.setDripSequence(this);
    }

    public void removeStep(DripStep step) {
        steps.remove(step);
        step.setDripSequence(null);
    }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }

    public ZonedDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(ZonedDateTime updatedAt) { this.updatedAt = updatedAt; }
}
