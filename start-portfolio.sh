#!/bin/bash

echo "=============================================="
echo "    Démarrage du Portfolio Pierre Lihoreau"
echo "=============================================="
echo

echo "[1/3] Installation des dépendances backend..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Erreur lors de l'installation des dépendances backend"
    exit 1
fi

echo
echo "[2/3] Installation des dépendances frontend..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "Erreur lors de l'installation des dépendances frontend"
    exit 1
fi

echo
echo "[3/3] Démarrage des serveurs..."
echo

# Copier le fichier d'environnement s'il n'existe pas
cd ../backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Fichier .env créé à partir de .env.example"
fi

echo "Démarrage du backend sur http://localhost:3001"
echo "Démarrage du frontend sur http://localhost:3000"
echo
echo "Compte admin par défaut:"
echo "Username: admin"
echo "Password: admin123"
echo
echo "Appuyez sur Ctrl+C pour arrêter les serveurs"
echo

# Démarrer le backend en arrière-plan
npm run dev &
BACKEND_PID=$!

# Attendre un peu puis démarrer le frontend
sleep 3
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "Les serveurs sont démarrés:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:3001"
echo "- Panel Admin: http://localhost:3000/admin"
echo

# Attendre que l'utilisateur appuie sur Ctrl+C
wait
