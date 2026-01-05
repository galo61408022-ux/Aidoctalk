@echo off
REM GitHub & Deployment Setup Script for Windows
REM Run from project root: deploy-setup.bat

echo.
echo ========================================
echo AI DocTalk - GitHub Setup Script
echo ========================================
echo.

REM Step 1: Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed. Please install from https://git-scm.com/
    pause
    exit /b 1
)

REM Step 2: Initialize Git
echo Step 1: Initializing Git Repository...
git init
git add .
git commit -m "Initial commit: AI DocTalk - Telemedicine platform with AI chat"
echo.
echo [OK] Git initialized with initial commit
echo.

REM Step 3: Create .gitignore
echo Step 2: Setting up .gitignore...
if not exist ".gitignore" (
    (
        echo # Dependencies
        echo node_modules/
        echo /.pnp
        echo .pnp.js
        echo.
        echo # Environment variables
        echo .env
        echo .env.local
        echo .env.development.local
        echo .env.test.local
        echo .env.production.local
        echo.
        echo # OS
        echo .DS_Store
        echo Thumbs.db
        echo.
        echo # IDEs
        echo .vscode/
        echo .idea/
        echo *.swp
        echo *.swo
        echo.
        echo # Build outputs
        echo /build
        echo /dist
        echo .next/
        echo out/
        echo.
        echo # Logs
        echo logs/
        echo *.log
        echo npm-debug.log*
        echo yarn-debug.log*
        echo yarn-error.log*
        echo.
        echo # Firebase
        echo serviceAccountKey.json
        echo.
        echo # Testing
        echo coverage/
        echo .nyc_output/
        echo.
        echo # Misc
        echo *.pem
    ) > .gitignore
    echo [OK] .gitignore created
) else (
    echo [OK] .gitignore already exists
)
echo.

REM Step 4: Show instructions
echo Step 3: Next Steps
echo.
echo 1. Go to https://github.com/new
echo 2. Create new repository named: aidoctalk
echo 3. Do NOT initialize with README, .gitignore, or license
echo 4. Click "Create repository"
echo.
echo 5. Copy your repository URL and run in this terminal:
echo.
echo    git remote add origin https://github.com/YOUR-USERNAME/aidoctalk.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 6. Then go to https://railway.app for backend deployment
echo 7. Then go to https://vercel.com for frontend deployment
echo.
pause
