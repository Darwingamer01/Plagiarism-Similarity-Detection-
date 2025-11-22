@echo off
echo ======================================
echo   Clear FAISS Index Only
echo ======================================
echo.
echo This will delete the FAISS index (document embeddings).
echo Database documents will be kept.
echo.
echo Note: The FAISS index will be rebuilt when you
echo upload new documents or restart the AI service.
echo.
set /p confirm="Are you sure? Type 'YES' to continue: "

if not "%confirm%"=="YES" (
    echo.
    echo Cleanup cancelled.
    pause
    exit /b 0
)

echo.
echo Clearing FAISS index...
if exist "ai-service\data\faiss_index\*" (
    del /Q "ai-service\data\faiss_index\*" 2>nul
    echo FAISS index cleared successfully
) else (
    echo No FAISS index to delete
)

echo.
echo ======================================
echo   FAISS Index Cleared!
echo ======================================
echo.
echo Remember to restart the AI Service for changes to take effect.
echo.
pause
