package com.example.demo.repository;

import com.example.demo.entity.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EnseignantRepository extends JpaRepository<Enseignant, Integer> {
    Optional<Enseignant> findByUserId(Integer userId);
}