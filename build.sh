#!/bin/bash

echo "===== Construction du projet Portfolio ====="

echo "1. Nettoyage des fichiers precedents..."
rm -rf dist

echo "2. Installation des dependances principales..."
npm install

echo "3. Installation des dependances frontend..."
cd frontend
npm install

echo "4. Construction du frontend..."
npm run build

echo "5. Copie du frontend dans le dossier dist..."
cd ..
mkdir -p dist
cp -r frontend/dist/* dist/

echo "6. Construction du backend..."
npm run build:backend

echo "===== Construction terminee ====="
echo "Pour demarrer en production: npm start"
