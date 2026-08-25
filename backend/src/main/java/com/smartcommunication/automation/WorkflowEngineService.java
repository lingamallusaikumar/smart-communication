package com.smartcommunication.automation;

import com.smartcommunication.config.TenantContext;
import com.smartcommunication.organization.Organization;
import com.smartcommunication.organization.OrganizationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class WorkflowEngineService {

    private final WorkflowRepository workflowRepository;
    private final WorkflowNodeRepository nodeRepository;
    private final OrganizationRepository organizationRepository;

    public WorkflowEngineService(WorkflowRepository workflowRepository,
                                  WorkflowNodeRepository nodeRepository,
                                  OrganizationRepository organizationRepository) {
        this.workflowRepository = workflowRepository;
        this.nodeRepository = nodeRepository;
        this.organizationRepository = organizationRepository;
    }

    public List<Workflow> getWorkflows() {
        UUID tenantId = TenantContext.getCurrentTenant();
        List<Workflow> list = workflowRepository.findByOrganizationId(tenantId);
        if (list.isEmpty()) {
            Organization org = organizationRepository.findById(tenantId).orElse(null);
            if (org != null) {
                return List.of(createDefaultWorkflow(org));
            }
        }
        return list;
    }

    @Transactional
    public Workflow createDefaultWorkflow(Organization org) {
        Workflow wf = new Workflow(org, "Automated Lead Welcome & Sales Follow-Up", "LEAD_CREATED");
        wf.setDescription("Triggers when a new lead is added. Assigns sales rep, sends welcome email, and schedules follow-up task.");
        wf = workflowRepository.save(wf);

        List<WorkflowNode> nodes = List.of(
                new WorkflowNode(wf, "TRIGGER", "{\"event\":\"NEW_LEAD_CREATED\"}", 1),
                new WorkflowNode(wf, "ACTION", "{\"action\":\"ASSIGN_SALES_REP\"}", 2),
                new WorkflowNode(wf, "ACTION", "{\"action\":\"SEND_WELCOME_EMAIL\"}", 3),
                new WorkflowNode(wf, "DELAY", "{\"duration\":\"2_DAYS\"}", 4),
                new WorkflowNode(wf, "CONDITION", "{\"check\":\"HAS_LEAD_RESPONDED\"}", 5),
                new WorkflowNode(wf, "ACTION", "{\"action\":\"CREATE_FOLLOWUP_TASK\"}", 6)
        );
        nodeRepository.saveAll(nodes);
        wf.setNodes(nodes);
        return wf;
    }

    @Transactional
    public Workflow createWorkflow(Workflow workflow, List<WorkflowNode> nodes) {
        UUID tenantId = TenantContext.getCurrentTenant();
        Organization org = organizationRepository.findById(tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        workflow.setOrganization(org);
        Workflow savedWorkflow = workflowRepository.save(workflow);

        if (nodes != null && !nodes.isEmpty()) {
            int order = 1;
            for (WorkflowNode node : nodes) {
                node.setWorkflow(savedWorkflow);
                node.setStepOrder(order++);
            }
            nodeRepository.saveAll(nodes);
            savedWorkflow.setNodes(nodes);
        }

        return savedWorkflow;
    }

    public void triggerEvent(String triggerType, Map<String, Object> context) {
        UUID tenantId = TenantContext.getCurrentTenant();
        if (tenantId == null) return;

        List<Workflow> matching = workflowRepository.findByOrganizationIdAndTriggerTypeAndIsActiveTrue(tenantId, triggerType);
        for (Workflow wf : matching) {
            // Execute step nodes sequentially
            System.out.println("[WORKFLOW ENGINE] Executing workflow: " + wf.getName() + " for event: " + triggerType);
        }
    }
}
