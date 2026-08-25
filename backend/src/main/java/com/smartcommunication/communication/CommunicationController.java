package com.smartcommunication.communication;

import com.smartcommunication.users.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/communication")
public class CommunicationController {

    private final CommunicationService communicationService;

    public CommunicationController(CommunicationService communicationService) {
        this.communicationService = communicationService;
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<Conversation>> getConversations(@RequestParam(required = false) String channel) {
        return ResponseEntity.ok(communicationService.getConversations(channel));
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<List<Message>> getMessages(@PathVariable UUID id) {
        return ResponseEntity.ok(communicationService.getMessages(id));
    }

    @PostMapping("/conversations/{id}/messages")
    public ResponseEntity<Message> sendMessage(@PathVariable UUID id,
                                               @RequestBody Map<String, Object> body,
                                               @AuthenticationPrincipal User currentUser) {
        String content = (String) body.get("content");
        Boolean isInternalNote = (Boolean) body.get("isInternalNote");
        return ResponseEntity.ok(communicationService.sendMessage(id, content, isInternalNote, currentUser));
    }

    @PostMapping("/conversations")
    public ResponseEntity<Conversation> createConversation(@RequestBody Map<String, String> body,
                                                           @AuthenticationPrincipal User currentUser) {
        UUID customerId = UUID.fromString(body.get("customerId"));
        String channelType = body.get("channelType");
        String subject = body.get("subject");
        String initialMessage = body.get("initialMessage");
        return ResponseEntity.ok(communicationService.createConversation(customerId, channelType, subject, initialMessage, currentUser));
    }

    @GetMapping("/templates")
    public ResponseEntity<List<CommunicationTemplate>> getTemplates() {
        return ResponseEntity.ok(communicationService.getTemplates());
    }
}
