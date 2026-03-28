package com.example.demo.repository;

import com.example.demo.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Integer> {
    
    Optional<Module> findByCode(String code);
    
    @Query("SELECT m FROM Module m WHERE m.nom LIKE %:nom%")
    List<Module> searchByName(@Param("nom") String nom);
    
    List<Module> findBySpecialiteId(Integer specialiteId);
}