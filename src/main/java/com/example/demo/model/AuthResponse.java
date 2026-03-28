package com.example.demo.model;

public class AuthResponse {
    private String token;
    private Integer userId;
    private String nom;
    private String prenom;
    private String email;
    private String role;

    public AuthResponse(String token, Integer userId, String nom, String prenom, String email, String role) {
        this.token = token;
        this.userId = userId;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.role = role;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}