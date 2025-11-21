@echo off
echo ======================================
echo   SIMPLE SETUP (No Python Required)
echo   Backend + Frontend Only
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/5] Starting databases...
docker-compose up postgres redis -d
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo WARNING: Docker compose failed. Make sure Docker Desktop is running.
    pause
)

timeout /t 3 /nobreak >nul

echo.
echo [2/5] Setting up Backend...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
)

echo.
echo [3/5] Building backend...
call npm run build

echo.
echo [4/5] Running migrations...
call npm run migrate

cd ..

echo.
echo [5/5] Setting up Frontend...
cd frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
)
cd ..

echo.
echo ======================================
echo   Setup Complete!
echo ======================================
echo.
echo You can now start:
echo 1. Backend: cd backend ^&^& npm run dev
echo 2. Frontend: cd frontend ^&^& npm run dev
echo.
echo For AI service, install Python first from:
echo https://www.python.org/downloads/
echo.
echo ======================================
pause
