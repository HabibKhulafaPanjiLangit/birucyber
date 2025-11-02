# 🧪 Final Comprehensive Test Script
# This script tests all security modules

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  BIRU CYBER SECURITY - COMPREHENSIVE TEST SUITE      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"
$passedTests = 0
$failedTests = 0

function Test-Module {
    param($name, $url, $method = "GET", $body = $null)
    
    Write-Host "Testing: $name..." -ForegroundColor Yellow -NoNewline
    
    try {
        if ($method -eq "GET") {
            $result = Invoke-RestMethod -Uri "$baseUrl$url" -Method GET -ErrorAction Stop
        } else {
            $result = Invoke-RestMethod -Uri "$baseUrl$url" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
        }
        
        Write-Host " ✓ PASS" -ForegroundColor Green
        $script:passedTests++
        return $result
    }
    catch {
        Write-Host " ✗ FAIL" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        $script:failedTests++
        return $null
    }
}

Write-Host "[1/10] Testing Server Health..." -ForegroundColor Cyan
Test-Module "Health Check" "/api/health"

Write-Host "`n[2/10] Testing SQL Injection Module..." -ForegroundColor Cyan
Test-Module "SQL Injection Info" "/api/sql-injection"
$sqlBody = @{username="admin"; password="admin123"; testMode="safe"} | ConvertTo-Json
Test-Module "SQL Safe Mode" "/api/sql-injection" "POST" $sqlBody
$sqlBody = @{username="' OR '1'='1' --"; password="x"; testMode="vulnerable"} | ConvertTo-Json
Test-Module "SQL Attack Mode" "/api/sql-injection" "POST" $sqlBody

Write-Host "`n[3/10] Testing XSS Module..." -ForegroundColor Cyan
Test-Module "XSS Info" "/api/xss"
$xssBody = @{comment="Test"; testMode="safe"} | ConvertTo-Json
Test-Module "XSS Safe Mode" "/api/xss" "POST" $xssBody
$xssBody = @{comment="<script>alert('XSS')</script>"; testMode="vulnerable"} | ConvertTo-Json
Test-Module "XSS Attack Mode" "/api/xss" "POST" $xssBody

Write-Host "`n[4/10] Testing Access Control Module..." -ForegroundColor Cyan
Test-Module "Access Control Info" "/api/access-control"
$acBody = @{resource="/admin"; userToken="guest-token-789"; testMode="safe"} | ConvertTo-Json
Test-Module "Access Control Safe" "/api/access-control" "POST" $acBody

Write-Host "`n[5/10] Testing CSRF Module..." -ForegroundColor Cyan
Test-Module "CSRF Info" "/api/csrf"
$csrfBody = @{action="transfer"; amount=100; recipient="test"; sessionToken="session-admin-abc123"; testMode="vulnerable"} | ConvertTo-Json
Test-Module "CSRF Attack Mode" "/api/csrf" "POST" $csrfBody

Write-Host "`n[6/10] Testing Security Headers Module..." -ForegroundColor Cyan
Test-Module "Security Headers Info" "/api/security-headers"
$headersBody = @{testMode="vulnerable"} | ConvertTo-Json
Test-Module "Security Headers Scan" "/api/security-headers" "POST" $headersBody

Write-Host "`n[7/10] Testing Rate Limiting Module..." -ForegroundColor Cyan
Test-Module "Rate Limiting Info" "/api/rate-limiting"
$rateBody = @{action="login"; username="admin"; password="wrong"; testMode="vulnerable"} | ConvertTo-Json
Test-Module "Brute Force Test" "/api/rate-limiting" "POST" $rateBody

Write-Host "`n[8/10] Testing Dashboard..." -ForegroundColor Cyan
$dashboard = Test-Module "Dashboard" "/api/dashboard"

Write-Host "`n[9/10] Testing Modules API..." -ForegroundColor Cyan
Test-Module "Modules List" "/api/modules"

Write-Host "`n[10/10] Running Comprehensive Test Suite..." -ForegroundColor Cyan
$allTests = Test-Module "All Tests" "/api/test-all"

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                  TEST RESULTS                          ║" -ForegroundColor Cyan
Write-Host "╠════════════════════════════════════════════════════════╣" -ForegroundColor Cyan

if ($allTests) {
    Write-Host "║  Total Modules:     $($allTests.totalModules)                                   ║" -ForegroundColor Green
    Write-Host "║  Tests Executed:    $($allTests.summary.total)                                  ║" -ForegroundColor Green
    Write-Host "║  Tests Passed:      $($allTests.summary.passed)                                  ║" -ForegroundColor Green
    Write-Host "║  Tests Failed:      $($allTests.summary.failed)                                   ║" -ForegroundColor Green
    Write-Host "║  Success Rate:      $($allTests.summary.successRate)%                               ║" -ForegroundColor Green
}

Write-Host "╠════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
Write-Host "║  Manual Tests:      $passedTests Passed, $failedTests Failed                      ║" -ForegroundColor $(if($failedTests -eq 0){"Green"}else{"Yellow"})
Write-Host "╠════════════════════════════════════════════════════════╣" -ForegroundColor Cyan

if ($allTests -and $allTests.summary.successRate -eq 100 -and $failedTests -eq 0) {
    Write-Host "║           ✓ ALL SYSTEMS OPERATIONAL ✓                  ║" -ForegroundColor Green
} else {
    Write-Host "║           ⚠ SOME TESTS FAILED ⚠                        ║" -ForegroundColor Yellow
}

Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`nAvailable Modules:" -ForegroundColor Cyan
if ($allTests) {
    $allTests.modulesAvailable | ForEach-Object {
        Write-Host "  ✓ $_" -ForegroundColor White
    }
}

Write-Host "`n📚 For detailed documentation, see:" -ForegroundColor Yellow
Write-Host "  - FEATURES.md     (Complete feature list)" -ForegroundColor White
Write-Host "  - QUICK-TEST.md   (Quick test commands)" -ForegroundColor White
Write-Host "  - README.md       (Getting started guide)" -ForegroundColor White

Write-Host "" 
Write-Host "Access the application at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
