package com.smartcommunication.ai;

import com.smartcommunication.customers.Customer;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "smart_customer_memory")
public class SmartCustomerMemory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false, unique = true)
    private Customer customer;

    private String preferredChannel = "WhatsApp";
    private String preferredTimeWindow = "10:00 AM – 12:00 PM";
    private String sentimentHistory = "POSITIVE";

    @Column(columnDefinition = "TEXT")
    private String summaryNotes;

    @Column(columnDefinition = "TEXT")
    private String productInterests = "Enterprise CRM, AI Intelligence Add-on";

    private ZonedDateTime updatedAt = ZonedDateTime.now();

    public SmartCustomerMemory() {}

    public SmartCustomerMemory(Customer customer) {
        this.customer = customer;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public String getPreferredChannel() { return preferredChannel; }
    public void setPreferredChannel(String preferredChannel) { this.preferredChannel = preferredChannel; }

    public String getPreferredTimeWindow() { return preferredTimeWindow; }
    public void setPreferredTimeWindow(String preferredTimeWindow) { this.preferredTimeWindow = preferredTimeWindow; }

    public String getSentimentHistory() { return sentimentHistory; }
    public void setSentimentHistory(String sentimentHistory) { this.sentimentHistory = sentimentHistory; }

    public String getSummaryNotes() { return summaryNotes; }
    public void setSummaryNotes(String summaryNotes) { this.summaryNotes = summaryNotes; }

    public String getProductInterests() { return productInterests; }
    public void setProductInterests(String productInterests) { this.productInterests = productInterests; }

    public ZonedDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(ZonedDateTime updatedAt) { this.updatedAt = updatedAt; }
}
