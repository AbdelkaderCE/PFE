package com.example.demo.repository;

import com.example.demo.entity.PfeSujet;
import com.example.demo.entity.StatusSujet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PfeSujetRepository extends JpaRepository<PfeSujet, Integer> {
    List<PfeSujet> findByStatus(StatusSujet status);
    List<PfeSujet> findByEnseignantId(Integer enseignantId);
    List<PfeSujet> findByPromoId(Integer promoId);
}