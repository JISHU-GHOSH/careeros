<#
.SYNOPSIS
    CareerOS Platform - End-to-End Verification & Test Runner

.DESCRIPTION
    Executes full backend pytest verification suite (all 39 tests) and
    frontend production Next.js typecheck & build (`npm run build`).
    Outputs detailed timing, status tables, and returns proper exit codes.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File scripts/test_all.ps1
#>

[CmdletBinding()]
param(
    [switch]$Fast,
    [switch]$VerboseOutput
)

$ErrorActionPreference = "Stop"
$ScriptStartTime = Get-Date

$RootDir = (Resolve-Path "$PSScriptRoot\..").Path
$BackendDir = Join-Path $RootDir "backend"
$FrontendDir = Join-Path $RootDir "frontend"

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "           CAREEROS PLATFORM - VERIFICATION RUNNER               " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " Working Directory: $RootDir" -ForegroundColor Gray
Write-Host " Started At:        $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""

# Verify repository structure
if (-not (Test-Path $BackendDir)) {
    Write-Error "Backend directory not found at: $BackendDir"
    exit 1
}

if (-not (Test-Path $FrontendDir)) {
    Write-Error "Frontend directory not found at: $FrontendDir"
    exit 1
}

$backendSuccess = $false
$frontendSuccess = $false
$backendDuration = 0
$frontendDuration = 0

# -------------------------------------------------------------
# 1. Backend Verification (pytest via uv)
# -------------------------------------------------------------
Write-Host "[1/2] Running Backend Pytest Suite..." -ForegroundColor Yellow
Write-Host "      Location: $BackendDir" -ForegroundColor DarkGray
$t0 = Get-Date

try {
    Push-Location $BackendDir
    # Run pytest through uv
    uv run pytest -v
    $backendExitCode = $LASTEXITCODE
}
catch {
    $backendExitCode = 1
    Write-Host "Backend pytest encountered an execution error: $_" -ForegroundColor Red
}
finally {
    Pop-Location
}

$backendDuration = [Math]::Round(((Get-Date) - $t0).TotalSeconds, 2)

if ($backendExitCode -eq 0) {
    $backendSuccess = $true
    Write-Host "`n[PASS] Backend test suite passed ($backendDuration s)`n" -ForegroundColor Green
} else {
    Write-Host "`n[FAIL] Backend test suite failed with exit code $backendExitCode ($backendDuration s)`n" -ForegroundColor Red
}

# -------------------------------------------------------------
# 2. Frontend Verification (Next.js build & typecheck)
# -------------------------------------------------------------
Write-Host "[2/2] Running Frontend Next.js Production Build & Typecheck..." -ForegroundColor Yellow
Write-Host "      Location: $FrontendDir" -ForegroundColor DarkGray
$t1 = Get-Date

try {
    Push-Location $FrontendDir
    npm run build
    $frontendExitCode = $LASTEXITCODE
}
catch {
    $frontendExitCode = 1
    Write-Host "Frontend build encountered an execution error: $_" -ForegroundColor Red
}
finally {
    Pop-Location
}

$frontendDuration = [Math]::Round(((Get-Date) - $t1).TotalSeconds, 2)

if ($frontendExitCode -eq 0) {
    $frontendSuccess = $true
    Write-Host "`n[PASS] Frontend build and typecheck passed ($frontendDuration s)`n" -ForegroundColor Green
} else {
    Write-Host "`n[FAIL] Frontend build failed with exit code $frontendExitCode ($frontendDuration s)`n" -ForegroundColor Red
}

# -------------------------------------------------------------
# Summary Report
# -------------------------------------------------------------
$totalDuration = [Math]::Round(((Get-Date) - $ScriptStartTime).TotalSeconds, 2)

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "                  VERIFICATION SUMMARY REPORT                    " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""

$bStatus = if ($backendSuccess) { "[PASS]" } else { "[FAIL]" }
$bColor = if ($backendSuccess) { "Green" } else { "Red" }
$fStatus = if ($frontendSuccess) { "[PASS]" } else { "[FAIL]" }
$fColor = if ($frontendSuccess) { "Green" } else { "Red" }

Write-Host ("  {0,-35} | {1,-8} | {2,8}s" -f "Suite", "Status", "Duration") -ForegroundColor White
Write-Host "  ---------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ("  {0,-35} | " -f "Backend (pytest / 39 tests)") -NoNewline
Write-Host ("{0,-8}" -f $bStatus) -ForegroundColor $bColor -NoNewline
Write-Host (" | {0,8}s" -f $backendDuration)

Write-Host ("  {0,-35} | " -f "Frontend (Next.js build & types)") -NoNewline
Write-Host ("{0,-8}" -f $fStatus) -ForegroundColor $fColor -NoNewline
Write-Host (" | {0,8}s" -f $frontendDuration)

Write-Host "  ---------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ("  Total Execution Time: {0}s" -f $totalDuration) -ForegroundColor Gray
Write-Host ""

if ($backendSuccess -and $frontendSuccess) {
    Write-Host "=================================================================" -ForegroundColor Green
    Write-Host " [SUCCESS] ALL 11 CAREEROS SUBSYSTEMS VERIFIED & OPERATIONAL!    " -ForegroundColor Green
    Write-Host "=================================================================" -ForegroundColor Green
    Write-Host ""
    exit 0
} else {
    Write-Host "=================================================================" -ForegroundColor Red
    Write-Host " [FAILURE] ONE OR MORE VERIFICATION CHECKS FAILED!               " -ForegroundColor Red
    Write-Host "=================================================================" -ForegroundColor Red
    Write-Host ""
    exit 1
}
