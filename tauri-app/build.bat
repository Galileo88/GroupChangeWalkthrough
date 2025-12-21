@echo off
echo ============================================
echo Provider Enrollment Walkthrough - Builder
echo ============================================
echo.

echo [1/3] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo [2/3] Building application (this may take 10-15 minutes on first build)...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo.

echo [3/3] Build complete!
echo.
echo Your installer is located at:
echo src-tauri\target\release\bundle\msi\
echo.
echo Look for a file like: Provider Enrollment Walkthrough_1.0.0_x64_en-US.msi
echo.
pause
