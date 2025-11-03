# 🚀 QUICK START: Setup Database Production

## Panduan Cepat Setup PostgreSQL untuk BiruCyber Scanner

**Waktu Setup: 5-10 menit**

---

## ✅ STEP 1: Buat PostgreSQL Database di Railway

### 1.1 Login ke Railway
```
https://railway.app/dashboard
```

### 1.2 Buka Project BiruCyber
- Klik project `birucyber-production`

### 1.3 Add Database
1. Klik tombol **`+ New`**
2. Pilih **`Database`**
3. Pilih **`Add PostgreSQL`**
4. Tunggu provisioning selesai (2-3 menit)

### 1.4 Cek Database Created
Anda akan melihat service baru bernama **`PostgreSQL`** muncul di dashboard.

---

## ✅ STEP 2: Copy DATABASE_URL

### 2.1 Klik Service PostgreSQL
- Klik card **`PostgreSQL`** di dashboard

### 2.2 Tab "Variables"
- Klik tab **`Variables`**

### 2.3 Copy DATABASE_URL
Anda akan melihat variable:
```
DATABASE_URL=postgresql://postgres:PASSWORD@hostname.railway.app:5432/railway
```

**COPY** nilai lengkap `DATABASE_URL` ini!

Contoh:
```
postgresql://postgres:abc123xyz@containers-us-west-12.railway.app:7890/railway
```

---

## ✅ STEP 3: Add DATABASE_URL ke BiruCyber Service

### 3.1 Klik Service BiruCyber
- Kembali ke dashboard
- Klik card **`birucyber`** (BUKAN PostgreSQL)

### 3.2 Tab "Variables"
- Klik tab **`Variables`**

### 3.3 Add New Variable
1. Klik **`+ New Variable`**
2. **Variable Name**: `DATABASE_URL`
3. **Value**: Paste connection string dari Step 2
   ```
   postgresql://postgres:abc123xyz@containers-us-west-12.railway.app:7890/railway
   ```
4. Klik **`Add`**

### 3.4 Save Changes
Railway akan otomatis trigger **redeploy** (tunggu 2-3 menit).

---

## ✅ STEP 4: Verify Deployment

### 4.1 Check Logs
1. Service BiruCyber → Tab **`Deployments`**
2. Klik deployment terbaru
3. Click **`View Logs`**

### 4.2 Look for SUCCESS
Cari pesan sukses di logs:
```
✓ Prisma Client generated
✓ Migration applied: 20251102084221_init  
✓ Server running on port 3000
```

### 4.3 Check Database Health
Buka URL:
```
https://birucyber-production.up.railway.app/api/db-health
```

**Expected Response:**
```json
{
  "database": "connected",
  "timestamp": "2025-11-03T...",
  "error": null,
  "environment": "production",
  "hasEnv": true
}
```

✅ Jika `"database": "connected"` → Database READY!

---

## ✅ STEP 5: Test Scanner

### 5.1 Open Scanner
```
https://birucyber-production.up.railway.app
```

### 5.2 Tab SCANNER
Klik tab **SCANNER** di navigation

### 5.3 Run Test Scan
1. **URL**: `https://google.com`
2. **Scan Type**: Quick Scan
3. Klik **START SCAN**

### 5.4 Wait for Results
Tunggu 30-60 detik, hasil akan muncul.

### 5.5 Verify Saved to Database
Buka:
```
https://birucyber-production.up.railway.app/api/scan-history
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cuid...",
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

✅ Jika ada data → Scan tersimpan di database!

---

## 🎉 SELESAI!

**Scanner BiruCyber sekarang:**
- ✅ Connected ke PostgreSQL
- ✅ Scan results tersimpan permanent
- ✅ No errors
- ✅ Production-ready
- ✅ Professional tool!

---

## 📊 Fitur Baru yang Tersedia

### 1. Scan History API
```bash
GET /api/scan-history?page=1&limit=10
GET /api/scan-history?targetUrl=google.com
GET /api/scan-history?status=completed
GET /api/scan-history?severity=critical

DELETE /api/scan-history?id=scan_123
DELETE /api/scan-history?olderThan=30  # Delete > 30 days old
```

### 2. Statistics API
```bash
GET /api/stats

Response:
{
  "stats": {
    "overview": {
      "totalScans": 150,
      "completedScans": 142,
      "failedScans": 8,
      "successRate": 94.67,
      "averageSecurityScore": 78,
      "averageScanDuration": 45
    },
    "vulnerabilities": {
      "critical": 12,
      "high": 28,
      "sqlInjection": 5,
      "xss": 8,
      "brokenAccessControl": 3
    },
    "recentScans": [...],
    "topVulnerableUrls": [...]
  }
}
```

### 3. Database Health Check
```bash
GET /api/db-health

Response:
{
  "database": "connected",
  "timestamp": "2025-11-03T10:30:00.000Z",
  "error": null,
  "environment": "production",
  "hasEnv": true
}
```

---

## 🔧 Troubleshooting

### Error: "database": "disconnected"

**Solution 1: Check DATABASE_URL**
- Railway Dashboard → BiruCyber Service → Variables
- Pastikan `DATABASE_URL` ada dan benar

**Solution 2: Check PostgreSQL Running**
- Railway Dashboard → PostgreSQL Service
- Pastikan status **Running** (bukan Sleeping)

**Solution 3: Redeploy**
```
Railway → BiruCyber Service → Deployments → Redeploy
```

### Error: "Migration failed"

**Solution:** Run migration manually
1. Railway Dashboard → BiruCyber Service → Settings
2. Build Command: `npm run build && npx prisma migrate deploy`
3. Redeploy

### Error: "Cannot find table websitescan"

**Solution:** Generate & migrate
```bash
# Local terminal
$env:DATABASE_URL="postgresql://..."  # Your Railway URL
npx prisma generate
npx prisma migrate deploy
```

---

## 📈 Next Steps

### 1. Optimize Schema
File: `prisma/schema.prisma` sudah dioptimize dengan:
- ✅ Indexes untuk performance
- ✅ Field types yang efisien (@db.VarChar, @db.SmallInt)
- ✅ New fields: subdomains, exposedFiles

### 2. Add More Features
- [ ] Scan history UI dengan pagination
- [ ] Statistics dashboard
- [ ] Export to PDF/JSON
- [ ] User authentication
- [ ] Scheduled scans
- [ ] Email notifications

### 3. Monitor Performance
- Check Railway metrics (CPU, Memory, Database size)
- Review slow queries
- Optimize if needed

---

## 💡 Tips

### Database Limits (Railway Free Tier)
- **Storage**: 8 GB
- **Connections**: Shared (sufficient for this app)
- **Backups**: Automatic daily backups

### Cleanup Old Scans
Automatically delete scans older than 30 days:
```bash
DELETE /api/scan-history?olderThan=30&status=completed
```

### Monitor Database Size
Railway Dashboard → PostgreSQL → Metrics → Storage Usage

---

## ✅ CHECKLIST FINAL

- [ ] PostgreSQL database created in Railway
- [ ] DATABASE_URL copied
- [ ] DATABASE_URL added to BiruCyber service
- [ ] Deployment successful
- [ ] /api/db-health returns "connected"
- [ ] Test scan completed
- [ ] Scan saved to database
- [ ] /api/scan-history shows data
- [ ] /api/stats returns statistics

**Jika semua ✅ → READY untuk menolong orang-orang yang terkena hack!** 🛡️

---

## 📞 Support

**Dokumentasi Lengkap:**
- `SETUP-DATABASE-PRODUCTION.md` - Full guide dengan detail
- `MAKSIMAL-SCANNER-FEATURES.md` - Scanner features
- `EXTERNAL-SCANNER-GUIDE.md` - How to use scanner

**Railway Docs:**
- https://docs.railway.app/databases/postgresql

---

**Status:** ✅ PRODUCTION-READY  
**Last Updated:** November 3, 2025  
**Version:** 2.0 - Database Production
