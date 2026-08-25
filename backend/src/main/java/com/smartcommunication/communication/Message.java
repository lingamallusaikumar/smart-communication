package com.smartcommunication.communication;

import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @Column(nullable = false)
    private String senderType; // CUSTOMER, AGENT, SYSTEM, AI

    private UUID senderId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private String channelType;

    private String status = "SENT"; // SENT, DELIVERED, READ, FAILED
    private Boolean isInternalNote = false;

    private ZonedDateTime createdAt = ZonedDateTime.now();

    public Message() {}

    public Message(Conversation conversation, String senderType, UUID senderId, String content, String channelType, Boolean isInternalNote) {
        this.conversation = conversation;
        this.senderType = senderType;
        this.senderId = senderId;
        this.content = content;
        this.channelType = channelType;
        this.isInternalNote = isInternalNote;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Conversation getConversation() { return conversation; }
    public void setConversation(Conversation conversation) { this.conversation = conversation; }

    public String getSenderType() { return senderType; }
    public void setSenderType(String senderType) { this.senderType = senderType; }

    public UUID getSenderId() { return senderId; }
    public void setSenderId(UUID senderId) { this.senderId = senderId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getChannelType() { return channelType; }
    public void setChannelType(String channelType) { this.channelType = channelType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getIsInternalNote() { return isInternalNote; }
    public void setIsInternalNote(Boolean isInternalNote) { this.isInternalNote = isInternalNote; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }
}
