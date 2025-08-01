# Portfolio - Application Mono-serveur

Portfolio professionnel avec panneau d'administration, restructuré pour fonctionner sur un seul serveur.

## 🚀 Structure du projet

```
portfolio/
├── src/                    # Code source backend (Express + TypeScript)
├── frontend/              # Code source frontend (React + TypeScript + Vite)
├── dist/                  # Build de production (backend + frontend)
├── data/                  # Données JSON (projets, utilisateurs, config)
├── uploads/               # Fichiers uploadés (images, CV, etc.)
├── package.json           # Configuration principale
└── tsconfig.json          # Configuration TypeScript
```

## 📦 Installation

### Installation complète
```bash
npm install
npm run install:frontend
```

### Installation rapide (tout en une fois)
```bash
npm run build:production
```

## 🛠️ Développement

### Démarrer en mode développement (frontend + backend séparés)
```bash
npm run dev
```
- Frontend : http://localhost:3000
- Backend API : http://localhost:3001/api

### Démarrer seulement le backend
```bash
npm run dev:backend
```

### Démarrer seulement le frontend
```bash
npm run dev:frontend
```

## 🏗️ Production

### Build complet
```bash
npm run build
```

### Démarrer en production (mono-serveur)
```bash
npm start
```
- Application complète : http://localhost:3001
- API : http://localhost:3001/api

### Build avec script automatisé (Windows)
```bash
npm run build:production
# ou directement
./build.bat
```

## 🌐 Déploiement

### Pour Pterodactyl ou serveurs similaires

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd portfolio
```

2. **Configuration**
```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

3. **Installation et build**
```bash
npm install
npm run install:frontend
npm run build
```

4. **Démarrage**
```bash
npm start
```

### Variables d'environnement

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
NODE_ENV=production
```

## 🔐 Administration

### Connexion par défaut
- URL : http://localhost:3001/admin/login
- Username : `admin`
- Password : `admin123`

⚠️ **Important** : Changez le mot de passe administrateur après la première connexion !

## 📁 Structure des routes

### Frontend (SPA)
- `/` - Page d'accueil
- `/portfolio` - Portfolio des projets
- `/contact` - Page de contact
- `/admin/*` - Panneau d'administration

### API Backend
- `GET /api/projects` - Liste des projets
- `GET /api/config` - Configuration du site
- `POST /api/auth/login` - Connexion admin
- `POST /api/admin/*` - Routes d'administration
- `GET /api/cv/download` - Téléchargement du CV

## 🔧 Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm start` | Démarrer en production (mono-serveur) |
| `npm run dev` | Développement (frontend + backend) |
| `npm run build` | Build complet (backend + frontend) |
| `npm run build:backend` | Build seulement le backend |
| `npm run build:frontend` | Build seulement le frontend |
| `npm run clean` | Nettoyer les builds |

## 🎯 Avantages de cette structure

✅ **Un seul serveur** - Parfait pour Pterodactyl et hébergements simples  
✅ **Pas de CORS** - Frontend et backend sur le même domaine  
✅ **Simplicité** - Un seul port, une seule IP  
✅ **Performance** - Fichiers statiques servis directement  
✅ **Sécurité** - Pas d'exposition de ports multiples
npm install
cp .env.example .env
npm run dev
```

Le serveur démarre sur http://localhost:3001

### Frontend
```bash
cd frontend
npm install
npm start
```

L'application démarre sur http://localhost:3000

### Compte administrateur par défaut
- Username: `admin`
- Password: `admin123`