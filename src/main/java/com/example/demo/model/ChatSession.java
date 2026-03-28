package com.example.demo.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ChatSession {
    private String id;
    private String title;
    private LocalDateTime createdAt;
    private LocalDateTime lastModified;
    private List<ChatMessage> messages;
    
    public ChatSession() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.lastModified = LocalDateTime.now();
        this.messages = new ArrayList<>();
        this.title = "محادثة جديدة";
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getLastModified() { return lastModified; }
    public void setLastModified(LocalDateTime lastModified) { this.lastModified = lastModified; }
    
    public List<ChatMessage> getMessages() { return messages; }
    public void setMessages(List<ChatMessage> messages) { this.messages = messages; }
}