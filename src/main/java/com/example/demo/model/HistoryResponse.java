package com.example.demo.model;

import java.util.List;
import java.util.Map;

public class HistoryResponse {
    private List<Map<String, String>> history;
    
    public HistoryResponse(List<Map<String, String>> history) {
        this.history = history;
    }
    
    public List<Map<String, String>> getHistory() {
        return history;
    }
}