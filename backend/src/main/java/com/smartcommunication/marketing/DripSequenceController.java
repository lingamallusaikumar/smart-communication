package com.smartcommunication.marketing;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/marketing/drip-sequences")
public class DripSequenceController {

    private final DripSequenceService sequenceService;

    public DripSequenceController(DripSequenceService sequenceService) {
        this.sequenceService = sequenceService;
    }

    @GetMapping
    public ResponseEntity<List<DripSequence>> getAllSequences(@RequestParam UUID orgId) {
        return ResponseEntity.ok(sequenceService.getAllSequences(orgId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DripSequence> getSequenceById(@PathVariable UUID id) {
        return ResponseEntity.ok(sequenceService.getSequenceById(id));
    }

    @PostMapping
    public ResponseEntity<DripSequence> createSequence(@RequestBody DripSequence sequence, @RequestParam UUID orgId) {
        return ResponseEntity.ok(sequenceService.createSequence(sequence, orgId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DripSequence> updateSequence(@PathVariable UUID id, @RequestBody DripSequence updates) {
        return ResponseEntity.ok(sequenceService.updateSequence(id, updates));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSequence(@PathVariable UUID id) {
        sequenceService.deleteSequence(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/steps")
    public ResponseEntity<DripStep> addStep(@PathVariable UUID id, @RequestBody DripStep step) {
        return ResponseEntity.ok(sequenceService.addStep(id, step));
    }

    @PutMapping("/steps/{stepId}")
    public ResponseEntity<DripStep> updateStep(@PathVariable UUID stepId, @RequestBody DripStep updates) {
        return ResponseEntity.ok(sequenceService.updateStep(stepId, updates));
    }

    @DeleteMapping("/steps/{stepId}")
    public ResponseEntity<Void> removeStep(@PathVariable UUID stepId) {
        sequenceService.removeStep(stepId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<DripSequence> activateSequence(@PathVariable UUID id) {
        return ResponseEntity.ok(sequenceService.activateSequence(id));
    }

    @PostMapping("/{id}/pause")
    public ResponseEntity<DripSequence> pauseSequence(@PathVariable UUID id) {
        return ResponseEntity.ok(sequenceService.pauseSequence(id));
    }
}
