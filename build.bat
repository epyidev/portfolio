@echo off
echo ===== Construction du projet Portfolio =====

echo 1. Nettoyage des fichiers precedents...
if exist dist rmdir /s /q dist

echo 2. Installation des dependances principales...
call npm install

echo 3. Installation des dependances frontend...
cd frontend
call npm install

echo 4. Construction du frontend...
call npm run build

echo 5. Copie du frontend dans le dossier dist...
cd ..
if not exist dist mkdir dist
xcopy /E /I /Y frontend\dist dist

echo 6. Construction du backend...
call npm run build:backend

echo ===== Construction terminee =====
echo Pour demarrer en production: npm start
