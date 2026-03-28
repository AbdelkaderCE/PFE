package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.model.AuthRequest;
import com.example.demo.model.AuthResponse;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;  // مهم! لتنفيذ SQL خام

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            // ✅ استخدم SQL خام لتجاوز مشكلة ENUM
            String sql = "SELECT id, nom, prenom, email, password FROM users WHERE email = ?";
            List<Map<String, Object>> users = jdbcTemplate.queryForList(sql, request.getEmail());
            
            if (users.isEmpty()) {
                return ResponseEntity.badRequest().body("البريد الإلكتروني غير موجود");
            }
            
            Map<String, Object> userData = users.get(0);
            String password = (String) userData.get("password");
            
            // التحقق من كلمة المرور
            if (!passwordEncoder.matches(request.getPassword(), password)) {
                return ResponseEntity.badRequest().body("كلمة المرور غير صحيحة");
            }
            
            Integer userId = (Integer) userData.get("id");
            String nom = (String) userData.get("nom");
            String prenom = (String) userData.get("prenom");
            String email = (String) userData.get("email");
            
            // الحصول على الدور من جدول user_roles
            String roleSql = "SELECT r.nom FROM roles r " +
                             "JOIN user_roles ur ON r.id = ur.role_id " +
                             "WHERE ur.user_id = ?";
            List<Map<String, Object>> roles = jdbcTemplate.queryForList(roleSql, userId);
            String roleName = roles.isEmpty() ? "STUDENT" : (String) roles.get(0).get("nom");
            
            // تحديث آخر دخول باستخدام SQL خام
            String updateSql = "UPDATE users SET last_login = ? WHERE id = ?";
            jdbcTemplate.update(updateSql, LocalDateTime.now(), userId);
            
            // إنشاء التوكن
            String token = jwtUtil.generateToken(email, userId, roleName);
            
            return ResponseEntity.ok(new AuthResponse(
                token,
                userId,
                nom,
                prenom,
                email,
                roleName
            ));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("خطأ في تسجيل الدخول: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // التحقق من عدم وجود البريد الإلكتروني مسبقاً
        String checkSql = "SELECT COUNT(*) FROM users WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, user.getEmail());
        
        if (count != null && count > 0) {
            return ResponseEntity.badRequest().body("البريد الإلكتروني مستخدم بالفعل");
        }
        
        // تشفير كلمة المرور
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setStatus(com.example.demo.entity.UserStatus.active);
        
        // إدراج المستخدم باستخدام SQL خام
        String insertSql = "INSERT INTO users (nom, prenom, email, password, created_at, updated_at, status) " +
                           "VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id";
        
        Integer userId = jdbcTemplate.queryForObject(insertSql, Integer.class,
            user.getNom(),
            user.getPrenom(),
            user.getEmail(),
            user.getPassword(),
            user.getCreatedAt(),
            user.getUpdatedAt(),
            user.getStatus().name()
        );
        
        if (userId == null) {
            return ResponseEntity.badRequest().body("فشل إنشاء المستخدم");
        }
        
        user.setId(userId);
        
        // إضافة دور افتراضي للمستخدم الجديد (STUDENT role_id = 1)
        String roleSql = "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)";
        jdbcTemplate.update(roleSql, userId, 1);
        
        String roleName = "STUDENT";
        String token = jwtUtil.generateToken(user.getEmail(), userId, roleName);
        
        return ResponseEntity.ok(new AuthResponse(
            token,
            userId,
            user.getNom(),
            user.getPrenom(),
            user.getEmail(),
            roleName
        ));
    }
}