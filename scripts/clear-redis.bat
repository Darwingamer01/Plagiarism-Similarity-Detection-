@echo off
echo ======================================
echo   Clear Redis Cache Only
echo ======================================
echo.
echo This will flush the Redis cache.
echo Database data will be kept.
echo.
set /p confirm="Are you sure? Type 'YES' to continue: "

if not "%confirm%"=="YES" (
    echo.
    echo Cleanup cancelled.
    pause
    exit /b 0
)

echo.
echo Clearing Redis cache...
docker exec final-year-major-project-redis-1 redis-cli FLUSHDB
if %errorlevel% equ 0 (
    echo Redis cache cleared successfully
) else (
    echo Error: Docker containers not running or command failed
    pause
    exit /b 1
)

echo.
echo ======================================
echo   Redis Cache Cleared!
echo ======================================
echo.
pause
