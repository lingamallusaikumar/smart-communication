package com.smartcommunication.communication;

import com.smartcommunication.config.TenantContext;
import com.smartcommunication.customers.Customer;
import com.smartcommunication.customers.CustomerActivity;
import com.smartcommunication.customers.CustomerActivityRepository;
import com.smartcommunication.customers.CustomerRepository;
import com.smartcommunication.organization.Organization;
import com.smartcommunication.organization.OrganizationRepository;
import com.smartcommunication.users.User;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CommunicationService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final CommunicationTemplateRepository templateRepository;
    private final CustomerRepository customerRepository;
    private final CustomerActivityRepository activityRepository;
    private final OrganizationRepository organizationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public CommunicationService(ConversationRepository conversationRepository,
                                MessageRepository messageRepository,
                                CommunicationTemplateRepository templateRepository,
                                CustomerRepository customerRepository,
                                CustomerActivityRepository activityRepository,
                                OrganizationRepository organizationRepository,
                                SimpMessagingTemplate messagingTemplate) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.templateRepository = templateRepository;
        this.customerRepository = customerRepository;
        this.activityRepository = activityRepository;
        this.organizationRepository = organizationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public List<Conversation> getConversations(String channelType) {
        UUID tenantId = TenantContext.getCurrentTenant();
        if (channelType != null && !channelType.isBlank() && !"ALL".equalsIgnoreCase(channelType)) {
            return conversationRepository.findByOrganizationIdAndChannelTypeOrderByLastMessageAtDesc(tenantId, channelType.toUpperCase());
        }
        return conversationRepository.findByOrganizationIdOrderByLastMessageAtDesc(tenantId);
    }

    public List<Message> getMessages(UUID conversationId) {
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
    }

    @Transactional
    public Message sendMessage(UUID conversationId, String content, Boolean isInternalNote, User currentUser) {
        UUID tenantId = TenantContext.getCurrentTenant();
        Conversation conversation = conversationRepository.findByIdAndOrganizationId(conversationId, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        Message message = new Message(
                conversation,
                "AGENT",
                currentUser.getId(),
                content,
                conversation.getChannelType(),
                isInternalNote != null && isInternalNote
        );
        Message savedMessage = messageRepository.save(message);

        conversation.setLastMessageAt(ZonedDateTime.now());
        conversationRepository.save(conversation);

        // Broadcast to WebSocket clients
        messagingTemplate.convertAndSend("/topic/conversations/" + conversationId, savedMessage);

        // Log to 360 Customer Timeline if customer attached
        if (conversation.getCustomer() != null && (isInternalNote == null || !isInternalNote)) {
            CustomerActivity activity = new CustomerActivity(
                    conversation.getOrganization(),
                    conversation.getCustomer(),
                    currentUser,
                    conversation.getChannelType() + "_SENT",
                    "Message Sent via " + conversation.getChannelType(),
                    content
            );
            activityRepository.save(activity);
        }

        return savedMessage;
    }

    @Transactional
    public Conversation createConversation(UUID customerId, String channelType, String subject, String initialMessage, User currentUser) {
        UUID tenantId = TenantContext.getCurrentTenant();
        Organization org = organizationRepository.findById(tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        Customer customer = customerRepository.findByIdAndOrganizationId(customerId, tenantId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        Conversation conversation = new Conversation();
        conversation.setOrganization(org);
        conversation.setCustomer(customer);
        conversation.setAssignedUser(currentUser);
        conversation.setChannelType(channelType.toUpperCase());
        conversation.setSubject(subject);
        conversation = conversationRepository.save(conversation);

        if (initialMessage != null && !initialMessage.isBlank()) {
            sendMessage(conversation.getId(), initialMessage, false, currentUser);
        }

        return conversation;
    }

    public List<CommunicationTemplate> getTemplates() {
        UUID tenantId = TenantContext.getCurrentTenant();
        return templateRepository.findByOrganizationId(tenantId);
    }
}
