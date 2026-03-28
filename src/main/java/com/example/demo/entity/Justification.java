package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;  // فقط LocalDate
import java.time.LocalDateTime;

@Entity
@Table(name = "justifications")
public class Justification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "etudiant_id")
    private Integer etudiantId;
    
    @Column(name = "type_id")
    private Integer typeId;
    
    @Column(name = "date_absence")
    private LocalDate dateAbsence;  // DATE
    
    @Column(columnDefinition = "TEXT")
    private String motif;
    
    @Column(columnDefinition = "TEXT")
    private String document;
    
    @Column(name = "date_depot")
    private LocalDate dateDepot;  // تغيير من LocalDateTime إلى LocalDate (لأنه @db.Date)
    
    @Enumerated(EnumType.STRING)
    private StatusJustification status = StatusJustification.soumis;
    
    @Column(name = "traite_par")
    private Integer traitePar;
    
    @Column(name = "date_traitement")
    private LocalDateTime dateTraitement;  // هذا يبقى TIMESTAMP (غير محدد في Prisma)
    
    @Column(name = "commentaire_admin", columnDefinition = "TEXT")
    private String commentaireAdmin;
    
    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getEtudiantId() { return etudiantId; }
    public void setEtudiantId(Integer etudiantId) { this.etudiantId = etudiantId; }
    
    public Integer getTypeId() { return typeId; }
    public void setTypeId(Integer typeId) { this.typeId = typeId; }
    
    public LocalDate getDateAbsence() { return dateAbsence; }
    public void setDateAbsence(LocalDate dateAbsence) { this.dateAbsence = dateAbsence; }
    
    public String getMotif() { return motif; }
    public void setMotif(String motif) { this.motif = motif; }
    
    public String getDocument() { return document; }
    public void setDocument(String document) { this.document = document; }
    
    public LocalDate getDateDepot() { return dateDepot; }
    public void setDateDepot(LocalDate dateDepot) { this.dateDepot = dateDepot; }
    
    public StatusJustification getStatus() { return status; }
    public void setStatus(StatusJustification status) { this.status = status; }
    
    public Integer getTraitePar() { return traitePar; }
    public void setTraitePar(Integer traitePar) { this.traitePar = traitePar; }
    
    public LocalDateTime getDateTraitement() { return dateTraitement; }
    public void setDateTraitement(LocalDateTime dateTraitement) { this.dateTraitement = dateTraitement; }
    
    public String getCommentaireAdmin() { return commentaireAdmin; }
    public void setCommentaireAdmin(String commentaireAdmin) { this.commentaireAdmin = commentaireAdmin; }
}