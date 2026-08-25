package com.smartcommunication.automation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/workflows")
public class WorkflowController {

    private final WorkflowEngineService workflowEngineService;

    public WorkflowController(WorkflowEngineService workflowEngineService) {
        this.workflowEngineService = workflowEngineService;
    }

    @GetMapping
    public ResponseEntity<List<Workflow>> getWorkflows() {
        return ResponseEntity.ok(workflowEngineService.getWorkflows());
    }

    @PostMapping
    public ResponseEntity<Workflow> createWorkflow(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        String triggerType = (String) body.get("triggerType");
        String description = (String) body.get("description");

        Workflow wf = new Workflow();
        wf.setName(name);
        wf.setTriggerType(triggerType);
        wf.setDescription(description);

        return ResponseEntity.ok(workflowEngineService.createWorkflow(wf, List.of()));
    }

    @PostMapping("/trigger")
    public ResponseEntity<String> triggerWorkflow(@RequestBody Map<String, Object> body) {
        String triggerType = (String) body.get("triggerType");
        workflowEngineService.triggerEvent(triggerType, body);
        return ResponseEntity.ok("Workflow trigger executed");
    }
}
