package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pfe_sujets")
public class PfeSujet {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 255)
    private String titre;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String keywords;
    
    @Column(name = "enseignant_id")
    private Integer enseignantId;
    
    @Column(name = "promo_id")
    private Integer promoId;
    
    @Column(columnDefinition = "TEXT")
    private String workplan;
    
    @Column(columnDefinition = "TEXT")
    private String bibliographie;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type_projet")
    private TypeProjet typeProjet = TypeProjet.application;
    
    @Enumerated(EnumType.STRING)
    private StatusSujet status = StatusSujet.propose;
    
    @Column(name = "annee_universitaire", length = 20)
    private String anneeUniversitaire;
    
    @Column(name = "max_grps")
    private Integer maxGrps = 1;
    
    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getKeywords() { return keywords; }
    public void setKeywords(String keywords) { this.keywords = keywords; }
    
    public Integer getEnseignantId() { return enseignantId; }
    public void setEnseignantId(Integer enseignantId) { this.enseignantId = enseignantId; }
    
    public Integer getPromoId() { return promoId; }
    public void setPromoId(Integer promoId) { this.promoId = promoId; }
    
    public String getWorkplan() { return workplan; }
    public void setWorkplan(String workplan) { this.workplan = workplan; }
    
    public String getBibliographie() { return bibliographie; }
    public void setBibliographie(String bibliographie) { this.bibliographie = bibliographie; }
    
    public TypeProjet getTypeProjet() { return typeProjet; }
    public void setTypeProjet(TypeProjet typeProjet) { this.typeProjet = typeProjet; }
    
    public StatusSujet getStatus() { return status; }
    public void setStatus(StatusSujet status) { this.status = status; }
    
    public String getAnneeUniversitaire() { return anneeUniversitaire; }
    public void setAnneeUniversitaire(String anneeUniversitaire) { this.anneeUniversitaire = anneeUniversitaire; }
    
    public Integer getMaxGrps() { return maxGrps; }
    public void setMaxGrps(Integer maxGrps) { this.maxGrps = maxGrps; }
}