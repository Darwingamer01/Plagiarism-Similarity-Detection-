@echo off
echo ======================================
echo   DATABASE CLEANUP SCRIPT
echo ======================================
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
echo [1/4] Clearing PostgreSQL database...
docker exec final-year-major-project-postgres-1 psql -U plagiarism_user -d plagiarism_db -c "TRUNCATE TABLE users, documents, document_chunks, similarity_checks, audit_logs CASCADE;"
if %errorlevel% neq 0 (
    echo Error: Failed to clear database. Make sure Docker containers are running.
    pause
    exit /b 1
)

REM Clear uploaded files
echo.
echo [2/4] Clearing uploaded files...
if exist "backend\uploads\*" (
    del /Q "backend\uploads\*" 2>nul
    echo Deleted files in backend\uploads
) else (
    echo No files to delete in backend\uploads
)

REM Clear Redis cache (optional)
echo.
echo [3/4] Clearing Redis cache...
docker exec final-year-major-project-redis-1 redis-cli FLUSHDB 2>nul
if %errorlevel% equ 0 (
    echo Redis cache cleared
) else (
    echo Redis not running or command failed (skipping)
)

REM Clear FAISS index
echo.
echo [4/4] Clearing AI Service FAISS index...
if exist "ai-service\data\faiss_index\*" (
    del /Q "ai-service\data\faiss_index\*" 2>nul
    echo FAISS index cleared
) else (
    echo No FAISS index to delete
)

echo.
echo ======================================
echo   CLEANUP COMPLETED SUCCESSFULLY!
echo ======================================
echo.
echo All data has been cleared:
echo - Database tables truncated
echo - Uploaded files deleted
echo - Redis cache flushed
echo - FAISS index cleared
echo.
echo You can now start fresh!
echo.
pause
