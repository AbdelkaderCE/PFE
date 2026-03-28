package com.example.demo.repository;

import com.example.demo.entity.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Integer> {
    
    Optional<Etudiant> findByMatricule(String matricule);
    
    Optional<Etudiant> findByUserId(Integer userId);
    
    @Query("SELECT e FROM Etudiant e WHERE e.promoId = :promoId")
    List<Etudiant> findByPromoId(@Param("promoId") Integer promoId);
    
    @Query("SELECT e FROM Etudiant e WHERE e.user.nom LIKE %:nom% OR e.user.prenom LIKE %:prenom%")
    List<Etudiant> searchByName(@Param("nom") String nom, @Param("prenom") String prenom);
}