@echo off
echo ======================================
echo   Start Backend + Frontend Only
echo   (Without AI Service)
echo ======================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    pause
    exit /b 1
)

echo [1/3] Starting databases...
docker-compose up postgres redis -d

timeout /t 2 /nobreak >nul

echo.
echo [2/3] Opening Backend terminal...
start cmd /k "cd /d %~dp0backend && echo Starting Backend on http://localhost:8000 && npm run dev"

timeout /t 2 /nobreak >nul

echo.
echo [3/3] Opening Frontend terminal...
start cmd /k "cd /d %~dp0frontend && echo Starting Frontend on http://localhost:5173 && npm run dev"

echo.
echo ======================================
echo   Services Starting...
echo ======================================
echo   Frontend:   http://localhost:5173
echo   Backend:    http://localhost:8000
echo ======================================
echo.
echo NOTE: AI features won't work without Python AI service.
echo To install Python and AI service, see DEV_QUICK_START.md
echo.
echo Press any key to open the application...
pause >nul

start http://localhost:5173

echo.
pause
