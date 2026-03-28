package com.example.demo.service;

import com.example.demo.model.ChatSession;
import com.example.demo.model.ChatMessage;
import org.springframework.stereotype.Service;
import org.springframework.web.context.annotation.SessionScope;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@SessionScope
public class ChatHistoryService {
    
    private final Map<String, ChatSession> sessions = new ConcurrentHashMap<>();
    private String currentSessionId;
    
    public ChatHistoryService() {
        createNewSession();
    }
    
    public ChatSession createNewSession() {
        ChatSession newSession = new ChatSession();
        sessions.put(newSession.getId(), newSession);
        currentSessionId = newSession.getId();
        return newSession;
    }
    
    public List<ChatSession> getAllSessions() {
        List<ChatSession> sessionList = new ArrayList<>(sessions.values());
        sessionList.sort((s1, s2) -> s2.getLastModified().compareTo(s1.getLastModified()));
        return sessionList;
    }
    
    public ChatSession getSession(String sessionId) {
        return sessions.get(sessionId);
    }
    
    public void setCurrentSession(String sessionId) {
        if (sessions.containsKey(sessionId)) {
            this.currentSessionId = sessionId;
        }
    }
    
    public String getCurrentSessionId() {
        return currentSessionId;
    }
    
    public ChatSession getCurrentSession() {
        return sessions.get(currentSessionId);
    }
    
    public void addMessage(String sessionId, String content, String sender) {
        ChatSession session = sessions.get(sessionId);
        if (session != null) {
            ChatMessage message = new ChatMessage(sessionId, content, sender);
            session.getMessages().add(message);
            session.setLastModified(message.getTimestamp());
            
            if (sender.equals("USER") && session.getMessages().size() == 1) {
                String title = content.length() > 25 ? content.substring(0, 22) + "..." : content;
                session.setTitle(title);
            }
        }
    }
    
    public void deleteSession(String sessionId) {
        sessions.remove(sessionId);
        if (sessionId.equals(currentSessionId)) {
            List<ChatSession> remaining = getAllSessions();
            if (!remaining.isEmpty()) {
                currentSessionId = remaining.get(0).getId();
            } else {
                createNewSession();
            }
        }
    }
}