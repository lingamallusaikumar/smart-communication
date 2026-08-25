package com.smartcommunication.marketing;

import com.smartcommunication.organization.Organization;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "campaigns")
public class Campaign {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(nullable = false)
    private String name;

    private String subject;

    @Column(columnDefinition = "TEXT")
    private String htmlContent;

    @Column(columnDefinition = "TEXT")
    private String textContent;

    @Column(nullable = false)
    private String campaignType = "EMAIL"; // EMAIL, SMS, PUSH

    @Column(nullable = false)
    private String status = "DRAFT"; // DRAFT, SCHEDULED, RUNNING, PAUSED, COMPLETED, CANCELLED

    private ZonedDateTime scheduledAt;
    private ZonedDateTime sentAt;
    private ZonedDateTime completedAt;

    private int totalRecipients = 0;
    private int totalDelivered = 0;
    private int totalOpened = 0;
    private int totalClicked = 0;
    private int totalBounced = 0;
    private int totalUnsubscribed = 0;

    private ZonedDateTime createdAt = ZonedDateTime.now();
    private ZonedDateTime updatedAt = ZonedDateTime.now();

    public Campaign() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Organization getOrganization() { return organization; }
    public void setOrganization(Organization organization) { this.organization = organization; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getHtmlContent() { return htmlContent; }
    public void setHtmlContent(String htmlContent) { this.htmlContent = htmlContent; }

    public String getTextContent() { return textContent; }
    public void setTextContent(String textContent) { this.textContent = textContent; }

    public String getCampaignType() { return campaignType; }
    public void setCampaignType(String campaignType) { this.campaignType = campaignType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public ZonedDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(ZonedDateTime scheduledAt) { this.scheduledAt = scheduledAt; }

    public ZonedDateTime getSentAt() { return sentAt; }
    public void setSentAt(ZonedDateTime sentAt) { this.sentAt = sentAt; }

    public ZonedDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(ZonedDateTime completedAt) { this.completedAt = completedAt; }

    public int getTotalRecipients() { return totalRecipients; }
    public void setTotalRecipients(int totalRecipients) { this.totalRecipients = totalRecipients; }

    public int getTotalDelivered() { return totalDelivered; }
    public void setTotalDelivered(int totalDelivered) { this.totalDelivered = totalDelivered; }

    public int getTotalOpened() { return totalOpened; }
    public void setTotalOpened(int totalOpened) { this.totalOpened = totalOpened; }

    public int getTotalClicked() { return totalClicked; }
    public void setTotalClicked(int totalClicked) { this.totalClicked = totalClicked; }

    public int getTotalBounced() { return totalBounced; }
    public void setTotalBounced(int totalBounced) { this.totalBounced = totalBounced; }

    public int getTotalUnsubscribed() { return totalUnsubscribed; }
    public void setTotalUnsubscribed(int totalUnsubscribed) { this.totalUnsubscribed = totalUnsubscribed; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }

    public ZonedDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(ZonedDateTime updatedAt) { this.updatedAt = updatedAt; }
}
