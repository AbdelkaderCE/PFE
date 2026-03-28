package com.example.demo.repository;

import com.example.demo.entity.Justification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JustificationRepository extends JpaRepository<Justification, Integer> {
    List<Justification> findByEtudiantId(Integer etudiantId);
    List<Justification> findByStatus(String status);
}