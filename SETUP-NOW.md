# 🚨 SETUP DATABASE SEKARANG - 5 MENIT!

## ❌ Error Saat Ini:
```
SCAN ERROR
Database not configured
DATABASE_URL environment variable is not set
```

## ✅ Solusi: Setup PostgreSQL di Railway (IKUTI LANGKAH INI!)

---

## 📍 STEP 1: Buka Railway Dashboard

**Link:** https://railway.app/dashboard

1. Login ke Railway
2. Klik project **`birucyber-production`** atau **`birucyber`**

**Tampilan:**
```
┌─────────────────────────────────┐
│  My Projects                    │
│                                 │
│  📦 birucyber-production       │  ← KLIK INI
│     2 services                  │
│                                 │
└─────────────────────────────────┘
```

---

## 📍 STEP 2: Add PostgreSQL Database

Setelah masuk project:

1. **Klik tombol `+ New`** (pojok kanan atas)
2. **Pilih `Database`**
3. **Pilih `Add PostgreSQL`**

**Tampilan:**
```
┌─────────────────────┐
│ + New              │
├─────────────────────┤
│ Empty Service       │
│ Database           │ ← KLIK INI
│ GitHub Repo         │
│ Template            │
└─────────────────────┘

Then:
┌─────────────────────┐
│ Select Database     │
├─────────────────────┤
│ 🐘 PostgreSQL      │ ← KLIK INI
│ 🔴 Redis            │
│ 🍃 MongoDB          │
└─────────────────────┘
```

4. **Tunggu 2-3 menit** - PostgreSQL sedang dibuat

**Tampilan setelah selesai:**
```
┌──────────────────────────────┐
│ birucyber-production         │
├──────────────────────────────┤
│ 📦 birucyber                │
│    Status: Running          │
│                             │
│ 🐘 PostgreSQL               │ ← BARU MUNCUL!
│    Status: Running          │
└──────────────────────────────┘
```

---

## 📍 STEP 3: Copy DATABASE_URL

1. **Klik service `PostgreSQL`** (yang baru dibuat)

**Tampilan:**
```
┌────────────────────────────────┐
│ PostgreSQL                     │
├────────────────────────────────┤
│ [Variables] [Settings] [Logs]  │
│                                │
│ Variables:                     │
│ ┌────────────────────────────┐│
│ │ DATABASE_URL               ││
│ │ postgresql://postgres:...  ││ ← INI YANG DICOPY!
│ │                            ││
│ │ PGHOST                     ││
│ │ containers-us-west...      ││
│ │                            ││
│ │ PGPORT                     ││
│ │ 5432                       ││
│ └────────────────────────────┘│
└────────────────────────────────┘
```

2. **Klik tab `Variables`**
3. **Cari variable `DATABASE_URL`**
4. **Klik icon copy** atau **select & copy text**

**Format yang akan kamu copy:**
```
postgresql://postgres:xxxxxxxxxxxxxxxxxxxxx@containers-us-west-123.railway.app:5432/railway
```

**⚠️ PENTING:** Copy SELURUH string, dari `postgresql://` sampai `/railway`

---

## 📍 STEP 4: Add DATABASE_URL ke BiruCyber Service

1. **Kembali ke dashboard project**
2. **Klik service `birucyber`** (BUKAN PostgreSQL!)

**Tampilan:**
```
┌────────────────────────────────┐
│ birucyber                      │ ← KLIK INI (bukan PostgreSQL)
├────────────────────────────────┤
│ [Variables] [Settings] [Logs]  │
│                                │
│ Variables:                     │
│ ┌────────────────────────────┐│
│ │ NODE_ENV                   ││
│ │ production                 ││
│ │                            ││
│ │ + New Variable             ││ ← KLIK INI
│ └────────────────────────────┘│
└────────────────────────────────┘
```

3. **Klik tab `Variables`**
4. **Klik `+ New Variable`**

**Form yang muncul:**
```
┌────────────────────────────────┐
│ Add Variable                   │
├────────────────────────────────┤
│ Variable Name:                 │
│ [DATABASE_URL              ]   │ ← Ketik ini (case-sensitive!)
│                                │
│ Variable Value:                │
│ [postgresql://postgres:xxx... ]│ ← Paste dari Step 3
│                                │
│ [Cancel]  [Add]               │ ← Klik Add
└────────────────────────────────┘
```

5. **Variable Name:** `DATABASE_URL` (HARUS PERSIS!)
6. **Variable Value:** Paste connection string dari Step 3
7. **Klik `Add`**

**Setelah di-add:**
```
┌────────────────────────────────┐
│ Variables:                     │
│ ┌────────────────────────────┐│
│ │ DATABASE_URL               ││ ← BARU MUNCUL!
│ │ postgresql://postgres:...  ││
│ │                            ││
│ │ NODE_ENV                   ││
│ │ production                 ││
│ └────────────────────────────┘│
└────────────────────────────────┘
```

---

## 📍 STEP 5: Wait for Auto-Redeploy

Railway akan **otomatis redeploy** aplikasi dengan database baru.

**Tampilan:**
```
┌────────────────────────────────┐
│ Deployments                    │
├────────────────────────────────┤
│ ⚡ Deploying...                │ ← TUNGGU INI
│    Detected config change      │
│    Building...                 │
└────────────────────────────────┘
```

**Progress:**
1. ⏳ Building... (30 detik)
2. ⏳ Deploying... (1 menit)
3. ✅ Success! (deployment selesai)

**Tunggu sampai status:**
```
✅ Deployment successful
   Last deployed: Just now
```

**Total waktu:** 2-3 menit

---

## 📍 STEP 6: TEST - Verify Database Connected!

### Test 1: Database Health Check

Buka URL ini di browser:
```
https://birucyber-production.up.railway.app/api/db-health
```

**Expected Response (BERHASIL):**
```json
{
  "database": "connected",
  "timestamp": "2025-11-03T...",
  "error": null,
  "environment": "production",
  "hasEnv": true
}
```

✅ **Jika muncul `"database": "connected"`** → DATABASE SUDAH SIAP!

❌ **Jika masih `"database": "disconnected"`:**
- Tunggu 1-2 menit lagi (deployment mungkin belum selesai)
- Refresh halaman
- Check Railway Logs untuk error

---

### Test 2: Run Scanner Test

1. **Buka:** https://birucyber-production.up.railway.app
2. **Klik tab:** SCANNER
3. **Input URL:** `https://google.com`
4. **Scan Type:** Quick Scan
5. **Klik:** START SCAN

**Expected:**
```
✅ Scan initiated successfully!
⏳ Scanning... (30-60 seconds)
✅ Results displayed with security score
```

❌ **Jika masih error** → Check Step 4 lagi, pastikan DATABASE_URL benar

---

### Test 3: Check Scan History

Buka URL:
```
https://birucyber-production.up.railway.app/api/scan-history
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "targetUrl": "https://google.com",
      "securityScore": 95,
      "status": "completed",
      ...
    }
  ],
  "pagination": {
    "total": 1,
    ...
  }
}
```

✅ **Jika ada data** → Scan tersimpan di database! SUCCESS! 🎉

---

## 🎉 SELESAI!

Setelah semua steps:

✅ **Scanner BiruCyber sekarang punya:**
- Database PostgreSQL running di Railway
- Persistent scan storage (never lost!)
- Scan history tracking
- Real-time statistics
- No errors!
- Professional-grade security tool!

✅ **Features yang aktif:**
- 50+ vulnerability detection patterns
- Technology stack detection
- Security headers analysis
- SSL/TLS checking
- Subdomain enumeration
- Exposed files detection
- **SEMUA HASIL TERSIMPAN DI DATABASE!**

---

## 🚨 TROUBLESHOOTING

### Error: "DATABASE_URL not found"

**Penyebab:** Variable belum di-add atau salah ketik

**Solusi:**
1. Railway → birucyber service → Variables
2. Check: Variable name HARUS **`DATABASE_URL`** (case-sensitive!)
3. Check: Value harus full connection string dari PostgreSQL
4. Redeploy jika perlu: Deployments → Redeploy

---

### Error: "Connection timeout"

**Penyebab:** PostgreSQL service belum ready atau connection string salah

**Solusi:**
1. Railway → PostgreSQL service → Check status: Should be "Running"
2. Copy DATABASE_URL lagi dari PostgreSQL Variables
3. Update di birucyber service Variables
4. Wait 2-3 min for redeploy

---

### Error: "Migration failed"

**Penyebab:** Database belum di-migrate

**Solusi:** Railway akan auto-migrate saat deploy
- Check Logs: Should see "Migration applied"
- Jika tidak, trigger redeploy manually

---

## 📞 NEED HELP?

**Dokumentasi:**
- Full Guide: `SETUP-DATABASE-PRODUCTION.md`
- Quick Start: `QUICK-START-DATABASE.md` (you are here!)
- Features: `MAKSIMAL-SCANNER-FEATURES.md`

**Check Railway Logs:**
```
Railway → birucyber service → Deployments → View Logs
```

Look for:
- ✅ `Prisma Client generated`
- ✅ `Migration applied`
- ✅ `Server running on port 3000`

---

## ⏱️ TOTAL TIME: 5-10 MINUTES

**Breakdown:**
- Step 1-2: Add PostgreSQL (3 min)
- Step 3: Copy URL (1 min)
- Step 4: Add Variable (1 min)
- Step 5: Wait deploy (2-3 min)
- Step 6: Test (2 min)

**Result:** Professional security scanner ready untuk menolong korban hack! 🛡️💙

---

**STATUS AFTER SETUP:**
```
✅ DATABASE: Connected
✅ SCANNER: Working
✅ SCAN HISTORY: Available
✅ STATISTICS: Available
✅ NO ERRORS: Clean!
✅ READY: Production!
```

## 🚀 MARI SETUP SEKARANG!

**Mulai dari Step 1:** https://railway.app/dashboard
