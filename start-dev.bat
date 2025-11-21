@echo off
setlocal enabledelayedexpansion
echo ======================================
echo   Plagiarism Detection System
echo   Development Startup (All Services)
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

REM Check if Python is installed  
where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set PYTHON_CMD=py
    set HAS_PYTHON=1
) else (
    where python >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        set PYTHON_CMD=python
        set HAS_PYTHON=1
    ) else (
        echo WARNING: Python is not installed!
        echo AI service will not start.
        echo.
        set HAS_PYTHON=0
    )
)

REM Check for port conflicts
echo Checking for port conflicts...
netstat -ano | findstr ":8000" | findstr "LISTENING" >nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo WARNING: Port 8000 is already in use!
    echo Attempting to free the port...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
    echo Port 8000 should be free now.
)

echo [1/5] Starting PostgreSQL and Redis (Docker)...
docker-compose up postgres redis -d
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo WARNING: Docker compose failed. Make sure Docker Desktop is running.
    echo You can also install PostgreSQL and Redis locally.
    pause
)

echo.
echo [2/5] Opening Backend terminal...
start cmd /k "cd /d %~dp0backend && echo Starting Backend... && npm run dev"

timeout /t 2 /nobreak >nul

if %HAS_PYTHON% EQU 1 (
    echo [3/5] Opening AI Service terminal...
    start "AI Service" cmd /k "cd /d %~dp0ai-service && echo Starting AI Service on http://localhost:8001 && call venv\Scripts\activate && uvicorn main:app --reload --host 0.0.0.0 --port 8001"
    timeout /t 2 /nobreak >nul
) else (
    echo [3/5] Skipping AI Service (Python not installed)
)

echo.
echo [4/5] Opening Frontend terminal...
start "Frontend" cmd /k "cd /d %~dp0frontend && echo Starting Frontend... && npm run dev"

echo.
echo [5/5] All done!
echo.
echo ======================================
echo   Services Starting...
echo ======================================
if %HAS_PYTHON% EQU 1 (
    echo   Frontend:   http://localhost:5173 (or 3001)
    echo   Backend:    http://localhost:8000
    echo   AI Service: http://localhost:8001
    echo   API Docs:   http://localhost:8001/docs
) else (
    echo   Frontend:   http://localhost:5173 (or 3001)
    echo   Backend:    http://localhost:8000
    echo   AI Service: Not started (Python not found)
)
echo ======================================
echo.
echo Waiting 15 seconds for services to start...
pause >nul

start http://localhost:5173

echo.
echo To stop all services:
echo 1. Press Ctrl+C in each terminal window
echo 2. Run: docker-compose down
echo.
pause
