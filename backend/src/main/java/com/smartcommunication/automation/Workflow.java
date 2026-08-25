package com.smartcommunication.automation;

import com.smartcommunication.organization.Organization;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "workflows")
public class Workflow {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(nullable = false)
    private String name;

    private String description;
    private Boolean isActive = true;

    @Column(nullable = false)
    private String triggerType; // LEAD_CREATED, DEAL_STAGE_CHANGED, TICKET_OPENED, MESSAGE_RECEIVED

    @OneToMany(mappedBy = "workflow", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("stepOrder ASC")
    private List<WorkflowNode> nodes = new ArrayList<>();

    private ZonedDateTime createdAt = ZonedDateTime.now();
    private ZonedDateTime updatedAt = ZonedDateTime.now();

    public Workflow() {}

    public Workflow(Organization organization, String name, String triggerType) {
        this.organization = organization;
        this.name = name;
        this.triggerType = triggerType;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getTriggerType() { return triggerType; }
    public void setTriggerType(String triggerType) { this.triggerType = triggerType; }

    public List<WorkflowNode> getNodes() { return nodes; }
    public void setNodes(List<WorkflowNode> nodes) { this.nodes = nodes; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }

    public ZonedDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(ZonedDateTime updatedAt) { this.updatedAt = updatedAt; }
}
