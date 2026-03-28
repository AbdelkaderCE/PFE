# 🤖 G11 Smart Chatbot - Assistant Intelligent

Assistant intelligent basé sur l'IA (GPT-OSS-120B via Groq API) qui répond aux questions des étudiants, enseignants et administrateurs dans le système éducatif G11.

---

## 🚀 Prérequis

| Prérequis | Version |
|-----------|---------|
| Java | 21 |
| Spring Boot | 3.2.4 |
| PostgreSQL | 15+ |
| Maven | 3.9+ |
| Clé API Groq | (gratuite) |

---

## 🔧 Installation et Démarrage

### 1. Configuration de la base de données

```sql
-- La base de données existe déjà dans le projet principal
-- Le chatbot utilise la base de données commune
2. Configuration du fichier application.properties
properties
# Serveur
server.port=8081

# JWT
jwt.secret=your_real_key
jwt.expiration=86400000

# API Groq (gratuit)
groq.api.key=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Base de données (identique au projet principal)
spring.datasource.url=jdbc:postgresql://localhost:5432/g11_education?useUnicode=true&characterEncoding=UTF-8
spring.datasource.username=postgres
spring.datasource.password=votre_mot_de_passe
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Encodage
server.servlet.encoding.charset=UTF-8
server.servlet.encoding.force=true
spring.jackson.encoding=UTF-8
3. Démarrer l'application
bash
# Dans le dossier du projet
cd chatbot_backend

# Avec Maven
mvn spring-boot:run

# Ou avec Eclipse/IntelliJ
# Run As → Spring Boot App
4. Ouvrir l'interface
Dans le navigateur :

text
http://localhost:5500/indexchatbot.html
📝 Comptes de test
Rôle	Email	Mot de passe
Étudiant	mohamed@example.com	password123
Étudiant	sara@example.com	password123
Étudiant	ahmed@example.com	password123
Enseignant	ali.teacher@example.com	password123
Administrateur	admin@example.com	password123
🧠 Comment fonctionne le Chatbot ?
👨‍🎓 Pour l'Étudiant (STUDENT)
Accès uniquement à ses propres données

Peut demander : sa moyenne, ses projets PFE, ses justifications, ses réclamations, ses vœux

Ne voit pas les données des autres étudiants

👨‍🏫 Pour l'Enseignant (TEACHER)
Accès à ses étudiants (ceux dans les promotions qu'il enseigne)

Peut demander : la liste de ses étudiants, ses matières, ses projets PFE

Peut voir les réclamations et justifications de ses étudiants

👑 Pour l'Administrateur (ADMIN)
Accès à TOUTES les données du système

Peut demander : statistiques, listes complètes, n'importe quelle information

🔄 Intégration avec le projet principal
Le chatbot utilise la MÊME base de données que le projet principal !

✅ Quand un nouvel enseignant est ajouté dans le site → le chatbot répond automatiquement à ses questions

✅ Quand de nouveaux étudiants sont ajoutés → ils apparaissent dans les réponses de l'enseignant

✅ Quand de nouveaux projets PFE sont ajoutés → ils apparaissent dans les réponses

✅ Aucune modification du code du chatbot n'est nécessaire

Le chatbot interroge directement la base de données partagée. Tout est automatique !

📂 Structure du projet
text
chatbot_backend/
├── src/main/java/com/example/demo/
│   ├── controller/
│   │   ├── ChatController.java          # Point d'entrée API
│   │   └── AuthController.java          # Authentification
│   ├── service/
│   │   ├── ChatService.java             # Logique du chatbot
│   │   └── OpenRouterService.java       # Connexion à Groq API
│   ├── repository/
│   │   └── ...                          # Accès à la base de données
│   ├── entity/
│   │   └── ...                          # Entités JPA
│   └── security/
│       └── ...                          # JWT et sécurité
├── src/main/resources/
│   └── application.properties           # Configuration
├── src/main/webapp/
│   └── indexchatbot.html                # Interface utilisateur
└── pom.xml                              # Dépendances
🛠️ API Endpoints
Méthode	Endpoint	Description
POST	/auth/login	Connexion
POST	/auth/register	Création de compte
POST	/chat	Envoyer une question
GET	/chat/test-ai	Tester la connexion AI
💬 Exemples de questions
Pour l'étudiant
"Donne-moi mes informations"

"Quelle est ma moyenne ?"

"Mes projets PFE"

"Mes justifications d'absence"

"Mes réclamations"

"Mes vœux d'orientation"

Pour l'enseignant
"Liste de mes étudiants"

"Mes matières"

"Mes projets PFE"

"Les justifications de mes étudiants"

"Les réclamations de mes étudiants"

Pour l'administrateur
"Nombre d'étudiants"

"Liste de tous les étudiants"

"Toutes les matières"

"Toutes les réclamations"

"Statistiques du système"

❓ Questions fréquentes
Comment changer le modèle IA ?
Dans OpenRouterService.java, modifiez la valeur model :

java
requestBody.put("model", "openai/gpt-oss-120b"); // Groq
// ou requestBody.put("model", "openai/gpt-3.5-turbo");
Le chatbot ne répond pas ?
Vérifiez que la clé API Groq est correcte

Vérifiez que PostgreSQL est démarré

Vérifiez que la base de données contient des données

Consultez les logs dans la console

Comment intégrer le chatbot dans le site principal ?
Copiez le fichier indexchatbot.html dans le site, ou utilisez directement l'API.

👨‍💻 Pour les développeurs
Ajouter une nouvelle fonctionnalité
L'IA comprend les questions automatiquement. Si vous voulez ajouter une logique spécifique, modifiez ChatService.java.

Modifier le comportement de l'IA
Modifiez le prompt dans OpenRouterService.java.

📄 Licence
Ce projet est destiné à un usage académique dans le cadre du projet G11.

Réalisé par : Groupe 11 - ISIL
Date : 2026


