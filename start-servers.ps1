# PowerShell script to start both servers
Write-Host "Starting Robovers servers..." -ForegroundColor Green

# Start backend in new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run start:dev" -WorkingDirectory $PSScriptRoot

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend in new PowerShell window  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WorkingDirectory $PSScriptRoot

Write-Host "Servers starting..." -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:4000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:4010/api" -ForegroundColor Cyan
Write-Host "Swagger Docs: http://localhost:4010/api/docs" -ForegroundColor Cyan