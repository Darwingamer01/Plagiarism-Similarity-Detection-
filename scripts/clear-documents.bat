@echo off
echo ======================================
echo   Clear Documents Only
echo ======================================
echo.
echo This will delete:
echo - All documents from database
echo - All uploaded files
echo - FAISS index (document embeddings)
echo.
echo Users and similarity check history will be kept.
echo.
set /p confirm="Are you sure? Type 'YES' to continue: "

if not "%confirm%"=="YES" (
    echo.
    echo Cleanup cancelled.
    pause
    exit /b 0
)

echo.
echo [1/3] Deleting documents from database...
docker exec final-year-major-project-postgres-1 psql -U plagiarism_user -d plagiarism_db -c "DELETE FROM documents CASCADE;"
if %errorlevel% neq 0 (
    echo Error: Failed to delete documents. Make sure Docker containers are running.
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
echo   Documents Cleared!
echo ======================================
echo.
echo Remember to restart the AI Service for changes to take effect.
echo.
pause
