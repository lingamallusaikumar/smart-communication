package com.smartcommunication.communication;

import org.junit.jupiter.api.Test;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class TemplateValidatorTest {

    private final TemplateValidator validator = new TemplateValidator();

    @Test
    public void testExtractPlaceholders() {
        String template = "Hello {{customer_name}}, your order {{order_id}} is confirmed.";
        List<String> placeholders = validator.extractPlaceholders(template);
        assertEquals(2, placeholders.size());
        assertTrue(placeholders.contains("customer_name"));
        assertTrue(placeholders.contains("order_id"));
    }

    @Test
    public void testValidateVariablesPresentSuccess() {
        String template = "Hi {{name}}!";
        Map<String, Object> vars = new HashMap<>();
        vars.put("name", "Alice");
        assertTrue(validator.validateVariablesPresent(template, vars));
    }

    @Test
    public void testValidateVariablesPresentMissing() {
        String template = "Hi {{name}}, balance is {{balance}}.";
        Map<String, Object> vars = new HashMap<>();
        vars.put("name", "Alice");
        assertFalse(validator.validateVariablesPresent(template, vars));
    }
}
