# Start Cyber Security Testing Server
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Biru Cyber Security Testing Tool" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Kill existing Node processes
Write-Host "[1/4] Membersihkan proses Node.js yang sedang berjalan..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null | Out-Null
Start-Sleep -Seconds 2

# Generate Prisma Client
Write-Host "[2/4] Generating Prisma Client..." -ForegroundColor Yellow
npm run db:generate 2>&1 | Out-Null

# Start the development server
Write-Host "[3/4] Menjalankan development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Server akan berjalan di:" -ForegroundColor Green
Write-Host "  - Local:   http://localhost:3000" -ForegroundColor White
Write-Host "  - Network: http://192.168.1.18:3000" -ForegroundColor White
Write-Host ""
Write-Host "Tekan Ctrl+C untuk menghentikan server" -ForegroundColor Yellow
Write-Host ""

# Start server and keep it running
Write-Host "[4/4] Starting..." -ForegroundColor Yellow
npm run dev
