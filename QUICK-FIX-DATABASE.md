# 🚨 QUICK FIX: Database Error di Railway

## Error yang Muncul:
```
❌ SCAN ERROR
Failed to initiate scan:
Invalid `prisma.websiteScan.create()` invocation:

error: Environment variable not found: DATABASE_URL.
```

## 🔧 Solusi Cepat (5 menit):

### **Option 1: Set Environment Variables di Railway Dashboard**

1. **Buka Railway Dashboard**
   - Go to: https://railway.app/dashboard
   - Select project: `birucyber`
   - Click pada service yang running

2. **Go to Variables Tab**
   - Click tab "Variables" di menu atas

3. **Add Variables**
   - Click "New Variable"
   - Add this:
   ```
   Variable Name: DATABASE_URL
   Value: ${{Postgres.DATABASE_URL}}
   ```
   - Click "Add"
   
   - Click "New Variable" lagi
   - Add this:
   ```
   Variable Name: DIRECT_DATABASE_URL  
   Value: ${{Postgres.DATABASE_PRIVATE_URL}}
   ```
   - Click "Add"

4. **Redeploy**
   - Railway akan auto-redeploy
   - Atau manual: Click "Deploy" → "Redeploy"

5. **Wait 2-3 minutes**
   - Build akan selesai
   - Service akan restart dengan variables baru

---

### **Option 2: Connect PostgreSQL Plugin (Jika Belum Ada)**

1. **Check PostgreSQL Plugin**
   - Di Railway dashboard, lihat sidebar
   - Apakah ada "Postgres" plugin?

2. **Jika Belum Ada, Add Plugin:**
   - Click "New" di project
   - Select "Database"
   - Choose "Add PostgreSQL"
   - Wait for provisioning (~1 minute)

3. **Link to Service:**
   - Variables akan auto-populate
   - `${{Postgres.DATABASE_URL}}` akan tersedia

4. **Redeploy Service**
   - Click pada service
   - Click "Deploy" → "Redeploy"

---

### **Option 3: Manual Set Database URL**

Jika plugin tidak work, set manual:

1. **Get Database URL from Prisma:**
   - From your `.env` file:
   ```
   DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."
   DIRECT_DATABASE_URL="postgres://...@db.prisma.io:5432/postgres?sslmode=require"
   ```

2. **Set di Railway Variables:**
   ```
   DATABASE_URL = [paste from .env]
   DIRECT_DATABASE_URL = [paste from .env]
   ```

3. **Redeploy**

---

## ✅ Verifikasi Success

Setelah redeploy, check:

### **1. Railway Logs**
```
✓ Prisma schema loaded
✓ Generated Prisma Client
✓ Database connected
✓ Server running on port 3000
```

### **2. Test Scanner**
- Buka website
- Go to SCANNER tab
- Input URL: `https://example.com`
- Click START SCAN
- Should work! ✅

---

## 🐛 Troubleshooting

### **Still showing error?**

**Check 1: Variables Set?**
```
Railway Dashboard → Service → Variables
✓ DATABASE_URL exists?
✓ DIRECT_DATABASE_URL exists?
```

**Check 2: PostgreSQL Plugin Running?**
```
Railway Dashboard → Postgres plugin
✓ Status: Active?
✓ CPU/Memory usage showing?
```

**Check 3: Deployment Success?**
```
Railway Dashboard → Deployments
✓ Latest deployment: Success?
✓ Build logs: No errors?
```

### **Common Issues:**

**Issue 1: "Can't reach database server"**
```
Solution: Check Postgres plugin is running
- Go to Postgres plugin
- Click "Restart" if needed
```

**Issue 2: "Invalid connection string"**
```
Solution: Regenerate variables
- Delete DATABASE_URL variable
- Re-add: ${{Postgres.DATABASE_URL}}
- Redeploy
```

**Issue 3: "Prisma Client not generated"**
```
Solution: Force regenerate
- Add build command in Railway:
  npm run build && npx prisma generate
```

---

## 📋 Current Setup

**Your .env (Local):**
```env
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."
DIRECT_DATABASE_URL="postgres://...@db.prisma.io:5432/postgres"
```

**Needed in Railway:**
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
DIRECT_DATABASE_URL=${{Postgres.DATABASE_PRIVATE_URL}}
NODE_ENV=production
PORT=3000
```

---

## 🚀 After Fix

**Timeline:**
1. Set variables: 1 minute
2. Railway redeploy: 2-3 minutes
3. Service restart: 30 seconds
4. **Total: ~5 minutes**

**Expected Result:**
- ✅ No more DATABASE_URL error
- ✅ Scanner works perfectly
- ✅ Can scan any website
- ✅ Results saved to database

---

## 💡 Prevention

**For future deployments:**

1. **Always check Railway Variables first**
2. **Ensure PostgreSQL plugin is connected**
3. **Test with simple query before complex features**
4. **Monitor Railway logs during deployment**

---

## 📞 Next Steps

1. **Go to Railway Dashboard NOW**
2. **Add DATABASE_URL variable**
3. **Wait for redeploy**
4. **Test scanner**
5. **Report back hasil!**

---

**Status:** 🔧 Waiting for Railway variables setup
**ETA Fix:** 5 minutes
**Action Required:** Set DATABASE_URL in Railway Dashboard
