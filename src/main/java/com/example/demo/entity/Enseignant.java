package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "enseignants")
public class Enseignant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "user_id", unique = true)
    private Integer userId;
    
    @Column(name = "grade_id")
    private Integer gradeId;
    
    @Column(length = 50)
    private String bureau;
    
    @Column(name = "date_recrutement")
    private LocalDate dateRecrutement;
    
    @OneToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
    
    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    
    public Integer getGradeId() { return gradeId; }
    public void setGradeId(Integer gradeId) { this.gradeId = gradeId; }
    
    public String getBureau() { return bureau; }
    public void setBureau(String bureau) { this.bureau = bureau; }
    
    public LocalDate getDateRecrutement() { return dateRecrutement; }
    public void setDateRecrutement(LocalDate dateRecrutement) { this.dateRecrutement = dateRecrutement; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}