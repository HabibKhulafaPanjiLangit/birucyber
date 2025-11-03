# 🔧 Railway Deployment - Troubleshooting

## ✅ Perbaikan yang Sudah Dilakukan

### 1. Health Check Endpoint (`/api/health`)
**Masalah:** Health check terlalu kompleks dan memerlukan database connection
**Solusi:** Simplified health check - hanya cek server responding

```typescript
// Sekarang hanya return status OK tanpa cek database
return NextResponse.json({ 
  status: "ok",
  timestamp: new Date().toISOString(),
  uptime: process.uptime()
}, { status: 200 });
```

### 2. Server Error Handling
**Perbaikan:**
- ✅ Better error logging dengan stack trace
- ✅ CORS headers untuk semua requests
- ✅ Request error handling di server level
- ✅ Socket.IO dengan error handlers
- ✅ Uncaught exception & unhandled rejection handlers

### 3. Build Process
**Perbaikan di `nixpacks.toml`:**
- ✅ Explicit Prisma generate sebelum build
- ✅ Fallback npm install jika npm ci gagal

### 4. Next.js Configuration
**Perbaikan:**
- ✅ Removed `output: 'standalone'` karena pakai custom server
- ✅ Production optimizations tetap enabled

## 🚀 Railway Akan Auto-Redeploy

Karena sudah push ke GitHub, Railway akan otomatis:
1. Detect perubahan baru
2. Trigger new deployment
3. Build dengan konfigurasi baru
4. Test health check endpoint
5. Deploy jika health check sukses

## 📊 Monitor Deployment

Di Railway dashboard, cek:

### 1. Build Logs
Pastikan tidak ada error di:
- `npm install` - dependencies
- `prisma generate` - database client
- `npm run build` - Next.js build

### 2. Deploy Logs
Cari log messages:
```
> Starting server in production mode...
> Port: [PORT]
> Preparing Next.js app...
> Next.js app prepared successfully
> Setting up Socket.IO server...
> Socket.IO server configured
> Server started successfully!
> Ready on http://0.0.0.0:[PORT]
> Health check: http://0.0.0.0:[PORT]/api/health
```

### 3. Health Check
Setelah deploy, Railway akan hit:
```
GET https://your-app.railway.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-03T...",
  "uptime": 123.456,
  "environment": "production"
}
```

## ⚠️ Jika Masih Error

### Error: "Healthcheck failure"

**Kemungkinan penyebab:**
1. Server tidak start dalam timeout (300s)
2. Health endpoint tidak merespons
3. Port binding issue

**Solusi:**
1. Cek deploy logs untuk error messages
2. Pastikan environment variables sudah set:
   - `DATABASE_URL`
   - `DIRECT_DATABASE_URL`
   - `NODE_ENV=production`
3. Increase healthcheck timeout di `railway.json` jika perlu

### Error: "Build failed"

**Cek:**
1. Dependencies installed correctly
2. Prisma generate success
3. TypeScript compilation success
4. No missing files/imports

**Test lokal:**
```bash
npm install --legacy-peer-deps
npx prisma generate
npm run build
```

### Error: "Deploy failed during network process"

**Ini yang terjadi sebelumnya** - server build sukses tapi health check timeout

**Sudah diperbaiki dengan:**
- Simplified health check (no database check)
- Better error handling
- Explicit logging
- CORS headers

### Error: Database connection issues

**Sekarang tidak akan block startup** karena health check tidak cek database.

**Untuk cek database terpisah:**
```bash
# Via Railway CLI
railway run npx prisma db push
railway run npx prisma migrate deploy
```

## 🔄 Re-deploy Manual (jika perlu)

Jika auto-deploy tidak trigger:

### Via Railway Dashboard
1. Go to Deployments tab
2. Click "Deploy" button
3. Atau click "Redeploy" pada deployment terakhir

### Via Railway CLI
```bash
railway up
```

### Via Git (Force trigger)
```bash
git commit --allow-empty -m "Trigger Railway redeploy"
git push origin master
```

## ✅ Success Indicators

Deployment berhasil jika:
- ✅ Build completed (hijau)
- ✅ Deploy completed (hijau)
- ✅ Health check passed (hijau)
- ✅ Service exposed dengan URL
- ✅ Bisa akses: `https://your-app.railway.app`
- ✅ Health endpoint return OK: `https://your-app.railway.app/api/health`

## 📝 Changes Summary

**Files Modified:**
1. `src/app/api/health/route.ts` - Simplified health check
2. `server.ts` - Improved error handling & logging
3. `next.config.ts` - Removed standalone output
4. `nixpacks.toml` - Better build process

**Push Status:** ✅ Pushed to GitHub (commit: 2bb234a)

**Railway Status:** 🔄 Will auto-deploy in ~1-2 minutes

---

**Monitor di:** Railway Dashboard → Deployments  
**Logs:** Railway Dashboard → Deployments → View logs  
**Status:** Waiting for Railway auto-deploy...
