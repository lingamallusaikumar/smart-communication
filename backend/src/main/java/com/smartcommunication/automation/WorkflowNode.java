package com.smartcommunication.automation;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "workflow_nodes")
public class WorkflowNode {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_id", nullable = false)
    private Workflow workflow;

    @Column(nullable = false)
    private String nodeType; // TRIGGER, CONDITION, ACTION, DELAY

    @Column(columnDefinition = "TEXT")
    private String configJson = "{}";

    private Integer stepOrder = 0;

    public WorkflowNode() {}

    public WorkflowNode(Workflow workflow, String nodeType, String configJson, Integer stepOrder) {
        this.workflow = workflow;
        this.nodeType = nodeType;
        this.configJson = configJson;
        this.stepOrder = stepOrder;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Workflow getWorkflow() { return workflow; }
    public void setWorkflow(Workflow workflow) { this.workflow = workflow; }

    public String getNodeType() { return nodeType; }
    public void setNodeType(String nodeType) { this.nodeType = nodeType; }

    public String getConfigJson() { return configJson; }
    public void setConfigJson(String configJson) { this.configJson = configJson; }

    public Integer getStepOrder() { return stepOrder; }
    public void setStepOrder(Integer stepOrder) { this.stepOrder = stepOrder; }
}
