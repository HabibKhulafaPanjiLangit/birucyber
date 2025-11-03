# Verification Script for Railway Deployment
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Railway Deployment Verification" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$allChecks = $true

# Check 1: package.json
Write-Host "[1/11] Checking package.json..." -NoNewline
if (Test-Path "package.json") {
    $package = Get-Content "package.json" | ConvertFrom-Json
    if ($package.scripts.build -and $package.scripts.start) {
        Write-Host " OK" -ForegroundColor Green
    } else {
        Write-Host " MISSING SCRIPTS" -ForegroundColor Red
        $allChecks = $false
    }
} else {
    Write-Host " NOT FOUND" -ForegroundColor Red
    $allChecks = $false
}

# Check 2: railway.json
Write-Host "[2/11] Checking railway.json..." -NoNewline
if (Test-Path "railway.json") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " NOT FOUND" -ForegroundColor Red
    $allChecks = $false
}

# Check 3: nixpacks.toml
Write-Host "[3/11] Checking nixpacks.toml..." -NoNewline
if (Test-Path "nixpacks.toml") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " NOT FOUND" -ForegroundColor Red
    $allChecks = $false
}

# Check 4: next.config.ts
Write-Host "[4/11] Checking next.config.ts..." -NoNewline
if (Test-Path "next.config.ts") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " NOT FOUND" -ForegroundColor Red
    $allChecks = $false
}

# Check 5: server.ts
Write-Host "[5/11] Checking server.ts..." -NoNewline
if (Test-Path "server.ts") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " NOT FOUND" -ForegroundColor Red
    $allChecks = $false
}

# Check 6: Procfile
Write-Host "[6/11] Checking Procfile..." -NoNewline
if (Test-Path "Procfile") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " NOT FOUND" -ForegroundColor Red
    $allChecks = $false
}

# Check 7: prisma schema
Write-Host "[7/11] Checking prisma/schema.prisma..." -NoNewline
if (Test-Path "prisma/schema.prisma") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " NOT FOUND" -ForegroundColor Red
    $allChecks = $false
}

# Check 8: .env.example
Write-Host "[8/11] Checking .env.example..." -NoNewline
if (Test-Path ".env.example") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " WARNING" -ForegroundColor Yellow
}

# Check 9: node_modules
Write-Host "[9/11] Checking node_modules..." -NoNewline
if (Test-Path "node_modules") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " NOT FOUND" -ForegroundColor Red
    $allChecks = $false
}

# Check 10: Critical source files
Write-Host "[10/11] Checking critical source files..." -NoNewline
$criticalFiles = @(
    "src/lib/socket.ts",
    "src/lib/db.ts",
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/app/api/health/route.ts"
)
$missingFiles = @()
foreach ($file in $criticalFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}
if ($missingFiles.Count -eq 0) {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " MISSING FILES" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "  Missing: $file" -ForegroundColor Red
    }
    $allChecks = $false
}

# Check 11: Environment variables template
Write-Host "[11/11] Checking env variables template..." -NoNewline
$envExample = Get-Content ".env.example" -ErrorAction SilentlyContinue
if ($envExample -match "DATABASE_URL" -and $envExample -match "DIRECT_DATABASE_URL") {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " INCOMPLETE" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

if ($allChecks) {
    Write-Host "All checks passed! Ready to deploy to Railway." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Push code to GitHub" -ForegroundColor White
    Write-Host "2. Connect GitHub repo to Railway" -ForegroundColor White
    Write-Host "3. Add PostgreSQL database in Railway" -ForegroundColor White
    Write-Host "4. Set environment variables in Railway" -ForegroundColor White
    Write-Host "5. Deploy!" -ForegroundColor White
    Write-Host ""
    Write-Host "See DEPLOYMENT-GUIDE.md for detailed instructions." -ForegroundColor Cyan
} else {
    Write-Host "Some checks failed. Fix the issues above before deploying." -ForegroundColor Red
}

Write-Host ""
