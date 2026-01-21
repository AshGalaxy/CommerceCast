<#
.SYNOPSIS
    Automated setup and startup script for CommerceCast.
.DESCRIPTION
    This script sets up the Python backend with a virtual environment, installs dependencies using the correct Windows Python,
    installs Node.js dependencies for the frontend, and optionally starts both servers.
#>

$ErrorActionPreference = "Stop"

function Write-Header {
    param([string]$Text)
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "  $Text" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
}

Write-Header "CommerceCast Setup & Run Script"

# 1. Detect Python
Write-Host "Checking for Python..." -ForegroundColor Yellow
$pyCmd = "python"
if (Get-Command "py" -ErrorAction SilentlyContinue) {
    $pyCmd = "py"
    Write-Host "Found 'py' (Python Launcher). Using it." -ForegroundColor Green
} elseif (Get-Command "python" -ErrorAction SilentlyContinue) {
    $pythonVersion = python --version 2>&1
    Write-Host "Found 'python'. ($pythonVersion)" -ForegroundColor Green
} else {
    Write-Error "Python not found! Please install Python from python.org."
    exit 1
}

# 2. Backend Setup
Write-Header "Setting up Backend"
Set-Location "python-backend"

if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment 'venv'..." -ForegroundColor Yellow
    & $pyCmd -m venv venv
} else {
    Write-Host "Virtual environment 'venv' already exists." -ForegroundColor Gray
}

Write-Host "Upgrading pip..." -ForegroundColor Yellow
.\venv\Scripts\python -m pip install --upgrade pip

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
# Using --only-binary :all: for pandas/numpy/scipy to avoid compilation if possible, but standard pip usually handles this well on Windows now
.\venv\Scripts\python -m pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to install backend dependencies."
    exit 1
}

Start-Sleep -Seconds 1
Set-Location ..

# 3. Frontend Setup
Write-Header "Setting up Frontend"

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm dependencies (this may take a moment)..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "node_modules already exists. Skipping install (run 'npm install' manually if needed)." -ForegroundColor Gray
}

# 4. Start Servers
Write-Header "Starting Application"

$startChoice = Read-Host "Do you want to start the servers now? (Y/N)"
if ($startChoice -eq 'Y' -or $startChoice -eq 'y') {
    Write-Host "Starting Backend..." -ForegroundColor Green
    # Start Backend in a new window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd python-backend; .\venv\Scripts\Activate.ps1; python main.py"

    Write-Host "Starting Frontend..." -ForegroundColor Green
    # Start Frontend in current window (or new one if preferred, but let's do current for logs)
    npm run dev
} else {
    Write-Host "Setup complete. To run manually:"
    Write-Host "  1. Backend: cd python-backend; .\venv\Scripts\Activate.ps1; python main.py"
    Write-Host "  2. Frontend: npm run dev"
}
