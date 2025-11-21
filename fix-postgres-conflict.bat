@echo off
echo ======================================
echo   Fixing PostgreSQL Port Conflict
echo ======================================
echo.
echo Issue: Local PostgreSQL service is running on port 5432
echo This conflicts with the Docker PostgreSQL container
echo.
echo Solution: Stop the local PostgreSQL service
echo.
echo WARNING: This will stop your local PostgreSQL service!
echo The Docker container will use port 5432 instead.
echo.
pause

echo.
echo [1/4] Stopping local PostgreSQL service...
net stop postgresql-x64-18
if %errorlevel% neq 0 (
    echo Failed to stop service. You may need to run this as Administrator.
    echo Right-click this file and select "Run as administrator"
    pause
    exit /b 1
)

echo.
echo [2/4] Restarting Docker containers...
docker-compose down
docker-compose up postgres redis -d

echo.
echo [3/4] Waiting for database to be ready (15s)...
timeout /t 15 /nobreak >nul

echo.
echo [4/4] Running migrations...
cd backend
call npm run migrate
cd ..

echo.
echo ======================================
echo   Fix Complete!
echo ======================================
echo.
echo The local PostgreSQL service has been stopped.
echo Docker PostgreSQL is now running on port 5432.
echo.
echo To prevent this issue in the future:
echo 1. Disable the local PostgreSQL service from starting automatically:
echo    sc config postgresql-x64-18 start= disabled
echo.
echo 2. Or use a different port for Docker in docker-compose.yml
echo.
echo You can now run start-dev.bat
echo.
pause
