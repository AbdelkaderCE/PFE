package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "promos")
public class Promo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(length = 100)
    private String nom;
    
    @Column(name = "specialite_id")
    private Integer specialiteId;
    
    @ManyToOne  // أضف هذه العلاقة
    @JoinColumn(name = "specialite_id", insertable = false, updatable = false)
    private Specialite specialite;
    
    @Column(name = "annee_universitaire", length = 20)
    private String anneeUniversitaire;
    
    @Column(length = 50)
    private String section;
    
    @OneToMany(mappedBy = "promo")
    private List<Etudiant> etudiants;
    
    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public Integer getSpecialiteId() { return specialiteId; }
    public void setSpecialiteId(Integer specialiteId) { this.specialiteId = specialiteId; }
    
    public Specialite getSpecialite() { return specialite; }
    public void setSpecialite(Specialite specialite) { this.specialite = specialite; }
    
    public String getAnneeUniversitaire() { return anneeUniversitaire; }
    public void setAnneeUniversitaire(String anneeUniversitaire) { this.anneeUniversitaire = anneeUniversitaire; }
    
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
    
    public List<Etudiant> getEtudiants() { return etudiants; }
    public void setEtudiants(List<Etudiant> etudiants) { this.etudiants = etudiants; }
}