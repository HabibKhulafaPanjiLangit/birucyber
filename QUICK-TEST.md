# 🚀 Quick Testing Guide

## Start Server
```bash
start-server.bat
```
Server akan berjalan di: http://localhost:3000

---

## 🧪 Quick Test Commands

### Test All Modules
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/test-all" -Method GET
```

### 1. SQL Injection
```powershell
# Attack Test
$body = @{username="' OR '1'='1' --"; password="x"; testMode="vulnerable"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/sql-injection" -Method POST -Body $body -ContentType "application/json"
```

### 2. XSS
```powershell
# Attack Test
$body = @{comment="<script>alert('XSS')</script>"; testMode="vulnerable"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/xss" -Method POST -Body $body -ContentType "application/json"
```

### 3. CSRF
```powershell
# Attack Test
$body = @{action="transfer"; amount=1000; recipient="attacker"; sessionToken="session-admin-abc123"; testMode="vulnerable"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/csrf" -Method POST -Body $body -ContentType "application/json"
```

### 4. Security Headers
```powershell
# Scan Headers
$body = @{testMode="vulnerable"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/security-headers" -Method POST -Body $body -ContentType "application/json"
```

### 5. Brute Force
```powershell
# Simulate Multiple Attempts
1..15 | ForEach-Object {
    $body = @{action="login"; username="admin"; password="wrong$_"; testMode="vulnerable"} | ConvertTo-Json
    Invoke-RestMethod -Uri "http://localhost:3000/api/rate-limiting" -Method POST -Body $body -ContentType "application/json"
    Start-Sleep -Milliseconds 100
}
```

### 6. View Dashboard
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/dashboard" -Method GET
```

---

## 📊 Expected Results

✅ **18/18 Tests Pass** = All modules working perfectly
✅ **Attacks Detected** = Security vulnerabilities demonstrated
✅ **Dashboard Logs** = Real-time monitoring active

---

## 🌐 Web Interface

Open browser: http://localhost:3000

**Available Tabs:**
- Terminal (Command interface)
- SQL Injection Testing
- XSS Testing  
- Access Control Testing
- Dashboard/Scan Results

---

## ⚡ One-Line Full Test
```powershell
Invoke-RestMethod "http://localhost:3000/api/test-all" | Format-List
```

---

## 🎯 Quick Module Status Check
```powershell
(Invoke-RestMethod "http://localhost:3000/api/test-all").summary
```

Expected output:
```
total       : 18
passed      : 18
failed      : 0
successRate : 100
```
