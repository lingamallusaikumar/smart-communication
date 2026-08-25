package com.smartcommunication.ai;

import com.smartcommunication.config.TenantContext;
import com.smartcommunication.customers.Customer;
import com.smartcommunication.customers.CustomerRepository;
import com.smartcommunication.organization.Organization;
import com.smartcommunication.organization.OrganizationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AiService {

    private final SmartCustomerMemoryRepository memoryRepository;
    private final AiInsightRepository insightRepository;
    private final CustomerRepository customerRepository;
    private final OrganizationRepository organizationRepository;

    @Value("${ai.provider:mock}")
    private String aiProvider;

    public AiService(SmartCustomerMemoryRepository memoryRepository,
                     AiInsightRepository insightRepository,
                     CustomerRepository customerRepository,
                     OrganizationRepository organizationRepository) {
        this.memoryRepository = memoryRepository;
        this.insightRepository = insightRepository;
        this.customerRepository = customerRepository;
        this.organizationRepository = organizationRepository;
    }

    public Map<String, Object> analyzeConversationText(String text) {
        String lower = text.toLowerCase();

        String sentiment = "POSITIVE";
        if (lower.contains("urgent") || lower.contains("issue") || lower.contains("error") || lower.contains("cancel")) {
            sentiment = lower.contains("cancel") ? "NEGATIVE" : "URGENT";
        } else if (lower.contains("pricing") || lower.contains("quote") || lower.contains("demo")) {
            sentiment = "POSITIVE";
        } else {
            sentiment = "NEUTRAL";
        }

        String intent = "Product Inquiry";
        if (lower.contains("pricing") || lower.contains("cost") || lower.contains("seat")) {
            intent = "Pricing & Seat Expansion";
        } else if (lower.contains("support") || lower.contains("ticket") || lower.contains("bug") || lower.contains("error") || lower.contains("issue")) {
            intent = "Technical Support Request";
        } else if (lower.contains("contract") || lower.contains("legal")) {
            intent = "Contract Review";
        }

        String summary = "Customer is inquiring regarding " + intent.toLowerCase() + ". High buying intent detected.";
        String recommendedAction = "Schedule follow-up call within 24 hours and send custom proposal.";

        List<String> smartReplies = List.of(
                "Thank you for reaching out! I can assist you with " + intent.toLowerCase() + " right away.",
                "I have updated our team with your request and will send over the details shortly.",
                "Would you be available for a brief 10-minute sync call tomorrow morning?"
        );

        Map<String, Object> response = new HashMap<>();
        response.put("provider", aiProvider);
        response.put("sentiment", sentiment);
        response.put("intent", intent);
        response.put("summary", summary);
        response.put("recommendedAction", recommendedAction);
        response.put("smartReplies", smartReplies);

        return response;
    }

    public SmartCustomerMemory getSmartCustomerMemory(UUID customerId) {
        UUID tenantId = TenantContext.getCurrentTenant();
        Customer customer = customerRepository.findByIdAndOrganizationId(customerId, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        return memoryRepository.findByCustomerId(customerId)
                .orElseGet(() -> {
                    SmartCustomerMemory memory = new SmartCustomerMemory(customer);
                    return memoryRepository.save(memory);
                });
    }

    @Transactional
    public SmartCustomerMemory updateSmartCustomerMemory(UUID customerId, SmartCustomerMemory memoryData) {
        SmartCustomerMemory memory = getSmartCustomerMemory(customerId);
        if (memoryData.getPreferredChannel() != null) memory.setPreferredChannel(memoryData.getPreferredChannel());
        if (memoryData.getPreferredTimeWindow() != null) memory.setPreferredTimeWindow(memoryData.getPreferredTimeWindow());
        if (memoryData.getSentimentHistory() != null) memory.setSentimentHistory(memoryData.getSentimentHistory());
        if (memoryData.getProductInterests() != null) memory.setProductInterests(memoryData.getProductInterests());
        if (memoryData.getSummaryNotes() != null) memory.setSummaryNotes(memoryData.getSummaryNotes());
        return memoryRepository.save(memory);
    }

    public List<AiInsight> getOrganizationAiInsights() {
        UUID tenantId = TenantContext.getCurrentTenant();
        return insightRepository.findByOrganizationIdOrderByCreatedAtDesc(tenantId);
    }
}
