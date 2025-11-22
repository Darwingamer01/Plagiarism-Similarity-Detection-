# Database Cleanup Script - PowerShell Version
# This will DELETE ALL DATA from the database and uploaded files

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DATABASE CLEANUP SCRIPT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "WARNING: This will DELETE ALL DATA!" -ForegroundColor Red
Write-Host "- All users" -ForegroundColor Yellow
Write-Host "- All documents" -ForegroundColor Yellow
Write-Host "- All similarity checks" -ForegroundColor Yellow
Write-Host "- All uploaded files" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Are you sure? Type 'YES' to continue"

if ($confirm -ne "YES") {
    Write-Host ""
    Write-Host "Cleanup cancelled." -ForegroundColor Yellow
    pause
    exit 0
}

Write-Host ""
Write-Host "Starting cleanup..." -ForegroundColor Green
Write-Host ""

# Find PostgreSQL psql executable
$psqlPaths = @(
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe",
    "C:\Program Files\PostgreSQL\13\bin\psql.exe",
    "C:\Program Files (x86)\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files (x86)\PostgreSQL\15\bin\psql.exe"
)

$psqlPath = $null
foreach ($path in $psqlPaths) {
    if (Test-Path $path) {
        $psqlPath = $path
        break
    }
}

if (-not $psqlPath) {
    # Try to find it using Get-Command
    try {
        $psqlPath = (Get-Command psql -ErrorAction SilentlyContinue).Source
    } catch {
        $psqlPath = $null
    }
}

# Step 1: Clear PostgreSQL database
Write-Host "[1/3] Clearing PostgreSQL database..." -ForegroundColor Cyan

if ($psqlPath) {
    Write-Host "Found psql at: $psqlPath" -ForegroundColor Gray
    $env:PGPASSWORD = "plagiarism_pass_2024"
    
    try {
        & $psqlPath -U plagiarism_user -d plagiarism_db -f clear-database.sql
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Database cleared successfully" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed to clear database" -ForegroundColor Red
            Write-Host "Make sure PostgreSQL is running" -ForegroundColor Yellow
            pause
            exit 1
        }
    } catch {
        Write-Host "✗ Error clearing database: $_" -ForegroundColor Red
        pause
        exit 1
    }
} else {
    Write-Host "⚠ psql not found. Using alternative method..." -ForegroundColor Yellow
    Write-Host "Connecting via Docker..." -ForegroundColor Cyan
    
    try {
        # Try using docker exec with Get-Content
        Get-Content clear-database.sql | docker exec -i postgres_container psql -U plagiarism_user -d plagiarism_db
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Database cleared successfully (via Docker)" -ForegroundColor Green
        } else {
            Write-Host "✗ Could not connect to database" -ForegroundColor Red
            Write-Host ""
            Write-Host "Please run this manually:" -ForegroundColor Yellow
            Write-Host "Get-Content clear-database.sql | docker exec -i postgres_container psql -U plagiarism_user -d plagiarism_db" -ForegroundColor Gray
            pause
            exit 1
        }
    } catch {
        Write-Host "✗ Docker method failed too" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please clear database manually using pgAdmin or psql" -ForegroundColor Yellow
        pause
        exit 1
    }
}

# Step 2: Clear uploaded files
Write-Host ""
Write-Host "[2/3] Clearing uploaded files..." -ForegroundColor Cyan

$uploadDir = "backend\uploads"
if (Test-Path $uploadDir) {
    $files = Get-ChildItem -Path $uploadDir -File
    if ($files.Count -gt 0) {
        Remove-Item -Path "$uploadDir\*" -Force -ErrorAction SilentlyContinue
        Write-Host "✓ Deleted $($files.Count) files from uploads directory" -ForegroundColor Green
    } else {
        Write-Host "✓ No files to delete in uploads directory" -ForegroundColor Green
    }
} else {
    Write-Host "✓ Uploads directory doesn't exist (nothing to clear)" -ForegroundColor Green
}

# Step 3: Clear Redis cache
Write-Host ""
Write-Host "[3/3] Clearing Redis cache..." -ForegroundColor Cyan

try {
    redis-cli FLUSHDB 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Redis cache cleared" -ForegroundColor Green
    } else {
        Write-Host "⚠ Redis not running or redis-cli not available (skipping)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠ Redis not available (skipping)" -ForegroundColor Yellow
}

# Step 4: Clear AI service vector database (if needed)
Write-Host ""
Write-Host "[4/4] Restarting AI service to clear vector database..." -ForegroundColor Cyan

try {
    docker-compose restart ai-service 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ AI service restarted" -ForegroundColor Green
    } else {
        Write-Host "⚠ Could not restart AI service (you may need to do this manually)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠ Docker Compose not available (skipping)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   CLEANUP COMPLETED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "All data has been cleared:" -ForegroundColor Green
Write-Host "✓ Database tables truncated" -ForegroundColor Gray
Write-Host "✓ Uploaded files deleted" -ForegroundColor Gray
Write-Host "✓ Redis cache flushed" -ForegroundColor Gray
Write-Host "✓ AI service restarted" -ForegroundColor Gray
Write-Host ""
Write-Host "You can now start fresh! You'll need to:" -ForegroundColor Cyan
Write-Host "1. Register a new user account" -ForegroundColor Yellow
Write-Host "2. Upload new documents" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to close..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

