@echo off
echo ======================================
echo   First Time Setup
echo   Plagiarism Detection System
echo ======================================
echo.
echo This will:
echo - Install all dependencies
echo - Set up environment files
echo - Create databases
echo - Run migrations
echo.
echo This may take 5-10 minutes...
echo.
pause

REM Start databases
echo.
echo [1/8] Starting databases...
docker-compose up postgres redis -d
timeout /t 5 /nobreak >nul

REM Backend setup
echo.
echo [2/8] Setting up Backend...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo.
    echo IMPORTANT: Edit backend\.env and add your JWT secrets!
    echo.
)

REM Build backend to enable migrations
echo Building backend...
call npm run build

echo Running migrations...
call npm run migrate

cd ..

REM AI Service setup
echo.
echo [3/8] Setting up AI Service...
cd ai-service
if not exist venv (
    echo Creating Python virtual environment...
    py -m venv venv 2>nul || python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing Python dependencies (this may take a while)...
pip install -r requirements.txt

if not exist .env (
    echo Creating .env file...
    copy .env.example .env
)

call deactivate
cd ..

REM Frontend setup
echo.
echo [4/8] Setting up Frontend...
cd frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
)
cd ..

echo.
echo ======================================
echo   Setup Complete!
echo ======================================
echo.
echo Next steps:
echo 1. Edit backend\.env with your JWT secrets
echo 2. Run start-dev.bat to start all services
echo 3. Open http://localhost:5173 in your browser
echo.
echo ======================================
pause
