package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "facultes")
public class Faculte {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 200)
    private String nom;
    
    @OneToMany(mappedBy = "faculte")
    private List<Departement> departements;
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public List<Departement> getDepartements() { return departements; }
    public void setDepartements(List<Departement> departements) { this.departements = departements; }
}