@echo off
echo ==============================================
echo    Reconstruction du Frontend Portfolio
echo ==============================================
echo.

cd frontend

echo [1/4] Suppression des anciens node_modules...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo.
echo [2/4] Installation propre des dependances...
npm cache clean --force
npm install

echo.
echo [3/4] Installation des dependances TypeScript et React manquantes...
npm install --save-dev @types/react@^18.2.14 @types/react-dom@^18.2.6
npm install react@^18.2.0 react-dom@^18.2.0

echo.
echo [4/4] Verification de l'installation...
npm list react react-dom @types/react @types/react-dom

echo.
echo Installation terminee. Vous pouvez maintenant demarrer avec 'npm start'
pause
