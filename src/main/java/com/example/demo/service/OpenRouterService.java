package com.example.demo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

@Service
public class OpenRouterService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // API Groq endpoint
    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

    public OpenRouterService(@Value("${groq.api.key}") String apiKey) {
        this.restClient = RestClient.builder()
            .baseUrl(GROQ_API_URL)
            .defaultHeader("Authorization", "Bearer " + apiKey)
            .defaultHeader("Content-Type", "application/json; charset=UTF-8")
            .build();
    }

    public String ask(String prompt, String sessionId) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "openai/gpt-oss-120b");
            requestBody.put("temperature", 0.7);
            requestBody.put("max_completion_tokens", 8192);
            requestBody.put("top_p", 1);
            
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", 
                "Vous etes un assistant intelligent du systeme G11. Vos reponses sont precises et utiles en francais."));
            messages.add(Map.of("role", "user", "content", prompt));
            requestBody.put("messages", messages);
            
            String response = restClient.post()
                .uri("")
                .body(requestBody)
                .retrieve()
                .body(String.class);

            JsonNode root = objectMapper.readTree(response);
            return root.path("choices").get(0).path("message").path("content").asText();

        } catch (Exception e) {
            e.printStackTrace();
            return "Desole, une erreur est survenue: " + e.getMessage();
        }
    }
    
    public String ask(String prompt) {
        return ask(prompt, null);
    }

    public String analyzeIntent(String question, String userContext, String dbSchema, String sessionId) {
        String prompt = String.format("""
            Vous etes un assistant intelligent specialise dans la conversion des questions en francais vers des requetes SQL.
            
            ## Informations utilisateur:
            %s
            
            ## Structure de la base de donnees:
            %s
            
            ## ⚠️ Regles importantes:
            1. L'etudiant ne peut voir que ses propres donnees
            2. L'enseignant peut voir ses etudiants et ses matieres (via promo_id)
            3. L'administrateur peut voir toutes les donnees
            4. La table "pfe_sujets" ne contient pas de colonne "etudiant_id"
            5. Utilisez etudiants.moyenne pour la moyenne generale
            6. Utilisez la table "voeux" pour l'orientation
            7. Utilisez la table "reclamations" pour les reclamations
            8. Utilisez la table "dossiers_disciplinaires" pour les dossiers disciplinaires
            
            ## Question:
            "%s"
            
            ## Repondez au format JSON:
            {
                "intent": "STUDENT_INFO | PFE_QUERY | JUSTIFICATION_QUERY | RECLAMATION_QUERY | DISCIPLINE_QUERY | VOEU_QUERY | TEACHER_MODULES | TEACHER_STUDENTS | GENERAL",
                "sql": "Requete SQL",
                "explanation": "Explication breve",
                "needs_formatting": true
            }
            """, userContext, dbSchema, question);
        
        return ask(prompt, sessionId);
    }
    public String analyzeIntentForAdmin(String question, String userContext, String dbSchema, String sessionId) {
        String prompt = String.format("""
            أنت مساعد ذكي متخصص في تحويل الأسئلة إلى استعلامات SQL.
            
            أنت الآن تتحدث مع **مدير النظام**.
            لديك صلاحية الوصول إلى **جميع البيانات** في قاعدة البيانات.
            
            ## معلومات عن المستخدم:
            %s
            
            ## هيكل قاعدة البيانات:
            %s
            
            ## مهمتك:
            1. افهم السؤال مهما كانت لغته (عربية، فرنسية، إنجليزية)
            2. حدد ما يريد المستخدم
            3. أنشئ استعلام SQL صحيح
            4. لا تضع أي قيود أو شروط غير ضرورية
            
            ## السؤال:
            "%s"
            
            ## أجب بصيغة JSON:
            {
                "intent": "نوع الطلب",
                "sql": "استعلام SQL",
                "explanation": "شرح مختصر",
                "needs_formatting": true
            }
            """, userContext, dbSchema, question);
        
        return ask(prompt, sessionId);
    }

    public String getFullDatabaseSchemaForAdmin() {
        return """
            ═══════════════════════════════════════════════════════════════
            Structure complete de la base de donnees (Vue Administrateur)
            ═══════════════════════════════════════════════════════════════
            
            📌 **Tables utilisateurs et roles:**
            - users(id, nom, prenom, email, password, status)
            - roles(id, nom)
            - user_roles(user_id, role_id)
            
            📌 **Tables etudiants et enseignants:**
            - etudiants(id, user_id, matricule, moyenne, promo_id)
            - enseignants(id, user_id, grade_id, bureau)
            - grades(id, nom)
            
            📌 **Tables academiques:**
            - modules(id, nom, code, semestre, coef, specialite_id)
            - enseignements(id, enseignant_id, module_id, promo_id, type)
            - promos(id, nom, specialite_id, annee_universitaire)
            - specialites(id, nom, filiere_id, niveau)
            - filieres(id, nom, departement_id)
            - departements(id, nom, faculte_id)
            - facultes(id, nom)
            
            📌 **Tables PFE:**
            - pfe_sujets(id, titre, description, enseignant_id, promo_id, status)
            - groups_pfe(id, nom, sujet_final_id)
            - group_members(id, group_id, etudiant_id)
            
            📌 **Tables reclamations et justifications:**
            - reclamations(id, etudiant_id, objet, description, status)
            - justifications(id, etudiant_id, date_absence, motif, status)
            
            📌 **Tables orientation:**
            - campagne_affectation(id, nom, status)
            - voeux(id, etudiant_id, specialite_id, ordre, status)
            
            📌 **Tables disciplinaires:**
            - dossiers_disciplinaires(id, etudiant_id, infraction_id, status)
            - infractions(id, nom)
            """;
    }
    
    public String getFullDatabaseSchema() {
        return """
            ═══════════════════════════════════════════════════════════════
            Structure complete de la base de donnees (G11 Education)
            ═══════════════════════════════════════════════════════════════
            
            📌 Tables utilisateurs et roles:
            - users(id, nom, prenom, email, password, status)
            - roles(id, nom)
            - user_roles(user_id, role_id)
            
            📌 Tables etudiants et enseignants:
            - etudiants(id, user_id, matricule, moyenne, promo_id)
            - enseignants(id, user_id, grade_id, bureau)
            - grades(id, nom)
            
            📌 Tables academiques:
            - modules(id, nom, code, semestre, coef, specialite_id)
            - enseignements(id, enseignant_id, module_id, promo_id, type)
            - promos(id, nom, specialite_id, annee_universitaire)
            - specialites(id, nom, filiere_id, niveau)
            - filieres(id, nom, departement_id)
            - departements(id, nom, faculte_id)
            - facultes(id, nom)
            
            📌 Tables PFE:
            - pfe_sujets(id, titre, description, enseignant_id, promo_id, status)
            - groups_pfe(id, nom, sujet_final_id)
            - group_members(id, group_id, etudiant_id)
            
            📌 Tables reclamations et justifications:
            - reclamations(id, etudiant_id, objet, description, status)
            - justifications(id, etudiant_id, date_absence, motif, status)
            
            📌 Tables orientation:
            - campagne_affectation(id, nom, status)
            - voeux(id, etudiant_id, specialite_id, ordre, status)
            
            📌 Tables disciplinaires:
            - dossiers_disciplinaires(id, etudiant_id, infraction_id, status)
            - infractions(id, nom)
            """;
    }
}