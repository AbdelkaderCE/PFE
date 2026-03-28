package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "filieres")
public class Filiere {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 100)
    private String nom;
    
    @Column(name = "departement_id")
    private Integer departementId;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "departement_id", insertable = false, updatable = false)
    private Departement departement;
    
    @OneToMany(mappedBy = "filiere")
    private List<Specialite> specialites;
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public Integer getDepartementId() { return departementId; }
    public void setDepartementId(Integer departementId) { this.departementId = departementId; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Departement getDepartement() { return departement; }
    public void setDepartement(Departement departement) { this.departement = departement; }
    
    public List<Specialite> getSpecialites() { return specialites; }
    public void setSpecialites(List<Specialite> specialites) { this.specialites = specialites; }
}