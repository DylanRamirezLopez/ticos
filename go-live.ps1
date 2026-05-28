param(
  [switch]$NoInstall,
  [switch]$Build
)

$ErrorActionPreference = "Stop"
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $rootDir

Clear-Host
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TICOS - Go Live (MERN Instagram Clone)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

try {
  $nodeVersion = node --version
  Write-Host "V Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
  Write-Host "X Node.js is not installed. Install from https://nodejs.org" -ForegroundColor Red
  exit 1
}

try {
  $npmVersion = npm --version
  Write-Host "V npm v$npmVersion detected" -ForegroundColor Green
} catch {
  Write-Host "X npm is not available" -ForegroundColor Red
  exit 1
}

if (-not $NoInstall) {
  Write-Host ""
  Write-Host "Installing root dependencies..." -ForegroundColor Yellow
  npm install

  Write-Host ""
  Write-Host "Installing server dependencies..." -ForegroundColor Yellow
  Set-Location (Join-Path $rootDir "server")
  npm install
  if (-not (Test-Path ".env")) {
    @"
MONGO_URI=mongodb://localhost:27017/ticos
JWT_SECRET=ticos_super_secret_key_change_in_production
PORT=5000
"@ | Set-Content ".env" -Encoding UTF8
    Write-Host "V Created server/.env with defaults" -ForegroundColor Green
  }

  Write-Host ""
  Write-Host "Installing client dependencies..." -ForegroundColor Yellow
  Set-Location (Join-Path $rootDir "client")
  npm install

  Set-Location $rootDir
}

if (-not (Test-Path (Join-Path $rootDir "server\.env"))) {
  @"
MONGO_URI=mongodb://localhost:27017/ticos
JWT_SECRET=ticos_super_secret_key_change_in_production
PORT=5000
"@ | Set-Content (Join-Path $rootDir "server\.env") -Encoding UTF8
  Write-Host "V Created server/.env" -ForegroundColor Green
}

Write-Host ""
try {
  $mongoProcess = Get-Process "mongod" -ErrorAction SilentlyContinue
  if ($mongoProcess) {
    Write-Host "V MongoDB is running (PID: $($mongoProcess.Id))" -ForegroundColor Green
  } else {
    Write-Host "W MongoDB does not appear to be running." -ForegroundColor Yellow
    Write-Host "  Make sure MongoDB is started before using the app." -ForegroundColor Yellow
  }
} catch {
  Write-Host "W Could not check MongoDB status" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Launching TICOS..." -ForegroundColor Cyan
Write-Host ""
Write-Host "   Backend  -> http://localhost:5000" -ForegroundColor Yellow
Write-Host "   Frontend -> http://localhost:3000" -ForegroundColor Yellow
Write-Host "   API      -> http://localhost:5000/api/health" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Hot Reload: ACTIVE" -ForegroundColor Green
Write-Host "   Changes to server/ -> auto-restart (nodemon)" -ForegroundColor Green
Write-Host "   Changes to client/ -> auto-refresh (react-scripts)" -ForegroundColor Green
Write-Host ""

npx concurrently -n "API,UI" -c "cyan,magenta" "cd server && npx nodemon index.js" "cd client && npm start"
