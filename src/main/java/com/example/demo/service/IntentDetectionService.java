package com.example.demo.service;

import org.springframework.stereotype.Service;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class IntentDetectionService {
    
    // تصنيفات النوايا
    public enum Intent {
        GREETING, GOODBYE, THANKS, HELP,
        ASK_AI, ASK_PFE, ASK_TECH, ASK_GROUPS,
        ASK_TIME, ASK_DATE, ASK_RECOMMENDATION,
        COMPLAINT, PRAISE, CONFUSION, GENERAL
    }
    
    // كلمات مفتاحية لكل نية
    private final Map<Intent, List<Pattern>> intentPatterns = new HashMap<>();
    
    public IntentDetectionService() {
        // تحية
        intentPatterns.put(Intent.GREETING, compilePatterns(
            "سلام", "السلام", "مرحبا", "اهلا", "hi", "hello", "bonjour"
        ));
        
        // وداع
        intentPatterns.put(Intent.GOODBYE, compilePatterns(
            "مع السلامة", "باي", "bye", "au revoir"
        ));
        
        // شكر
        intentPatterns.put(Intent.THANKS, compilePatterns(
            "شكرا", "merci", "thanks", "thank you"
        ));
        
        // مساعدة
        intentPatterns.put(Intent.HELP, compilePatterns(
            "مساعدة", "help", "ساعدني", "اعرف"
        ));
        
        // ذكاء اصطناعي
        intentPatterns.put(Intent.ASK_AI, compilePatterns(
            "ذكاء اصطناعي", "ai", "الذكاء", "intelligence artificielle"
        ));
        
        // مشروع
        intentPatterns.put(Intent.ASK_PFE, compilePatterns(
            "مشروع", "pfe", "تخرج", "project"
        ));
        
        // تقنيات
        intentPatterns.put(Intent.ASK_TECH, compilePatterns(
            "تقنية", "technologie", "java", "spring", "react", "flutter"
        ));
        
        // مجموعات
        intentPatterns.put(Intent.ASK_GROUPS, compilePatterns(
            "مجموعة", "groupe", "فرق", "groups"
        ));
        
        // وقت
        intentPatterns.put(Intent.ASK_TIME, compilePatterns(
            "كم الساعة", "الوقت", "what time", "heure"
        ));
        
        // تاريخ
        intentPatterns.put(Intent.ASK_DATE, compilePatterns(
            "كم التاريخ", "اليوم كم", "what date", "date"
        ));
        
        // توصيات
        intentPatterns.put(Intent.ASK_RECOMMENDATION, compilePatterns(
            "توصية", "recommendation", "اقتراح", "suggestion"
        ));
        
        // شكوى
        intentPatterns.put(Intent.COMPLAINT, compilePatterns(
            "مشكلة", "خطأ", "bug", "لا يعمل", "عطل"
        ));
        
        // مدح
        intentPatterns.put(Intent.PRAISE, compilePatterns(
            "ممتاز", "رائع", "جميل", "أحسنت", "great", "excellent"
        ));
        
        // ارتباك
        intentPatterns.put(Intent.CONFUSION, compilePatterns(
            "ما فهمت", "مش فاهم", "ماذا تقصد", "what do you mean"
        ));
    }
    
    private List<Pattern> compilePatterns(String... words) {
        List<Pattern> patterns = new ArrayList<>();
        for (String word : words) {
            patterns.add(Pattern.compile(".*" + Pattern.quote(word) + ".*", 
                        Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE));
        }
        return patterns;
    }
    
    public Intent detectIntent(String message) {
        if (message == null || message.trim().isEmpty()) {
            return Intent.GENERAL;
        }
        
        String lowerMsg = message.toLowerCase();
        
        for (Map.Entry<Intent, List<Pattern>> entry : intentPatterns.entrySet()) {
            for (Pattern pattern : entry.getValue()) {
                if (pattern.matcher(lowerMsg).matches()) {
                    return entry.getKey();
                }
            }
        }
        
        return Intent.GENERAL;
    }
    
    public double getConfidence(String message, Intent intent) {
        // حساب مدى الثقة في النية
        List<Pattern> patterns = intentPatterns.get(intent);
        if (patterns == null) return 0.0;
        
        String lowerMsg = message.toLowerCase();
        int matches = 0;
        
        for (Pattern pattern : patterns) {
            if (pattern.matcher(lowerMsg).matches()) {
                matches++;
            }
        }
        
        return (double) matches / patterns.size();
    }
}