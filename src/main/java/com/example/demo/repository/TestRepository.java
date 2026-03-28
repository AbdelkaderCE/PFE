package com.example.demo.repository;

import org.springframework.stereotype.Repository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;

@Repository
public class TestRepository {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    public List<String> getTableNames() {
        String sql = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'";
        return entityManager.createNativeQuery(sql).getResultList();
    }
}