package com.smartcommunication.marketing;

import com.smartcommunication.customers.Customer;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "campaign_recipients")
public class CampaignRecipient {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    private String email;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, SENT, DELIVERED, OPENED, CLICKED, BOUNCED, UNSUBSCRIBED

    private ZonedDateTime sentAt;
    private ZonedDateTime deliveredAt;
    private ZonedDateTime openedAt;
    private ZonedDateTime clickedAt;

    public CampaignRecipient() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Campaign getCampaign() { return campaign; }
    public void setCampaign(Campaign campaign) { this.campaign = campaign; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public ZonedDateTime getSentAt() { return sentAt; }
    public void setSentAt(ZonedDateTime sentAt) { this.sentAt = sentAt; }

    public ZonedDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(ZonedDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public ZonedDateTime getOpenedAt() { return openedAt; }
    public void setOpenedAt(ZonedDateTime openedAt) { this.openedAt = openedAt; }

    public ZonedDateTime getClickedAt() { return clickedAt; }
    public void setClickedAt(ZonedDateTime clickedAt) { this.clickedAt = clickedAt; }
}
