@echo off
echo ======================================
echo   AI Service Setup
echo   (Python Environment)
echo ======================================
echo.

cd ai-service

if exist venv (
    echo Virtual environment already exists.
    echo Skipping creation...
) else (
    echo Creating Python virtual environment...
    py -m venv venv
    if %ERRORLEVEL% NEQ 0 (
        echo Failed with 'py', trying 'python'...
        python -m venv venv
    )
)

echo.
echo Activating virtual environment...
call venv\Scripts\activate

echo.
echo Installing AI dependencies (this may take 5-10 minutes)...
echo Please wait...
pip install -r requirements.txt

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ======================================
    echo   AI Service Setup Complete!
    echo ======================================
    echo.
    echo You can now run: start-dev.bat
    echo Or manually start AI service with:
    echo   cd ai-service
    echo   venv\Scripts\activate
    echo   uvicorn main:app --reload --port 8001
    echo.
) else (
    echo.
    echo ERROR: Failed to install dependencies!
    echo Please check your internet connection and try again.
    echo.
)

cd ..
pause
