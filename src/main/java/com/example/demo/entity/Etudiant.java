package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "etudiants")
public class Etudiant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "user_id", unique = true)
    private Integer userId;
    
    @Column(unique = true, length = 50)
    private String matricule;
    
    @Column(name = "promo_id")
    private Integer promoId;
    
    private BigDecimal moyenne;
    
    @Column(name = "annee_inscription")
    private Short anneeInscription;
    
    @OneToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "promo_id", insertable = false, updatable = false)
    private Promo promo;
    
    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    
    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }
    
    public Integer getPromoId() { return promoId; }
    public void setPromoId(Integer promoId) { this.promoId = promoId; }
    
    public BigDecimal getMoyenne() { return moyenne; }
    public void setMoyenne(BigDecimal moyenne) { this.moyenne = moyenne; }
    
    public Short getAnneeInscription() { return anneeInscription; }
    public void setAnneeInscription(Short anneeInscription) { this.anneeInscription = anneeInscription; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Promo getPromo() { return promo; }
    public void setPromo(Promo promo) { this.promo = promo; }
}