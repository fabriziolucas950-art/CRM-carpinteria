@echo off
echo.
echo ========================================
echo   Setup inicial de Git para FabrizioCRM
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Verificando Git...
git --version
if errorlevel 1 (
    echo ERROR: Git no esta instalado o no esta en el PATH.
    echo Reinicia la terminal e intenta de nuevo.
    pause
    exit /b 1
)

echo.
echo [2/5] Inicializando repositorio local...
git init

echo.
echo [3/5] Configurando identidad...
git config user.name "Fabrizio Lucas"
git config user.email "fabriziolucas950@gmail.com"

echo.
echo [4/5] Conectando con GitHub...
git remote remove origin 2>nul
git remote add origin https://github.com/fabriziolucas950-art/CRM-carpinteria.git
git branch -M main

echo.
echo [5/5] Primer commit y push...
git add .
git commit -m "Setup inicial: CRM Carpinteria"
git push -u origin main

echo.
echo ========================================
echo   Setup completado! Git configurado.
echo ========================================
echo   Ahora podes usar: node git-push.js
echo ========================================
echo.
pause
