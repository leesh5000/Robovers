@echo off
echo Starting Robovers Backend Server...
cd /d "%~dp0"

REM Check if .env file exists
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
)

REM Generate Prisma Client
echo Generating Prisma Client...
call npm run prisma:generate

REM Start the development server
echo Starting NestJS development server on port 4010...
call npm run start:dev

pause