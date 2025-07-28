# PowerShell script to start the backend development server

Write-Host "Starting Robovers Backend Development Server..." -ForegroundColor Green

# Check if .env file exists
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
}

# Generate Prisma Client
Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
npm run prisma:generate

# Start the development server
Write-Host "Starting NestJS development server on port 4010..." -ForegroundColor Green
npm run start:dev