package com.smartcommunication.communication;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class TemplateValidator {

    private static final Pattern PLACEHOLDER_PATTERN = Pattern.compile("\\{\\{([^}]+)\\}\\}");

    public List<String> extractPlaceholders(String templateBody) {
        List<String> placeholders = new ArrayList<>();
        if (templateBody == null) {
            return placeholders;
        }
        Matcher matcher = PLACEHOLDER_PATTERN.matcher(templateBody);
        while (matcher.find()) {
            placeholders.add(matcher.group(1).trim());
        }
        return placeholders;
    }

    public boolean validateVariablesPresent(String templateBody, Map<String, Object> variables) {
        List<String> required = extractPlaceholders(templateBody);
        if (required.isEmpty()) {
            return true;
        }
        if (variables == null) {
            return false;
        }
        return variables.keySet().containsAll(required);
    }
}
