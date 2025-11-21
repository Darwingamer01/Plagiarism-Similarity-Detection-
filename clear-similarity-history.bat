@echo off
echo ======================================
echo   Clear Similarity Check History
echo ======================================
echo.
echo This will delete all similarity check records.
echo Documents and users will be kept.
echo.
set /p confirm="Are you sure? Type 'YES' to continue: "

if not "%confirm%"=="YES" (
    echo.
    echo Cleanup cancelled.
    pause
    exit /b 0
)

echo.
echo Deleting similarity check history...
docker exec final-year-major-project-postgres-1 psql -U plagiarism_user -d plagiarism_db -c "DELETE FROM similarity_checks;"
if %errorlevel% neq 0 (
    echo Error: Failed to delete history. Make sure Docker containers are running.
    pause
    exit /b 1
)

echo.
echo ======================================
echo   Similarity History Cleared!
echo ======================================
echo.
pause
