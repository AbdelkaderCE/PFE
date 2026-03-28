package com.example.demo.model;

import java.time.LocalDateTime;

public class ChatMessage {
    private String sessionId;
    private String content;
    private String sender;
    private LocalDateTime timestamp;
    
    public ChatMessage() {}
    
    public ChatMessage(String sessionId, String content, String sender) {
        this.sessionId = sessionId;
        this.content = content;
        this.sender = sender;
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}