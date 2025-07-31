# Portfolio Professionnel

Site web portfolio développé selon le cahi### Configuration

### Variables d'environnement (backend)
- `JWT_SECRET` : Clé secrète pour les tokens JWT
- `PORT` : Port du serveur (défaut: 3001)
- `FRONTEND_URL` : URL du frontend pour CORS

### Structure des données JSON

Les données sont stockées dans `backend/data/` :
- `users.json` : Utilisateurs administrateurs
- `projects.json` : Projets du portfolio
- `config.json` : Configuration générale avec React/TypeScript en frontend et Express/Node.js en backend.

## Architecture

```
portfolio/
├── backend/          # API Express + TypeScript
│   ├── src/
│   ├── data/         # Stockage JSON
│   └── uploads/      # Fichiers uploadés
├── frontend/         # Application React + TypeScript
│   ├── src/
│   └── public/
└── README.md
```

## Fonctionnalités

### Frontend Public
- **Page d'accueil** : Présentation personnalisée avec contenu markdown éditable
- **Portfolio** : Galerie de projets avec différents niveaux de visibilité
- **Design** : Interface sobre, moderne et responsive avec Tailwind CSS

### Panel Administrateur
- **Authentification** : Système de login sécurisé avec JWT
- **Gestion des projets** : CRUD complet avec upload d'images
- **Configuration** : Édition de la page d'accueil et des réseaux sociaux
- **Upload de fichiers** : Gestion des images et du CV

### Backend API
- **API REST** : Routes publiques et protégées
- **Authentification** : JWT avec middleware de sécurité
- **Stockage** : Données JSON structurées par fichiers
- **Upload** : Gestion des fichiers avec Multer
- **Sécurité** : Helmet, CORS, rate limiting

## Installation et Démarrage

### Prérequis
- Node.js 16+
- npm ou yarn

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Le serveur démarre sur http://localhost:3001

**Compte admin par défaut :**
- Username: `admin`
- Password: `admin123`

### Frontend

```bash
cd frontend
npm install
npm start
```

L'application démarre sur http://localhost:3000

## Configuration

### Variables d'environnement (backend)
- `JWT_SECRET` : Clé secrète pour les tokens JWT
- `PORT` : Port du serveur (défaut: 3001)
- `FRONTEND_URL` : URL du frontend pour CORS

### Structure des données JSON

Les données sont stockées dans `backend/data/` :
- `users.json` : Utilisateurs administrateurs
- `projects.json` : Projets du portfolio
- `blog-posts.json` : Articles de blog
- `config.json` : Configuration générale

## API Endpoints

### Publiques
- `GET /api/config` : Configuration du site
- `GET /api/projects` : Projets publics
- `POST /api/auth/login` : Connexion

### Administrateur (JWT requis)
- `POST /api/admin/projects` : Créer un projet
- `PUT /api/admin/projects/:id` : Modifier un projet
- `DELETE /api/admin/projects/:id` : Supprimer un projet
- `PUT /api/admin/config/homepage` : Modifier la page d'accueil

## Technologies

### Frontend
- React 18 + TypeScript
- React Router v6
- Tailwind CSS
- Axios pour les requêtes API
- React Markdown pour l'affichage
- Lucide React pour les icônes

### Backend
- Express + TypeScript
- JWT pour l'authentification
- Bcrypt pour le hashage des mots de passe
- Multer pour l'upload de fichiers
- Helmet pour la sécurité
- CORS et rate limiting

## Sécurité

- JWT avec expiration 24h
- Mots de passe hashés avec bcrypt
- Validation des uploads (types et tailles)
- Rate limiting sur toutes les routes
- Headers de sécurité avec Helmet
- Validation des entrées côté backend

## Production

### Backend
```bash
npm run build
npm start
```

### Frontend
```bash
npm run build
```

Servir le dossier `build` avec un serveur web (nginx, Apache, etc.)

## Développement

Le projet est configuré avec hot-reload pour le développement :
- Backend : `ts-node-dev` pour le rechargement automatique
- Frontend : Create React App avec Fast Refresh

## Footer

Le footer inclut automatiquement :
- Lien vers "Let's PopP !" (https://lets-pop.fr/)
- Réseaux sociaux configurables via le panel admin
Simple portfolio website
