package com.smartcommunication.marketing;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "drip_steps")
public class DripStep {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drip_sequence_id", nullable = false)
    @JsonIgnore
    private DripSequence dripSequence;

    @Column(nullable = false)
    private int stepOrder = 0;

    @Column(nullable = false)
    private String stepType = "EMAIL"; // EMAIL, WAIT, CONDITION, ACTION

    private String subject;

    @Column(columnDefinition = "TEXT")
    private String htmlContent;

    private int waitDurationHours = 0;

    private String conditionField;
    private String conditionOperator;
    private String conditionValue;

    private ZonedDateTime createdAt = ZonedDateTime.now();

    public DripStep() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public DripSequence getDripSequence() { return dripSequence; }
    public void setDripSequence(DripSequence dripSequence) { this.dripSequence = dripSequence; }

    public int getStepOrder() { return stepOrder; }
    public void setStepOrder(int stepOrder) { this.stepOrder = stepOrder; }

    public String getStepType() { return stepType; }
    public void setStepType(String stepType) { this.stepType = stepType; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getHtmlContent() { return htmlContent; }
    public void setHtmlContent(String htmlContent) { this.htmlContent = htmlContent; }

    public int getWaitDurationHours() { return waitDurationHours; }
    public void setWaitDurationHours(int waitDurationHours) { this.waitDurationHours = waitDurationHours; }

    public String getConditionField() { return conditionField; }
    public void setConditionField(String conditionField) { this.conditionField = conditionField; }

    public String getConditionOperator() { return conditionOperator; }
    public void setConditionOperator(String conditionOperator) { this.conditionOperator = conditionOperator; }

    public String getConditionValue() { return conditionValue; }
    public void setConditionValue(String conditionValue) { this.conditionValue = conditionValue; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}
