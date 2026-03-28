package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication
public class ChatbotBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChatbotBackendApplication.class, args);
        System.out.println("\n==========================================");
        System.out.println("🚀 G11 Smart Chatbot شغال على port 8081");
        System.out.println("📝 استخدم: POST http://localhost:8081/chat");
        System.out.println("🔐 للتسجيل: POST http://localhost:8081/auth/register");
        System.out.println("🔑 للدخول: POST http://localhost:8081/auth/login");
        System.out.println("🤖 النموذج: OpenRouter GPT-3.5 Turbo");
        System.out.println("📊 قاعدة البيانات: g11_education");
        System.out.println("==========================================\n");
    }
}