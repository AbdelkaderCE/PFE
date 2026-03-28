package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "departements")
public class Departement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 200)
    private String nom;
    
    @Column(name = "faculte_id")
    private Integer faculteId;
    
    @ManyToOne
    @JoinColumn(name = "faculte_id", insertable = false, updatable = false)
    private Faculte faculte;
    
    @OneToMany(mappedBy = "departement")
    private List<Filiere> filieres;
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public Integer getFaculteId() { return faculteId; }
    public void setFaculteId(Integer faculteId) { this.faculteId = faculteId; }
    
    public Faculte getFaculte() { return faculte; }
    public void setFaculte(Faculte faculte) { this.faculte = faculte; }
    
    public List<Filiere> getFilieres() { return filieres; }
    public void setFilieres(List<Filiere> filieres) { this.filieres = filieres; }
}