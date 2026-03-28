package com.example.demo.controller;

import com.example.demo.model.ChatRequest;
import com.example.demo.model.ChatResponse;
import com.example.demo.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatService chatService;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String reply = chatService.getReply(request.getMessage(), request.getSessionId());
        return ResponseEntity.ok()
            .body(new ChatResponse(reply));
    }
    
    @GetMapping("/test-ai")
    public ResponseEntity<String> testAI() {
        return ResponseEntity.ok()
            .body("✅ Le service AI fonctionne correctement!");
    }
    
    @GetMapping("/test-fix")
    public ResponseEntity<Map<String, Object>> testFix() {
        Map<String, Object> result = new HashMap<>();
        try {
            String sql = "SELECT nom, prenom FROM users WHERE id = 1";
            Map<String, Object> user = jdbcTemplate.queryForMap(sql);
            
            String rawNom = user.get("nom").toString();
            String rawPrenom = user.get("prenom").toString();
            String fixedNom = chatService.fixEncoding(rawNom);
            String fixedPrenom = chatService.fixEncoding(rawPrenom);
            
            result.put("raw_nom", rawNom);
            result.put("raw_nom_bytes", java.util.Arrays.toString(rawNom.getBytes()));
            result.put("raw_prenom", rawPrenom);
            result.put("raw_prenom_bytes", java.util.Arrays.toString(rawPrenom.getBytes()));
            result.put("fixed_nom", fixedNom);
            result.put("fixed_prenom", fixedPrenom);
            result.put("expected_nom", "Mohamed");
            result.put("expected_prenom", "Ahmed");
            result.put("success", true);
            
        } catch (Exception e) {
            result.put("error", e.getMessage());
            result.put("success", false);
        }
        return ResponseEntity.ok(result);
    }
}