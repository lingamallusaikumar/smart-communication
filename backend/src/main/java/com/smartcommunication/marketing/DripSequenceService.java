package com.smartcommunication.marketing;

import com.smartcommunication.organization.Organization;
import com.smartcommunication.organization.OrganizationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class DripSequenceService {

    private final DripSequenceRepository sequenceRepository;
    private final DripStepRepository stepRepository;
    private final OrganizationRepository organizationRepository;

    public DripSequenceService(DripSequenceRepository sequenceRepository,
                               DripStepRepository stepRepository,
                               OrganizationRepository organizationRepository) {
        this.sequenceRepository = sequenceRepository;
        this.stepRepository = stepRepository;
        this.organizationRepository = organizationRepository;
    }

    public List<DripSequence> getAllSequences(UUID orgId) {
        return sequenceRepository.findByOrganizationIdOrderByCreatedAtDesc(orgId);
    }

    public DripSequence getSequenceById(UUID id) {
        return sequenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drip sequence not found with id: " + id));
    }

    public DripSequence createSequence(DripSequence sequence, UUID orgId) {
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found: " + orgId));
        sequence.setOrganization(org);
        sequence.setStatus("DRAFT");
        sequence.setCreatedAt(ZonedDateTime.now());
        sequence.setUpdatedAt(ZonedDateTime.now());
        return sequenceRepository.save(sequence);
    }

    public DripSequence updateSequence(UUID id, DripSequence updates) {
        DripSequence existing = getSequenceById(id);
        if (updates.getName() != null) existing.setName(updates.getName());
        if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
        if (updates.getTriggerEvent() != null) existing.setTriggerEvent(updates.getTriggerEvent());
        existing.setUpdatedAt(ZonedDateTime.now());
        return sequenceRepository.save(existing);
    }

    public void deleteSequence(UUID id) {
        if (!sequenceRepository.existsById(id)) {
            throw new RuntimeException("Drip sequence not found with id: " + id);
        }
        sequenceRepository.deleteById(id);
    }

    public DripStep addStep(UUID sequenceId, DripStep step) {
        DripSequence sequence = getSequenceById(sequenceId);
        long stepCount = stepRepository.countByDripSequenceId(sequenceId);
        step.setStepOrder((int) stepCount);
        step.setCreatedAt(ZonedDateTime.now());
        sequence.addStep(step);
        sequence.setUpdatedAt(ZonedDateTime.now());
        sequenceRepository.save(sequence);
        return step;
    }

    public DripStep updateStep(UUID stepId, DripStep updates) {
        DripStep existing = stepRepository.findById(stepId)
                .orElseThrow(() -> new RuntimeException("Drip step not found with id: " + stepId));
        if (updates.getStepType() != null) existing.setStepType(updates.getStepType());
        if (updates.getSubject() != null) existing.setSubject(updates.getSubject());
        if (updates.getHtmlContent() != null) existing.setHtmlContent(updates.getHtmlContent());
        if (updates.getWaitDurationHours() > 0) existing.setWaitDurationHours(updates.getWaitDurationHours());
        if (updates.getConditionField() != null) existing.setConditionField(updates.getConditionField());
        if (updates.getConditionOperator() != null) existing.setConditionOperator(updates.getConditionOperator());
        if (updates.getConditionValue() != null) existing.setConditionValue(updates.getConditionValue());
        return stepRepository.save(existing);
    }

    public void removeStep(UUID stepId) {
        DripStep step = stepRepository.findById(stepId)
                .orElseThrow(() -> new RuntimeException("Drip step not found with id: " + stepId));
        stepRepository.delete(step);
    }

    public DripSequence activateSequence(UUID id) {
        DripSequence sequence = getSequenceById(id);
        if (sequence.getSteps().isEmpty()) {
            throw new RuntimeException("Cannot activate a drip sequence with no steps");
        }
        sequence.setStatus("ACTIVE");
        sequence.setUpdatedAt(ZonedDateTime.now());
        return sequenceRepository.save(sequence);
    }

    public DripSequence pauseSequence(UUID id) {
        DripSequence sequence = getSequenceById(id);
        if (!"ACTIVE".equals(sequence.getStatus())) {
            throw new RuntimeException("Can only pause an active sequence. Current status: " + sequence.getStatus());
        }
        sequence.setStatus("PAUSED");
        sequence.setUpdatedAt(ZonedDateTime.now());
        return sequenceRepository.save(sequence);
    }
}
