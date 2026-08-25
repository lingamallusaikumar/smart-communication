package com.smartcommunication.ai;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class AiServiceTest {

    @Mock private SmartCustomerMemoryRepository memoryRepository;
    @Mock private AiInsightRepository insightRepository;

    @InjectMocks private AiService aiService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAnalyzeConversationTextPositivePricing() {
        String text = "We would like to add 5 seats and get enterprise pricing quotes.";
        Map<String, Object> result = aiService.analyzeConversationText(text);

        assertNotNull(result);
        assertEquals("POSITIVE", result.get("sentiment"));
        assertEquals("Pricing & Seat Expansion", result.get("intent"));
        assertNotNull(result.get("summary"));
        assertNotNull(result.get("smartReplies"));
    }

    @Test
    void testAnalyzeConversationTextUrgentSupport() {
        String text = "Urgent: Webhook integration error on production server!";
        Map<String, Object> result = aiService.analyzeConversationText(text);

        assertNotNull(result);
        assertEquals("URGENT", result.get("sentiment"));
        assertEquals("Technical Support Request", result.get("intent"));
    }
}
