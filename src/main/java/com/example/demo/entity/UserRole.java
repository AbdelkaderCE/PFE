package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_roles")
public class UserRole {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "user_id")
    private Integer userId;
    
    @Column(name = "role_id")
    private Integer roleId;
    
    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "role_id", insertable = false, updatable = false)
    private Role role;
    
    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    
    public Integer getRoleId() { return roleId; }
    public void setRoleId(Integer roleId) { this.roleId = roleId; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}