# 🍕 CasaLivraison – La Tech au Service du Goût

CasaLivraison est une application mobile de livraison premium basée à Casablanca.  
Elle permet aux utilisateurs de consulter les restaurants à proximité, parcourir les menus et passer commande rapidement via une identification par numéro de téléphone (OTP).

---

# 🚀 Stack Technique

## 🔹 Backend

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT (authentification via téléphone)
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

# 📱 Fonctionnalités

- Consultation des restaurants sans compte
- Filtrage par catégories
- Consultation des menus
- Panier dynamique
- Identification par numéro de téléphone (OTP)
- Création de commande
- Suivi de commande (En attente → Validée → Livrée)
- Historique des commandes
- Support offline (cache restaurants & panier)

---

# 📂 Structure du Projet

```
casalivraison/
│
├── backend/
│   ├── src/
│   ├── Dockerfile
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
git clone https://github.com/VOTRE_USERNAME/casalivraison.git
cd casalivraison
```

---

## 2️⃣ Lancer avec Docker (Backend + PostgreSQL)

```bash
docker-compose up --build
```

API disponible sur :

```
http://localhost:5000
```

---

## 3️⃣ Lancer l’application mobile

```bash
cd mobile
npm install
npm start
```

Scanner le QR code avec Expo Go.

---

# 🔐 Variables d’Environnement

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

# 🧪 Tests Backend

Dans le dossier `backend` :

```bash
npm run test
```

---

# 📦 Génération APK Android

```bash
eas build -p android
```

---

# 🐳 Docker

Pour lancer toute l’infrastructure :

```bash
docker-compose up
```

Pour arrêter :

```bash
docker-compose down
```

---

# 🔄 CI/CD

Le pipeline GitHub Actions :

- Installe les dépendances
- Lance les tests
- Vérifie le build
- S’exécute automatiquement à chaque push

---

# 🎯 Parcours Utilisateur

1. L’utilisateur ouvre l’application
2. Autorise la localisation
3. Consulte les restaurants
4. Ajoute des produits au panier
5. Saisit son numéro de téléphone
6. Vérifie via OTP
7. Confirme la commande
8. Suit le statut de livraison

---

# 👨‍💻 Auteur

Projet réalisé dans le cadre de la formation  
**Développement Mobile – Simplon Academy**

---

# 📌 Objectif Pédagogique

Développer une solution complète incluant :

- Architecture backend robuste
- Application mobile professionnelle
- Containerisation avec Docker
- Automatisation CI/CD
- Tests et qualité logicielle
