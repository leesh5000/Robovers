# PowerShell script to start Robovers project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Robovers 프로젝트 시작" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 백엔드 환경 설정
Write-Host "`n[1/4] 백엔드 환경 설정 중..." -ForegroundColor Yellow
cd backend
if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env 파일 생성 완료" -ForegroundColor Green
}

# Prisma 클라이언트 생성
Write-Host "`n[2/4] Prisma 클라이언트 생성 중..." -ForegroundColor Yellow
npm run prisma:generate

# 백엔드 서버 시작
Write-Host "`n[3/4] 백엔드 서버 시작 중..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run start:dev"

# 프론트엔드로 이동
cd ..
cd frontend

# 프론트엔드 서버 시작
Write-Host "`n[4/4] 프론트엔드 서버 시작 중..." -ForegroundColor Yellow
Start-Sleep -Seconds 5  # 백엔드 시작 대기
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "서버 시작 완료!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`n접속 URL:" -ForegroundColor Yellow
Write-Host "- 프론트엔드: http://localhost:4000" -ForegroundColor White
Write-Host "- 백엔드 API: http://localhost:4010/api" -ForegroundColor White
Write-Host "- API 문서: http://localhost:4010/api/docs" -ForegroundColor White
Write-Host "- MailHog: http://localhost:8025" -ForegroundColor White
Write-Host "- pgAdmin: http://localhost:8080" -ForegroundColor White

Write-Host "`n브라우저에서 회원가입 테스트: http://localhost:4000/signup" -ForegroundColor Cyan