@echo off
echo ======================================
echo   Clear All Users
echo ======================================
echo.
echo WARNING: This will delete ALL users!
echo This will also delete:
echo - All documents (CASCADE)
echo - All similarity checks (CASCADE)
echo - All uploaded files
echo - FAISS index
echo.
set /p confirm="Are you sure? Type 'YES' to continue: "

if not "%confirm%"=="YES" (
    echo.
    echo Cleanup cancelled.
    pause
    exit /b 0
)

echo.
echo [1/3] Deleting all users from database...
docker exec final-year-major-project-postgres-1 psql -U plagiarism_user -d plagiarism_db -c "DELETE FROM users CASCADE;"
if %errorlevel% neq 0 (
    echo Error: Failed to delete users. Make sure Docker containers are running.
    pause
    exit /b 1
)

echo.
echo [2/3] Deleting uploaded files...
if exist "backend\uploads\*" (
    del /Q "backend\uploads\*" 2>nul
    echo Uploaded files deleted
) else (
    echo No files to delete
)

echo.
echo [3/3] Clearing FAISS index...
if exist "ai-service\data\faiss_index\*" (
    del /Q "ai-service\data\faiss_index\*" 2>nul
    echo FAISS index cleared
) else (
    echo No FAISS index to delete
)

echo.
echo ======================================
echo   All Users Cleared!
echo ======================================
echo.
echo Remember to restart the AI Service for changes to take effect.
echo.
pause
