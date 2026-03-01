# =============================================================
#  SEO-AI  --  Dev Server
#  Usage:  .\dev.ps1
# =============================================================

$Root   = $PSScriptRoot
$Server = Join-Path $Root "server"
$Client = Join-Path $Root "client"

# -- Banner --------------------------------------------------
Write-Host ""
Write-Host "  ======================================" -ForegroundColor Magenta
Write-Host "         SEO * AI  --  Enterprise        " -ForegroundColor Cyan
Write-Host "         Dev Launcher                    " -ForegroundColor White
Write-Host "  ======================================" -ForegroundColor Magenta
Write-Host ""

# -- Pre-flight: check node_modules --------------------------
function Ensure-Deps($dir, $label) {
    if (-not (Test-Path (Join-Path $dir "node_modules"))) {
        Write-Host "  [INSTALL] $label dependencies..." -ForegroundColor Yellow
        Push-Location $dir
        npm install --silent
        Pop-Location
        Write-Host "  [OK]      $label ready" -ForegroundColor Green
    }
}

Ensure-Deps $Root   "Root (concurrently)"
Ensure-Deps $Server "Server"
Ensure-Deps $Client "Client"

# -- .env check ----------------------------------------------
$envFile = Join-Path $Server ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "  [WARN]    server/.env not found -- create it with your API keys" -ForegroundColor Yellow
    Write-Host ""
}

# -- Launch ---------------------------------------------------
Write-Host "  Starting services..." -ForegroundColor White
Write-Host ""
Write-Host "  [SERVER]  http://localhost:5000" -ForegroundColor Magenta
Write-Host "  [CLIENT]  http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Press Ctrl+C to stop all services" -ForegroundColor DarkGray
Write-Host "  ----------------------------------------" -ForegroundColor DarkGray
Write-Host ""

Set-Location $Root
npm run dev
