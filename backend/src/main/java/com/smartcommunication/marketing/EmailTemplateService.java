package com.smartcommunication.marketing;

import com.smartcommunication.organization.Organization;
import com.smartcommunication.organization.OrganizationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class EmailTemplateService {

    private final EmailTemplateRepository templateRepository;
    private final OrganizationRepository organizationRepository;

    public EmailTemplateService(EmailTemplateRepository templateRepository,
                                OrganizationRepository organizationRepository) {
        this.templateRepository = templateRepository;
        this.organizationRepository = organizationRepository;
    }

    public List<EmailTemplate> getAllTemplates(UUID orgId) {
        return templateRepository.findByOrganizationIdOrderByCreatedAtDesc(orgId);
    }

    public EmailTemplate getTemplateById(UUID id) {
        return templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Email template not found with id: " + id));
    }

    public EmailTemplate createTemplate(EmailTemplate template, UUID orgId) {
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found: " + orgId));
        template.setOrganization(org);
        template.setCreatedAt(ZonedDateTime.now());
        template.setUpdatedAt(ZonedDateTime.now());
        return templateRepository.save(template);
    }

    public EmailTemplate updateTemplate(UUID id, EmailTemplate updates) {
        EmailTemplate existing = getTemplateById(id);
        if (updates.getName() != null) existing.setName(updates.getName());
        if (updates.getSubject() != null) existing.setSubject(updates.getSubject());
        if (updates.getHtmlContent() != null) existing.setHtmlContent(updates.getHtmlContent());
        if (updates.getCategory() != null) existing.setCategory(updates.getCategory());
        if (updates.getVariables() != null) existing.setVariables(updates.getVariables());
        if (updates.getActive() != null) existing.setActive(updates.getActive());
        existing.setUpdatedAt(ZonedDateTime.now());
        return templateRepository.save(existing);
    }

    public void deleteTemplate(UUID id) {
        if (!templateRepository.existsById(id)) {
            throw new RuntimeException("Email template not found with id: " + id);
        }
        templateRepository.deleteById(id);
    }

    public List<EmailTemplate> getTemplatesByCategory(UUID orgId, String category) {
        return templateRepository.findByOrganizationIdAndCategory(orgId, category);
    }

    public String renderTemplate(UUID templateId, Map<String, String> variables) {
        EmailTemplate template = getTemplateById(templateId);
        String rendered = template.getHtmlContent();
        if (rendered == null) return "";
        for (Map.Entry<String, String> entry : variables.entrySet()) {
            rendered = rendered.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return rendered;
    }
}
