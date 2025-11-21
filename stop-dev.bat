@echo off
echo ======================================
echo   Stopping Development Services
echo ======================================
echo.

echo Stopping Docker containers...
docker-compose down

echo.
echo Docker containers stopped.
echo.
echo Please close the terminal windows manually:
echo - Backend (Node.js)
echo - AI Service (Python)
echo - Frontend (React)
echo.
echo Or press Ctrl+C in each terminal.
echo.

pause
