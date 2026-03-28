package com.example.demo.controller;

import com.example.demo.model.ChatSession;
import com.example.demo.service.ChatHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatHistoryController {
    
    @Autowired
    private ChatHistoryService chatHistoryService;
    
    @GetMapping("/sessions")
    public ResponseEntity<List<ChatSession>> getAllSessions() {
        return ResponseEntity.ok(chatHistoryService.getAllSessions());
    }
    
    @PostMapping("/sessions/new")
    public ResponseEntity<Map<String, String>> createNewSession() {
        ChatSession newSession = chatHistoryService.createNewSession();
        Map<String, String> response = new HashMap<>();
        response.put("sessionId", newSession.getId());
        response.put("title", newSession.getTitle());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<ChatSession> getSession(@PathVariable String sessionId) {
        ChatSession session = chatHistoryService.getSession(sessionId);
        if (session != null) {
            chatHistoryService.setCurrentSession(sessionId);
            return ResponseEntity.ok(session);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<Void> deleteSession(@PathVariable String sessionId) {
        chatHistoryService.deleteSession(sessionId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/current")
    public ResponseEntity<ChatSession> getCurrentSession() {
        return ResponseEntity.ok(chatHistoryService.getCurrentSession());
    }
}