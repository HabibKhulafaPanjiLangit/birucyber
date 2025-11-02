@echo off
echo =====================================
echo   Biru Cyber Security Testing Tool
echo =====================================
echo.
echo [1/2] Killing existing Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo [2/2] Starting server...
echo.
echo Server akan berjalan di: http://localhost:3000
echo Tekan Ctrl+C untuk menghentikan
echo.

cd /d %~dp0
npm run dev

pause
