package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;

@Service
public class ChatService {

    @Autowired
    private OpenRouterService openRouterService;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EtudiantRepository etudiantRepository;
    
    @Autowired
    private EnseignantRepository enseignantRepository;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    private static final List<Pattern> DANGEROUS_PATTERNS = List.of(
        Pattern.compile("(?i)\\bDROP\\b"),
        Pattern.compile("(?i)\\bDELETE\\b"),
        Pattern.compile("(?i)\\bUPDATE\\b"),
        Pattern.compile("(?i)\\bINSERT\\b"),
        Pattern.compile("(?i)\\bALTER\\b"),
        Pattern.compile("(?i)\\bCREATE\\b"),
        Pattern.compile("(?i)\\bTRUNCATE\\b")
    );

    // ==================== Point d'entree principal ====================
    
    public String getReply(String message, String sessionId) {
        try {
            User currentUser = getCurrentUser();
            String roleName = currentUser.getRoleName();
            
            System.out.println("👤 Utilisateur: " + currentUser.getNom() + " " + currentUser.getPrenom() + " (" + roleName + ")");
            System.out.println("💬 Question: " + message);
            
            // Questions generales
            String generalResponse = handleGeneralQuestions(message, currentUser);
            if (generalResponse != null) {
                return generalResponse;
            }
            
            // Traitement selon le role
            switch (roleName.toUpperCase()) {
                case "STUDENT":
                    return handleStudentRequest(message, currentUser, sessionId);
                case "TEACHER":
                    return handleTeacherRequest(message, currentUser, sessionId);
                case "ADMIN":
                    return handleAdminRequest(message, currentUser, sessionId);
                default:
                    return "⚠️ Role utilisateur non reconnu.";
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            return "⚠️ Erreur technique: " + e.getMessage();
        }
    }
    
    // ==================== Questions generales ====================
    
    private String handleGeneralQuestions(String message, User user) {
        String lowerMsg = message.toLowerCase();
        
        if (lowerMsg.matches(".*\\b(سلام|مرحبا|اهلا|صباح الخير|مساء الخير|salut|bonjour|hello|hi|hellow)\\b.*")) {
            return "👋 **Bonjour " + fixEncoding(user.getPrenom()) + "!**\n\n" +
                   "Je suis l'assistant intelligent du systeme G11.\n" +
                   "Posez-moi n'importe quelle question sur les matieres, les etudiants, les projets, ou les reclamations.\n\n" +
                   "**Comment puis-je vous aider aujourd'hui ?**";
        }
        
        if (lowerMsg.matches(".*\\b(شكرا|merci|thanks|thank you)\\b.*")) {
            return "✨ **De rien!** ✨\n\nJe suis la pour vous aider a tout moment.";
        }
        
        if (lowerMsg.matches(".*\\b(مع السلامة|باي|bye|au revoir)\\b.*") && message.length() < 30) {
            return "👋 **Au revoir " + fixEncoding(user.getPrenom()) + "!**\n\nPassez une bonne journee.";
        }
        
        if (lowerMsg.matches(".*\\b(مساعدة|help|aide|ماذا يمكنك أن تفعل)\\b.*")) {
            return generateHelpMessage(user);
        }
        
        return null;
    }
    
    private String generateHelpMessage(User user) {
        String role = user.getRoleName();
        StringBuilder help = new StringBuilder();
        
        help.append("🤖 **Guide d'utilisation de l'assistant intelligent**\n\n");
        
        if ("STUDENT".equals(role)) {
            help.append("**📚 En tant qu'etudiant, vous pouvez demander:**\n");
            help.append("• Donne-moi mes informations\n");
            help.append("• Quelles sont mes matieres ?\n");
            help.append("• Mes projets PFE\n");
            help.append("• Mes reclamations\n");
            help.append("• Mes justifications d'absence\n");
            help.append("• Mes vœux d'orientation\n");
            help.append("• Mon dossier disciplinaire\n");
        } 
        else if ("TEACHER".equals(role)) {
            help.append("**👨‍🏫 En tant qu'enseignant, vous pouvez demander:**\n");
            help.append("• Donne-moi mes matieres\n");
            help.append("• Liste de mes etudiants\n");
            help.append("• Les points de mes etudiants\n");
            help.append("• Mes projets PFE\n");
            help.append("• Les justifications de mes etudiants\n");
            help.append("• Les reclamations de mes etudiants\n");
        }
        else if ("ADMIN".equals(role)) {
            help.append("**👑 En tant qu'administrateur, vous pouvez demander:**\n");
            help.append("• Nombre d'etudiants\n");
            help.append("• Nombre d'enseignants\n");
            help.append("• Liste de tous les etudiants\n");
            help.append("• Liste de tous les enseignants\n");
            help.append("• Toutes les matieres\n");
            help.append("• Tous les projets PFE\n");
            help.append("• Toutes les reclamations\n");
            help.append("• Toutes les justifications\n");
            help.append("• Statistiques du systeme\n");
        }
        
        return help.toString();
    }
    
    // ==================== Contexte utilisateur ====================
    
    private String buildStudentContext(User user) {
        StringBuilder context = new StringBuilder();
        context.append("Utilisateur actuel (etudiant):\n");
        context.append("- USER_ID: ").append(user.getId()).append("\n");
        context.append("- Nom: ").append(fixEncoding(user.getNom())).append("\n");
        context.append("- Prenom: ").append(fixEncoding(user.getPrenom())).append("\n");
        context.append("- Email: ").append(user.getEmail()).append("\n");
        context.append("- Role: STUDENT\n\n");
        
        etudiantRepository.findByUserId(user.getId()).ifPresent(etudiant -> {
            context.append("- ETUDIANT_ID: ").append(etudiant.getId()).append("\n");
            context.append("- Matricule: ").append(etudiant.getMatricule()).append("\n");
            context.append("- Moyenne: ").append(etudiant.getMoyenne()).append("/20\n");
            if (etudiant.getPromoId() != null) {
                context.append("- PROMO_ID: ").append(etudiant.getPromoId()).append("\n");
            }
        });
        
        return context.toString();
    }
    
    private String buildTeacherContext(User user) {
        StringBuilder context = new StringBuilder();
        context.append("Utilisateur actuel (enseignant):\n");
        context.append("- USER_ID: ").append(user.getId()).append("\n");
        context.append("- Nom: ").append(fixEncoding(user.getNom())).append("\n");
        context.append("- Prenom: ").append(fixEncoding(user.getPrenom())).append("\n");
        context.append("- Email: ").append(user.getEmail()).append("\n");
        context.append("- Role: TEACHER\n\n");
        
        enseignantRepository.findByUserId(user.getId()).ifPresent(enseignant -> {
            context.append("- ENSEIGNANT_ID: ").append(enseignant.getId()).append("\n");
            context.append("- Bureau: ").append(enseignant.getBureau() != null ? enseignant.getBureau() : "Non specifie").append("\n");
        });
        
        return context.toString();
    }
    
    private String buildAdminContext(User user) {
        StringBuilder context = new StringBuilder();
        context.append("Vous etes l'ADMINISTRATEUR du systeme G11.\n");
        context.append("- USER_ID: ").append(user.getId()).append("\n");
        context.append("- Nom: ").append(fixEncoding(user.getNom())).append("\n");
        context.append("- Prenom: ").append(fixEncoding(user.getPrenom())).append("\n");
        context.append("- Email: ").append(user.getEmail()).append("\n");
        context.append("- Role: ADMIN\n\n");
        context.append("⚠️ **L'administrateur a acces a TOUTES les donnees du systeme.**\n");
        context.append("Il peut voir:\n");
        context.append("- Tous les etudiants\n");
        context.append("- Tous les enseignants\n");
        context.append("- Tous les modules\n");
        context.append("- Tous les projets PFE\n");
        context.append("- Toutes les reclamations\n");
        context.append("- Toutes les justifications\n");
        context.append("- Tous les dossiers disciplinaires\n");
        
        return context.toString();
    }
    
    // ==================== Traitement par role ====================
    
    private String handleStudentRequest(String message, User user, String sessionId) {
        String userContext = buildStudentContext(user);
        String fullSchema = openRouterService.getFullDatabaseSchema();
        return processRequest(message, user, userContext, fullSchema, sessionId);
    }
    
    private String handleTeacherRequest(String message, User user, String sessionId) {
        String userContext = buildTeacherContext(user);
        String fullSchema = openRouterService.getFullDatabaseSchema();
        return processRequest(message, user, userContext, fullSchema, sessionId);
    }
    
    private String handleAdminRequest(String message, User user, String sessionId) {
        String userContext = buildAdminContext(user);
        String fullSchema = openRouterService.getFullDatabaseSchemaForAdmin();
        return processAdminRequest(message, user, userContext, fullSchema, sessionId);
    }
    
    // ==================== Traitement principal ====================
    
    private String processRequest(String message, User user, String userContext, String dbSchema, String sessionId) {
        try {
            String analysis = openRouterService.analyzeIntent(message, userContext, dbSchema, sessionId);
            System.out.println("🧠 Analyse IA: " + analysis);
            
            JsonNode analysisNode = objectMapper.readTree(analysis);
            String intent = analysisNode.path("intent").asText();
            String sql = analysisNode.has("sql") && !analysisNode.path("sql").isNull() ? 
                         analysisNode.path("sql").asText() : null;
            
            System.out.println("🎯 Intention detectee: " + intent);
            
            if ("GENERAL".equals(intent) || sql == null || sql.isEmpty()) {
                return handleGeneralAIChat(message, user, sessionId);
            }
            
            sql = cleanAndValidateSql(sql);
            
            if (!isSqlAllowed(sql)) {
                return "⛔ Cette requete n'est pas autorisee pour des raisons de securite.";
            }
            
            sql = replacePlaceholders(sql, user);
            
            System.out.println("📝 SQL execute: " + sql);
            
            List<Map<String, Object>> results = jdbcTemplate.queryForList(sql);
            
            System.out.println("📊 Nombre de resultats: " + results.size());
            
            if (results.isEmpty()) {
                return getEmptyResultMessage(intent, user);
            }
            
            return formatResultsWithAI(message, results, user, sessionId);
            
        } catch (Exception e) {
            e.printStackTrace();
            return "⚠️ **Erreur**\n\n" + e.getMessage();
        }
    }
    
    private String processAdminRequest(String message, User user, String userContext, String dbSchema, String sessionId) {
        try {
            String analysis = openRouterService.analyzeIntentForAdmin(message, userContext, dbSchema, sessionId);
            System.out.println("🧠 Analyse IA (Admin): " + analysis);
            
            JsonNode analysisNode = objectMapper.readTree(analysis);
            String intent = analysisNode.path("intent").asText();
            String sql = analysisNode.has("sql") && !analysisNode.path("sql").isNull() ? 
                         analysisNode.path("sql").asText() : null;
            
            System.out.println("🎯 Intention detectee (Admin): " + intent);
            
            if ("GENERAL".equals(intent) || sql == null || sql.isEmpty()) {
                return handleGeneralAIChat(message, user, sessionId);
            }
            
            sql = cleanAndValidateSql(sql);
            
            if (!isSqlAllowed(sql)) {
                return "⛔ Cette requete n'est pas autorisee pour des raisons de securite.";
            }
            
            System.out.println("📝 SQL execute (Admin): " + sql);
            
            List<Map<String, Object>> results = jdbcTemplate.queryForList(sql);
            
            System.out.println("📊 Nombre de resultats: " + results.size());
            
            if (results.isEmpty()) {
                return getEmptyResultMessageForAdmin(intent);
            }
            
            return formatResultsWithAI(message, results, user, sessionId);
            
        } catch (Exception e) {
            e.printStackTrace();
            return "⚠️ **Erreur**\n\n" + e.getMessage();
        }
    }
    
    // ==================== Formatage des resultats ====================
    
    private String formatResultsWithAI(String originalQuestion, List<Map<String, Object>> results, User user, String sessionId) {
        StringBuilder resultsText = new StringBuilder();
        resultsText.append("Resultats (").append(results.size()).append(" enregistrements):\n\n");
        
        for (Map<String, Object> row : results) {
            for (Map.Entry<String, Object> entry : row.entrySet()) {
                resultsText.append(entry.getKey()).append(": ").append(entry.getValue()).append("\n");
            }
            resultsText.append("---\n");
        }
        
        String prompt = String.format("""
            Vous etes un assistant intelligent du systeme G11.
            
            Utilisateur: %s %s (%s)
            
            Question originale: "%s"
            
            Resultats obtenus:
            %s
            
            **Instructions:**
            Organisez ces resultats dans une reponse agreable et professionnelle.
            - Utilisez un tableau si plusieurs resultats
            - Utilisez des points si c'est une liste simple
            - Repondez directement si un seul resultat
            - Ne mentionnez pas SQL ou details techniques
            - Utilisez des icones appropriees (📚, 👨‍🎓, 📄, 📊)
            
            Repondez maintenant:
            """, 
            fixEncoding(user.getNom()), 
            fixEncoding(user.getPrenom()), 
            user.getRoleName(),
            originalQuestion,
            resultsText.toString());
        
        String formattedResponse = openRouterService.ask(prompt, sessionId);
        formattedResponse = formattedResponse.replaceAll("```json\\s*", "")
                .replaceAll("```\\s*", "")
                .trim();
    
        return formattedResponse;
    }
    
    // ==================== Questions generales IA ====================
    
    private String handleGeneralAIChat(String message, User user, String sessionId) {
        String prompt = String.format("""
            Vous etes un assistant intelligent du systeme G11.
            
            Utilisateur: %s %s (%s)
            Question: %s
            
            Repondez de maniere amicale et utile en francais.
            """, 
            fixEncoding(user.getNom()), 
            fixEncoding(user.getPrenom()), 
            user.getRoleName(), 
            message);
        
        return openRouterService.ask(prompt, sessionId);
    }
    
    // ==================== Remplacement des placeholders ====================
    
    private String replacePlaceholders(String sql, User user) {
        String role = user.getRoleName();
        String result = sql;
        
        result = result.replace("[USER_ID]", String.valueOf(user.getId()));
        
        if ("STUDENT".equals(role)) {
            Integer etudiantId = etudiantRepository.findByUserId(user.getId())
                .map(Etudiant::getId)
                .orElse(null);
            if (etudiantId != null) {
                result = result.replace("[ETUDIANT_ID]", String.valueOf(etudiantId));
            }
        }
        
        if ("TEACHER".equals(role)) {
            Integer enseignantId = enseignantRepository.findByUserId(user.getId())
                .map(Enseignant::getId)
                .orElse(null);
            if (enseignantId != null) {
                result = result.replace("[ENSEIGNANT_ID]", String.valueOf(enseignantId));
            }
        }
        
        if (result.contains("[") && result.contains("]")) {
            result = result.replaceAll("\\[.*?\\]", "1=0");
        }
        
        return result;
    }
    
    // ==================== Validation SQL ====================
    
    private String cleanAndValidateSql(String sql) {
        if (sql == null) return null;
        sql = sql.replace("`", "").trim();
        if (!sql.toLowerCase().startsWith("select")) return null;
        return sql;
    }
    
    private boolean isSqlAllowed(String sql) {
        if (sql == null) return false;
        String upperSql = sql.toUpperCase();
        for (Pattern pattern : DANGEROUS_PATTERNS) {
            if (pattern.matcher(upperSql).find()) return false;
        }
        return true;
    }
    
    // ==================== Messages vides ====================
    
    private String getEmptyResultMessage(String intent, User user) {
        switch (intent) {
            case "PFE_QUERY":
                return "📭 Aucun projet PFE**\n\nAucun projet n'est enregistre actuellement.";
            case "TEACHER_MODULES":
                return "📭 Aucune matiere**\n\nVous n'enseignez aucune matiere pour le moment.";
            case "TEACHER_STUDENTS":
                return "👨‍🎓 **Aucun etudiant**\n\nAucun etudiant n'est inscrit dans vos matieres.";
            case "STUDENT_INFO":
                return "👤 Informations etudiant**\n\nVos informations ne sont pas completes dans le systeme.";
            case "RECLAMATION_QUERY":
                return "📝Aucune reclamation**\n\nVous n'avez soumis aucune reclamation.";
            case "JUSTIFICATION_QUERY":
                return "📭 Aucune justification**\n\nAucune justification d'absence n'est enregistree.";
            case "VOEU_QUERY":
                return "📭 **Aucun vœu**\n\nVous n'avez enregistre aucun vœu d'orientation.";
            default:
                return "📭 **Aucun resultat**\n\nAucune donnee trouvee pour votre demande.";
        }
    }
    
    private String getEmptyResultMessageForAdmin(String intent) {
        switch (intent) {
            case "STUDENT_COUNT":
                return "0";
            case "TEACHER_COUNT":
                return "0";
            case "STUDENT_LIST":
                return "📭 **Aucun etudiant**\n\nAucun etudiant n'est enregistre dans le systeme.";
            case "TEACHER_LIST":
                return "📭 **Aucun enseignant**\n\nAucun enseignant n'est enregistre dans le systeme.";
            case "MODULE_LIST":
                return "📭 **Aucun module**\n\nAucun module n'est enregistre dans le systeme.";
            case "PFE_LIST":
                return "📭 **Aucun projet PFE**\n\nAucun projet n'est enregistre dans le systeme.";
            case "JUSTIFICATION_LIST":
                return "📭 **Aucune justification**\n\nAucune justification d'absence n'est enregistree.";
            case "RECLAMATION_LIST":
                return "📭 **Aucune reclamation**\n\nAucune reclamation n'est enregistree.";
            default:
                return "📭 **Aucun resultat**\n\nAucune donnee trouvee pour votre demande.";
        }
    }
    
    // ==================== Methodes utilitaires ====================
    
    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;
        
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }
        
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouve"));
    }
    
    public String fixEncoding(String text) {
        if (text == null || text.isEmpty()) return "";
        try {
            byte[] bytes = text.getBytes("ISO-8859-1");
            String fixed = new String(bytes, "UTF-8");
            if (fixed.matches(".*[\\u0600-\\u06FF].*")) {
                return fixed;
            }
            return fixed;
        } catch (Exception e) {
            return text;
        }
    }
    
    public Map<String, Object> getCurrentUserInfo() {
        User user = getCurrentUser();
        Map<String, Object> info = new HashMap<>();
        info.put("id", user.getId());
        info.put("nom", fixEncoding(user.getNom()));
        info.put("prenom", fixEncoding(user.getPrenom()));
        info.put("email", user.getEmail());
        info.put("role", user.getRoleName());
        return info;
    }
}