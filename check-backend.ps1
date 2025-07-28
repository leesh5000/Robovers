# Backend dependency check script
Write-Host "Checking backend dependencies..." -ForegroundColor Yellow

# Check if Docker is running
Write-Host "`nChecking Docker status..." -ForegroundColor Cyan
try {
    docker ps > $null 2>&1
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running. Please start Docker Desktop!" -ForegroundColor Red
    Write-Host "  Backend requires PostgreSQL and Redis containers" -ForegroundColor Yellow
    exit 1
}

# Check if required containers are running
Write-Host "`nChecking required containers..." -ForegroundColor Cyan
$containers = docker ps --format "table {{.Names}}" | Select-String "robovers-postgres|robovers-redis"

if ($containers.Count -lt 2) {
    Write-Host "✗ Required containers are not running" -ForegroundColor Red
    Write-Host "  Running docker-compose up -d..." -ForegroundColor Yellow
    docker-compose up -d
    Start-Sleep -Seconds 5
}

Write-Host "`nStarting backend server..." -ForegroundColor Green
cd backend
npm run start:dev