package com.smartcommunication.support;

import com.smartcommunication.organization.Organization;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "sla_rules")
public class SlaRule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(nullable = false)
    private String priority; // URGENT, HIGH, MEDIUM, LOW

    @Column(nullable = false)
    private Integer firstResponseTimeMinutes;

    @Column(nullable = false)
    private Integer resolutionTimeMinutes;

    public SlaRule() {}

    public SlaRule(Organization organization, String priority, Integer firstResponseTimeMinutes, Integer resolutionTimeMinutes) {
        this.organization = organization;
        this.priority = priority;
        this.firstResponseTimeMinutes = firstResponseTimeMinutes;
        this.resolutionTimeMinutes = resolutionTimeMinutes;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Integer getFirstResponseTimeMinutes() { return firstResponseTimeMinutes; }
    public void setFirstResponseTimeMinutes(Integer firstResponseTimeMinutes) { this.firstResponseTimeMinutes = firstResponseTimeMinutes; }

    public Integer getResolutionTimeMinutes() { return resolutionTimeMinutes; }
    public void setResolutionTimeMinutes(Integer resolutionTimeMinutes) { this.resolutionTimeMinutes = resolutionTimeMinutes; }
}
