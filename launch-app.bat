@echo off
REM Group Change Walkthrough Launcher for Windows
REM This script launches the Group Change Walkthrough application

echo Starting Group Change Walkthrough...

REM Get the directory where this script is located
cd /d "%~dp0"

REM Check if node_modules exists, if not run npm install
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

REM Start the Vite dev server and open in browser
call npm run dev -- --open

pause
