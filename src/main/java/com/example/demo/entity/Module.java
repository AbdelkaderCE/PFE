package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "modules")
public class Module {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 150)
    private String nom;
    
    @Column(unique = true, length = 50)
    private String code;
    
    private Short semestre;
    
    @Column(name = "specialite_id")
    private Integer specialiteId;
    
    @ManyToOne  // أضف هذه العلاقة
    @JoinColumn(name = "specialite_id", insertable = false, updatable = false)
    private Specialite specialite;
    
    @Column(name = "volume_cours")
    private Integer volumeCours = 0;
    
    @Column(name = "volume_td")
    private Integer volumeTd = 0;
    
    @Column(name = "volume_tp")
    private Integer volumeTp = 0;
    
    private Integer credit = 0;
    
    private BigDecimal coef = BigDecimal.ONE;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public Short getSemestre() { return semestre; }
    public void setSemestre(Short semestre) { this.semestre = semestre; }
    
    public Integer getSpecialiteId() { return specialiteId; }
    public void setSpecialiteId(Integer specialiteId) { this.specialiteId = specialiteId; }
    
    public Specialite getSpecialite() { return specialite; }
    public void setSpecialite(Specialite specialite) { this.specialite = specialite; }
    
    public Integer getVolumeCours() { return volumeCours; }
    public void setVolumeCours(Integer volumeCours) { this.volumeCours = volumeCours; }
    
    public Integer getVolumeTd() { return volumeTd; }
    public void setVolumeTd(Integer volumeTd) { this.volumeTd = volumeTd; }
    
    public Integer getVolumeTp() { return volumeTp; }
    public void setVolumeTp(Integer volumeTp) { this.volumeTp = volumeTp; }
    
    public Integer getCredit() { return credit; }
    public void setCredit(Integer credit) { this.credit = credit; }
    
    public BigDecimal getCoef() { return coef; }
    public void setCoef(BigDecimal coef) { this.coef = coef; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}