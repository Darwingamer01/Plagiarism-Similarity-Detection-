@echo off
echo ======================================
echo   Fixing Database Authentication
echo ======================================
echo.
echo This script will:
1. Reset the database (DELETE ALL DATA)
2. Re-initialize with correct credentials
3. Run migrations
echo.
echo WARNING: ALL DATA WILL BE LOST!
echo.
pause

echo.
echo [1/5] Stopping containers and removing volumes...
docker-compose down -v

echo.
echo [2/5] Starting PostgreSQL and Redis...
docker-compose up postgres redis -d

echo.
echo [3/5] Waiting for Database to be ready (15s)...
timeout /t 15 /nobreak >nul

echo.
echo [4/6] Clearing FAISS index...
if exist "ai-service\data\faiss_index\*" (
    del /Q "ai-service\data\faiss_index\*" 2>nul
    echo FAISS index cleared
) else (
    echo No FAISS index to delete
)

echo.
echo [5/6] Building Backend...
cd backend
call npm run build

echo.
echo [6/6] Running Migrations...
call npm run migrate

cd ..

echo.
echo ======================================
echo   Fix Complete!
echo ======================================
echo.
echo You can now run start-dev.bat
echo.
pause
