@echo off
echo ==============================================
echo    Demarrage du Portfolio Pierre Lihoreau
echo ==============================================
echo.

echo [1/3] Installation des dependances backend...
cd backend
call npm install
if errorlevel 1 (
    echo Erreur lors de l'installation des dependances backend
    pause
    exit /b 1
)

echo.
echo [2/3] Installation des dependances frontend...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo Erreur lors de l'installation des dependances frontend
    pause
    exit /b 1
)

echo.
echo [3/3] Demarrage des serveurs...
echo.

rem Copier le fichier d'environnement s'il n'existe pas
cd ..\backend
if not exist .env (
    copy .env.example .env
    echo Fichier .env cree a partir de .env.example
)

echo Demarrage du backend sur http://localhost:3001
echo Demarrage du frontend sur http://localhost:3000
echo.
echo Compte admin par defaut:
echo Username: admin
echo Password: admin123
echo.
echo Appuyez sur Ctrl+C pour arreter les serveurs
echo.

rem Démarrer le backend en arrière-plan
start "Portfolio Backend" cmd /k "npm run dev"

rem Attendre un peu puis démarrer le frontend
timeout /t 3 /nobreak > nul
cd ..\frontend
start "Portfolio Frontend" cmd /k "npm start"

echo Les serveurs sont en cours de demarrage...
echo Une fois demarre:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:3001
echo - Panel Admin: http://localhost:3000/admin
echo.
pause
