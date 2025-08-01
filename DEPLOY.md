# Déploiement Portfolio sur Pterodactyl

## Fichiers à uploader sur votre serveur Pterodactyl :

### Structure complète nécessaire :
```
/
├── dist/                    # Build complet (backend + frontend)
├── data/                    # Données JSON
├── uploads/                 # Dossier des uploads
├── package.json             # Configuration
├── .env                     # Variables d'environnement
└── start.sh                 # Script de démarrage
```

### Variables d'environnement (.env) :
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-production-2025
PORT=${SERVER_PORT}
```

### Startup Command dans Pterodactyl :
```
chmod +x start.sh && ./start.sh
```

### Ou simplement (si dist existe) :
```
NODE_ENV=production PORT=${SERVER_PORT} node dist/server.js
```

## Si npm n'est pas disponible :

1. Buildez localement : `npm run build`
2. Uploadez seulement ces dossiers :
   - `dist/` (contient tout le code compilé)
   - `data/` (données)
   - `uploads/` (fichiers)
   - `.env` (configuration)
3. Startup command : `NODE_ENV=production node dist/server.js`
