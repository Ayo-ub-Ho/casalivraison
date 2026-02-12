# 🍕 CasaLivraison – La Tech au Service du Goût

CasaLivraison est une application mobile de livraison premium basée à Casablanca.

L'application permet aux utilisateurs de :

- Consulter les restaurants à proximité
- Parcourir les menus librement
- Ajouter des produits au panier
- Passer commande via une identification par numéro de téléphone (OTP)
- Suivre le statut de leur livraison

---

# 🚀 Stack Technique

## 🔹 Backend

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT (authentification par téléphone)
- Docker

## 🔹 Mobile

- React Native (Expo)
- Axios
- React Navigation

## 🔹 DevOps

- Docker & Docker Compose
- GitHub Actions (CI)
- Build APK Android (Expo EAS)

---

# 📱 Fonctionnalités Principales

- Consultation des restaurants sans création de compte
- Filtrage par catégories
- Consultation détaillée des menus
- Panier dynamique
- Identification via numéro de téléphone (OTP simulé)
- Création et stockage des commandes
- Suivi de commande (En attente → Validée → Livrée)
- Historique des commandes
- Gestion offline (cache restaurants & panier)

---

# 📂 Structure du Projet

```
casalivraison/
│
├── backend/
│   ├── src/
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── mobile/
│   ├── src/
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

# ⚙️ Installation & Lancement

## 1️⃣ Cloner le projet

```bash
git clone https://github.com/Ayo-ub-Ho/casalivraison.git
cd casalivraison
```

---

## 2️⃣ Configuration des variables d’environnement

Créer un fichier `.env` dans le dossier `backend/` :

```env
PORT=5000
DB_HOST=db
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=casalivraison
DB_PORT=5432
JWT_SECRET=supersecretkey
```

---

# 🐳 Lancement avec Docker (Recommandé)

```bash
docker-compose up --build
```

API disponible sur :

```
http://localhost:5000
```

---

# 🖥 Lancement Backend sans Docker (optionnel)

```bash
cd backend
npm install
npm run dev
```

---

# 📱 Lancement Application Mobile

```bash
cd mobile
npm install
npm start
```

Scanner le QR code avec Expo Go.

---

# 🧪 Tests Backend

```bash
cd backend
npm run test
```

---

# 📦 Génération APK Android

```bash
eas build -p android
```

---

# 🔄 CI/CD

Le pipeline GitHub Actions :

- Installation automatique des dépendances
- Exécution des tests
- Validation du build
- Déclenchement à chaque push

---

# 🎯 Parcours Utilisateur

1. Ouverture de l’application
2. Autorisation de la localisation
3. Consultation des restaurants
4. Ajout de produits au panier
5. Saisie du numéro de téléphone
6. Vérification via code OTP
7. Confirmation de la commande
8. Suivi du statut de livraison

---

# 🎓 Objectif Pédagogique

Ce projet vise à démontrer :

- La conception d'une API REST robuste
- L'architecture d'une application mobile professionnelle
- La mise en place d'une base de données relationnelle
- La containerisation avec Docker
- L'automatisation CI/CD
- L'application des bonnes pratiques de développement

---

# 👨‍💻 AYYOUB

Projet réalisé dans le cadre de la formation  
**Développement Mobile – Simplon Academy**
