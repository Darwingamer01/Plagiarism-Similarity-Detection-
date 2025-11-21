@echo off
echo ========================================
echo   DATABASE CLEANUP SCRIPT
echo ========================================
echo.
echo WARNING: This will DELETE ALL DATA!
echo - All users
echo - All documents
echo - All similarity checks
echo - All uploaded files
echo.
set /p confirm="Are you sure? Type 'YES' to continue: "

if not "%confirm%"=="YES" (
    echo.
    echo Cleanup cancelled.
    pause
    exit /b 0
)

echo.
echo Starting cleanup...
echo.

REM Clear PostgreSQL database
echo [1/3] Clearing PostgreSQL database...
psql -U plagiarism_user -d plagiarism_db -f clear-database.sql
if %errorlevel% neq 0 (
    echo Error: Failed to clear database. Make sure PostgreSQL is running.
    pause
    exit /b 1
)

REM Clear uploaded files
echo.
echo [2/3] Clearing uploaded files...
if exist "backend\uploads\*" (
    del /Q "backend\uploads\*" 2>nul
    echo Deleted files in backend\uploads
) else (
    echo No files to delete in backend\uploads
)

REM Clear Redis cache (optional)
echo.
echo [3/3] Clearing Redis cache...
redis-cli FLUSHDB 2>nul
if %errorlevel% equ 0 (
    echo Redis cache cleared
) else (
    echo Redis not running or redis-cli not available (skipping)
)

echo.
echo ========================================
echo   CLEANUP COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo All data has been cleared:
echo - Database tables truncated
echo - Uploaded files deleted
echo - Redis cache flushed
echo.
echo You can now start fresh!
echo.
pause
