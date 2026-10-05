<#
.SYNOPSIS
    CareerOS Platform - Concurrent Development Orchestrator

.DESCRIPTION
    Automated startup script for local full-stack development.
    1. Verifies prerequisites: Node.js, Python 3.10+, and uv.
    2. Verifies backend and frontend dependencies.
    3. Starts the FastAPI backend (port 8000) and Next.js frontend (port 3000) concurrently.
    4. Provides robust signal trapping and process tree termination to prevent orphaned ports.

.PARAMETER BackendPort
    Port for the FastAPI backend service (default: 8000).

.PARAMETER FrontendPort
    Port for the Next.js frontend application (default: 3000).

.PARAMETER SeparateWindows
    If specified, launches backend and frontend in dedicated titled console windows.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File scripts/dev.ps1
    powershell -ExecutionPolicy Bypass -File scripts/dev.ps1 -SeparateWindows
    powershell -ExecutionPolicy Bypass -File scripts/dev.ps1 -BackendPort 8080 -FrontendPort 3005
#>

[CmdletBinding()]
param(
    [int]$BackendPort = 8000,
    [int]$FrontendPort = 3000,
    [switch]$SeparateWindows
)

$ErrorActionPreference = "Stop"

$RootDir = (Resolve-Path "$PSScriptRoot\..").Path
$BackendDir = Join-Path $RootDir "backend"
$FrontendDir = Join-Path $RootDir "frontend"

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "         CAREEROS PLATFORM - DEVELOPMENT ORCHESTRATOR            " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " Root Directory: $RootDir" -ForegroundColor Gray
Write-Host " Backend Target: http://127.0.0.1:$BackendPort (FastAPI)" -ForegroundColor Gray
Write-Host " Frontend Target: http://localhost:$FrontendPort (Next.js 14)" -ForegroundColor Gray
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""

# -------------------------------------------------------------
# 1. Prerequisite Checks
# -------------------------------------------------------------
Write-Host "[1/3] Verifying Development Prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeCmd = Get-Command node -ErrorAction Stop
    $nodeVer = & node -v
    Write-Host "  [OK] Node.js:  $nodeVer ($($nodeCmd.Source))" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Node.js is not installed or not in PATH." -ForegroundColor Red
    Write-Host "          Install Node.js (v18+) from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check Python
try {
    $pythonCmd = Get-Command python -ErrorAction Stop
    $pyVer = (& python -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}')").Trim()
    $pyMajor = [int]($pyVer.Split('.')[0])
    $pyMinor = [int]($pyVer.Split('.')[1])
    if ($pyMajor -lt 3 -or ($pyMajor -eq 3 -and $pyMinor -lt 10)) {
        Write-Host "  [ERROR] Python version $pyVer detected. Python 3.10+ is required." -ForegroundColor Red
        exit 1
    }
    Write-Host "  [OK] Python:   v$pyVer ($($pythonCmd.Source))" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Python 3.10+ is not installed or not in PATH." -ForegroundColor Red
    Write-Host "          Install Python from: https://www.python.org/downloads/" -ForegroundColor Yellow
    exit 1
}

# Check uv
try {
    $uvCmd = Get-Command uv -ErrorAction Stop
    $uvVer = (& uv --version).Trim()
    Write-Host "  [OK] uv:       $uvVer ($($uvCmd.Source))" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] uv package manager is not installed or not in PATH." -ForegroundColor Red
    Write-Host "          Install uv via PowerShell: powershell -c ""irm https://astral.sh/uv/install.ps1 | iex""" -ForegroundColor Yellow
    exit 1
}

# Check Project Directories
if (-not (Test-Path $BackendDir)) {
    Write-Host "  [ERROR] Backend directory not found: $BackendDir" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $FrontendDir)) {
    Write-Host "  [ERROR] Frontend directory not found: $FrontendDir" -ForegroundColor Red
    exit 1
}

# Verify / sync virtual environment if missing
$venvDir = Join-Path $BackendDir ".venv"
if (-not (Test-Path $venvDir)) {
    Write-Host "  [NOTICE] Backend virtual environment not found. Initializing with uv sync..." -ForegroundColor Cyan
    Push-Location $BackendDir
    try {
        uv sync
    } finally {
        Pop-Location
    }
}

# Verify frontend node_modules if missing
$nodeModulesDir = Join-Path $FrontendDir "node_modules"
if (-not (Test-Path $nodeModulesDir)) {
    Write-Host "  [NOTICE] Frontend node_modules not found. Installing dependencies via npm install..." -ForegroundColor Cyan
    Push-Location $FrontendDir
    try {
        npm install
    } finally {
        Pop-Location
    }
}

Write-Host "  [OK] Prerequisites and dependency trees verified.`n" -ForegroundColor Green

# -------------------------------------------------------------
# 2. Port Conflict Checks
# -------------------------------------------------------------
Write-Host "[2/3] Checking Port Availability..." -ForegroundColor Yellow

function Test-PortOccupied([int]$Port) {
    try {
        $conn = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        return ($null -ne $conn)
    } catch {
        return $false
    }
}

if (Test-PortOccupied -Port $BackendPort) {
    Write-Host "  [WARNING] Port $BackendPort is already in use!" -ForegroundColor Red
    $conns = Get-NetTCPConnection -LocalPort $BackendPort -ErrorAction SilentlyContinue
    foreach ($c in $conns) {
        Write-Host "            In use by PID: $($c.OwningProcess)" -ForegroundColor DarkGray
    }
    Write-Host "            Please free port $BackendPort or use -BackendPort <port>" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "  [OK] Port $BackendPort is available for Backend." -ForegroundColor Green
}

if (Test-PortOccupied -Port $FrontendPort) {
    Write-Host "  [WARNING] Port $FrontendPort is already in use!" -ForegroundColor Red
    $conns = Get-NetTCPConnection -LocalPort $FrontendPort -ErrorAction SilentlyContinue
    foreach ($c in $conns) {
        Write-Host "            In use by PID: $($c.OwningProcess)" -ForegroundColor DarkGray
    }
    Write-Host "            Please free port $FrontendPort or use -FrontendPort <port>" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "  [OK] Port $FrontendPort is available for Frontend." -ForegroundColor Green
}
Write-Host ""

# -------------------------------------------------------------
# 3. Launching Services Concurrently
# -------------------------------------------------------------
Write-Host "[3/3] Launching CareerOS Development Services..." -ForegroundColor Yellow

$backendProc = $null
$frontendProc = $null

function Cleanup-ChildProcesses {
    Write-Host ""
    Write-Host "=================================================================" -ForegroundColor Yellow
    Write-Host " Shutting down CareerOS services gracefully...                   " -ForegroundColor Yellow
    Write-Host "=================================================================" -ForegroundColor Yellow

    if ($backendProc -and -not $backendProc.HasExited) {
        Write-Host "  Stopping Backend Service (PID: $($backendProc.Id))..." -ForegroundColor DarkGray
        try {
            taskkill /pid $backendProc.Id /T /F 2>$null | Out-Null
        } catch {}
    }

    if ($frontendProc -and -not $frontendProc.HasExited) {
        Write-Host "  Stopping Frontend Service (PID: $($frontendProc.Id))..." -ForegroundColor DarkGray
        try {
            taskkill /pid $frontendProc.Id /T /F 2>$null | Out-Null
        } catch {}
    }

    # Ensure ports are freed
    foreach ($p in @($BackendPort, $FrontendPort)) {
        try {
            $conns = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue
            foreach ($conn in $conns) {
                if ($conn.OwningProcess -and $conn.OwningProcess -gt 0) {
                    taskkill /pid $conn.OwningProcess /T /F 2>$null | Out-Null
                }
            }
        } catch {}
    }

    Write-Host "  [OK] All processes terminated. Ports released cleanly.`n" -ForegroundColor Green
}

try {
    if ($SeparateWindows) {
        Write-Host "  Launching Backend in dedicated window..." -ForegroundColor Cyan
        $backendProc = Start-Process -FilePath "powershell.exe" `
            -ArgumentList "-NoExit", "-Command", "`$host.UI.RawUI.WindowTitle = 'CareerOS Backend [Port $BackendPort]'; cd '$BackendDir'; uv run uvicorn app.main:app --host 127.0.0.1 --port $BackendPort --reload" `
            -PassThru

        Write-Host "  Launching Frontend in dedicated window..." -ForegroundColor Cyan
        $frontendProc = Start-Process -FilePath "powershell.exe" `
            -ArgumentList "-NoExit", "-Command", "`$host.UI.RawUI.WindowTitle = 'CareerOS Frontend [Port $FrontendPort]'; cd '$FrontendDir'; npm run dev -- -p $FrontendPort" `
            -PassThru
    } else {
        Write-Host "  Starting FastAPI backend via uv (port $BackendPort)..." -ForegroundColor Cyan
        $backendProc = Start-Process -FilePath "uv" `
            -ArgumentList "run", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "$BackendPort", "--reload" `
            -WorkingDirectory $BackendDir `
            -PassThru

        Write-Host "  Starting Next.js frontend via npm (port $FrontendPort)..." -ForegroundColor Cyan
        $frontendProc = Start-Process -FilePath "cmd.exe" `
            -ArgumentList "/c", "npm run dev -- -p $FrontendPort" `
            -WorkingDirectory $FrontendDir `
            -PassThru
    }

    Write-Host ""
    Write-Host "=================================================================" -ForegroundColor Green
    Write-Host "      CAREEROS DEVELOPMENT SERVICES ARE RUNNING!                 " -ForegroundColor Green
    Write-Host "=================================================================" -ForegroundColor Green
    Write-Host "  * Frontend Dashboard:       http://localhost:$FrontendPort" -ForegroundColor Cyan
    Write-Host "  * Backend Intelligence API: http://127.0.0.1:$BackendPort" -ForegroundColor Cyan
    Write-Host "  * API Interactive Docs:     http://127.0.0.1:$BackendPort/docs" -ForegroundColor Cyan
    Write-Host "  * API Health Endpoint:      http://127.0.0.1:$BackendPort/api/health" -ForegroundColor Cyan
    Write-Host "=================================================================" -ForegroundColor Green
    Write-Host "  Press Ctrl+C at any time to cleanly stop all services." -ForegroundColor White
    Write-Host ""

    # Monitor processes until user interrupt or process exit
    while (-not $backendProc.HasExited -and -not $frontendProc.HasExited) {
        Start-Sleep -Milliseconds 500
    }

    if ($backendProc.HasExited) {
        Write-Host "  [WARNING] Backend process exited with code $($backendProc.ExitCode)" -ForegroundColor Red
    }
    if ($frontendProc.HasExited) {
        Write-Host "  [WARNING] Frontend process exited with code $($frontendProc.ExitCode)" -ForegroundColor Red
    }
}
finally {
    Cleanup-ChildProcesses
}
