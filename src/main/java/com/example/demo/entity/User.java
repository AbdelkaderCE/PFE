package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, length = 100)
    private String nom;
    
    @Column(nullable = false, length = 100)
    private String prenom;
    
    // تجاهل حقل sexe مؤقتاً - سنستخدم SQL خام
    // private Sexe sexe; // لن نستخدمه
    
    @Column(name = "date_naissance")
    private LocalDate dateNaissance;
    
    @Column(length = 20)
    private String telephone;
    
    @Column(length = 255)
    private String photo;
    
    @Column(unique = true, nullable = false, length = 150)
    private String email;
    
    @Column(nullable = false, length = 255)
    private String password;
    
    @Column(name = "first_use")
    private Boolean firstUse = true;
    
    @Column(name = "email_verified")
    private Boolean emailVerified = false;
    
    @Column(name = "reset_token", length = 255)
    private String resetToken;
    
    @Column(name = "reset_token_expire")
    private LocalDateTime resetTokenExpire;
    
    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.active;
    
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
    
    @Column(name = "login_attempts")
    private Integer loginAttempts = 0;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<UserRole> userRoles;
    
    @OneToOne(mappedBy = "user")
    private Enseignant enseignant;
    
    @OneToOne(mappedBy = "user")
    private Etudiant etudiant;
    
    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    
    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }
    
    public LocalDate getDateNaissance() { return dateNaissance; }
    public void setDateNaissance(LocalDate dateNaissance) { this.dateNaissance = dateNaissance; }
    
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    
    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public Boolean getFirstUse() { return firstUse; }
    public void setFirstUse(Boolean firstUse) { this.firstUse = firstUse; }
    
    public Boolean getEmailVerified() { return emailVerified; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }
    
    public String getResetToken() { return resetToken; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }
    
    public LocalDateTime getResetTokenExpire() { return resetTokenExpire; }
    public void setResetTokenExpire(LocalDateTime resetTokenExpire) { this.resetTokenExpire = resetTokenExpire; }
    
    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
    
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
    
    public Integer getLoginAttempts() { return loginAttempts; }
    public void setLoginAttempts(Integer loginAttempts) { this.loginAttempts = loginAttempts; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<UserRole> getUserRoles() { return userRoles; }
    public void setUserRoles(List<UserRole> userRoles) { this.userRoles = userRoles; }
    
    public Enseignant getEnseignant() { return enseignant; }
    public void setEnseignant(Enseignant enseignant) { this.enseignant = enseignant; }
    
    public Etudiant getEtudiant() { return etudiant; }
    public void setEtudiant(Etudiant etudiant) { this.etudiant = etudiant; }
    
    public String getRoleName() {
        if (userRoles != null && !userRoles.isEmpty()) {
            return userRoles.get(0).getRole().getNom();
        }
        return "STUDENT";
    }
}