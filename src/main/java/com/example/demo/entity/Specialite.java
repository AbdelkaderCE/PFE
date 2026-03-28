package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "specialites")
public class Specialite {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 100)
    private String nom;
    
    @Column(name = "filiere_id")
    private Integer filiereId;
    
    @Enumerated(EnumType.STRING)
    private Niveau niveau;
    
    @ManyToOne
    @JoinColumn(name = "filiere_id", insertable = false, updatable = false)
    private Filiere filiere;
    
    @OneToMany(mappedBy = "specialite")
    private List<Promo> promos;
    
    @OneToMany(mappedBy = "specialite")
    private List<Module> modules;
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public Integer getFiliereId() { return filiereId; }
    public void setFiliereId(Integer filiereId) { this.filiereId = filiereId; }
    
    public Niveau getNiveau() { return niveau; }
    public void setNiveau(Niveau niveau) { this.niveau = niveau; }
    
    public Filiere getFiliere() { return filiere; }
    public void setFiliere(Filiere filiere) { this.filiere = filiere; }
    
    public List<Promo> getPromos() { return promos; }
    public void setPromos(List<Promo> promos) { this.promos = promos; }
    
    public List<Module> getModules() { return modules; }
    public void setModules(List<Module> modules) { this.modules = modules; }
}