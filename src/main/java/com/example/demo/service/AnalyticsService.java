package com.example.demo.service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class AnalyticsService {
    
    private final AtomicLong totalMessages = new AtomicLong(0);
    private final AtomicLong totalUsers = new AtomicLong(0);
    private final Map<String, Long> intentCounts = new ConcurrentHashMap<>();
    private final Map<String, List<Double>> responseTimes = new ConcurrentHashMap<>();
    
    public void recordMessage(String sessionId, String intent, long responseTimeMs) {
        totalMessages.incrementAndGet();
        
        intentCounts.merge(intent, 1L, Long::sum);
        
        responseTimes.computeIfAbsent(sessionId, k -> new ArrayList<>()).add((double) responseTimeMs);
    }
    
    public void recordNewUser() {
        totalUsers.incrementAndGet();
    }
    
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalMessages", totalMessages.get());
        stats.put("totalUsers", totalUsers.get());
        stats.put("intentDistribution", new HashMap<>(intentCounts));
        
        // متوسط وقت الاستجابة
        double avgResponseTime = responseTimes.values().stream()
            .flatMap(List::stream)
            .mapToDouble(Double::doubleValue)
            .average()
            .orElse(0.0);
        
        stats.put("averageResponseTimeMs", Math.round(avgResponseTime));
        
        // أكثر 5 نوايا شيوعاً
        List<Map.Entry<String, Long>> topIntents = intentCounts.entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .limit(5)
            .toList();
        
        stats.put("topIntents", topIntents);
        
        return stats;
    }
}