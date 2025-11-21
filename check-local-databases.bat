@echo off
echo ======================================
echo   Check Local Database Installation
echo ======================================
echo.

echo Checking PostgreSQL...
netstat -ano | findstr :5432 >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] PostgreSQL is running on port 5432
) else (
    echo [X] PostgreSQL is NOT running
    echo     Install from: https://www.postgresql.org/download/windows/
)

echo.
echo Checking Redis...
redis-cli ping >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Redis is running and responding
) else (
    netstat -ano | findstr :6379 >nul
    if %ERRORLEVEL% EQU 0 (
        echo [?] Something is on port 6379 but not responding to Redis commands
    ) else (
        echo [X] Redis is NOT running
        echo     Install Memurai from: https://www.memurai.com/
    )
)

echo.
echo ======================================
echo.

if exist backend\.env (
    echo Checking backend configuration...
    findstr "localhost:5432" backend\.env >nul
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Backend configured for local PostgreSQL
    ) else (
        echo [!] Backend may not be configured for local databases
    )
    
    findstr "localhost:6379" backend\.env >nul
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Backend configured for local Redis
    ) else (
        echo [!] Backend may not be configured for local Redis
    )
) else (
    echo [X] Backend .env file not found!
)

echo.
echo ======================================
echo   Quick Setup Guide
echo ======================================
echo.
echo 1. Install PostgreSQL (10 minutes):
echo    https://www.postgresql.org/download/windows/
echo.
echo 2. Install Redis/Memurai (5 minutes):
echo    https://www.memurai.com/get-memurai
echo.
echo 3. Create database:
echo    psql -U postgres
echo    CREATE DATABASE plagiarism_db;
echo    CREATE USER plagiarism_user WITH PASSWORD 'plagiarism_pass_2024';
echo    GRANT ALL PRIVILEGES ON DATABASE plagiarism_db TO plagiarism_user;
echo.
echo 4. Run migrations:
echo    cd backend
echo    npm run migrate
echo.
echo 5. Start everything:
echo    start-simple.bat
echo.
echo For detailed instructions, see: INSTALL_LOCAL_DATABASES.md
echo.
pause
