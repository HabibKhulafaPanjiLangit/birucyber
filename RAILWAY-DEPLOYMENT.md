# 🚀 RAILWAY DEPLOYMENT GUIDE - BiruCyber Platform

## 📋 Prerequisites

- GitHub account
- Railway account (sign up at https://railway.app)
- Git installed locally

---

## 🎯 Step-by-Step Deployment

### **Step 1: Install Railway CLI**

```bash
npm install -g @railway/cli
```

### **Step 2: Login to Railway**

```bash
railway login
```

Browser akan terbuka untuk authentication.

### **Step 3: Initialize Railway Project**

```bash
# Di folder project
cd D:\birucyber

# Initialize Railway
railway init
```

Pilih:
- Create new project: **birucyber**
- Environment: **production**

### **Step 4: Link GitHub Repository**

```bash
railway link
```

Atau via Railway Dashboard:
1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose: **HabibKhulafaPanjiLangit/birucyber**

### **Step 5: Add PostgreSQL Database**

```bash
railway add
```

Pilih: **PostgreSQL**

Atau via Dashboard:
1. Click "+ New"
2. Select "Database"
3. Choose "PostgreSQL"

### **Step 6: Set Environment Variables**

Railway akan auto-set:
- ✅ `DATABASE_URL` (dari PostgreSQL)
- ✅ `DIRECT_DATABASE_URL` (dari PostgreSQL)

Tambahan manual (optional):
```bash
railway variables set NODE_ENV=production
railway variables set PORT=3000
```

### **Step 7: Deploy!**

```bash
# Deploy from local
railway up

# Or push to GitHub (auto-deploy)
git push origin master
```

### **Step 8: Generate Public URL**

```bash
railway domain
```

Atau via Dashboard:
1. Go to your service
2. Click "Settings"
3. Scroll to "Networking"
4. Click "Generate Domain"

---

## 🔧 Configuration Files Created

### `railway.json`
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npx prisma generate && npm run build"
  },
  "deploy": {
    "startCommand": "node --loader tsx server.ts",
    "restartPolicyType": "ON_FAILURE",
    "healthcheckPath": "/api/health"
  }
}
```

### `nixpacks.toml`
- Build configuration
- Node.js 20
- PostgreSQL provider
- Prisma generation

### `package.json` (Updated)
- ✅ `railway:build` script
- ✅ `railway:start` script

---

## 📊 Deployment Process

```
1. Push to GitHub
   ↓
2. Railway detects changes
   ↓
3. Install dependencies (npm ci)
   ↓
4. Generate Prisma Client
   ↓
5. Build Next.js (npm run build)
   ↓
6. Start server (npx tsx server.ts)
   ↓
7. Health check (/api/health)
   ↓
8. ✅ DEPLOYED!
```

---

## 🌐 Your URLs After Deployment

```
Production URL:    https://birucyber.up.railway.app
API Endpoints:     https://birucyber.up.railway.app/api/*
WebSocket:         wss://birucyber.up.railway.app/api/socketio
Health Check:      https://birucyber.up.railway.app/api/health
```

---

## ✅ What Works on Railway

All features will work perfectly:

- ✅ **Custom Server** (server.ts)
- ✅ **Socket.IO** (Real-time WebSocket)
- ✅ **PostgreSQL Database**
- ✅ **Prisma ORM**
- ✅ **All API Endpoints** (25+)
- ✅ **242+ Exploit Payloads**
- ✅ **Real-time Attack Monitoring**
- ✅ **Auto-save to Database**
- ✅ **WebSocket Broadcasting**
- ✅ **Advanced Analytics**

---

## 🔍 Verify Deployment

### Check Health
```bash
curl https://birucyber.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-02T...",
  "database": "connected",
  "uptime": 123
}
```

### Check Payloads
```bash
curl https://birucyber.up.railway.app/api/payloads
```

### Check Analytics
```bash
curl https://birucyber.up.railway.app/api/analytics
```

---

## 🐛 Troubleshooting

### Build Failed?
```bash
# Check logs
railway logs

# Rebuild
railway up --force
```

### Database Connection Error?
```bash
# Check variables
railway variables

# Regenerate Prisma
railway run npx prisma generate
railway run npx prisma db push
```

### Port Issues?
Railway auto-assigns PORT. Server will use `process.env.PORT || 3000`

---

## 📈 Monitor Deployment

### Via CLI
```bash
# View logs
railway logs

# View status
railway status

# Open in browser
railway open
```

### Via Dashboard
1. Go to https://railway.app/dashboard
2. Select your project
3. View:
   - 📊 Metrics (CPU, Memory, Network)
   - 📝 Logs (Real-time)
   - 🔄 Deployments (History)
   - ⚙️ Settings

---

## 💰 Pricing

### Free Tier (Hobby Plan)
- ✅ $5 credit per month
- ✅ Enough for development & testing
- ✅ ~550 hours runtime
- ✅ PostgreSQL included

### Paid Plans
- Developer: $20/month
- Team: Custom pricing

---

## 🚀 Post-Deployment

### Update Code
```bash
# Local changes
git add .
git commit -m "Update features"
git push origin master

# Railway auto-deploys! 🎉
```

### Monitor Performance
```bash
railway metrics
```

### Scale Up (if needed)
Dashboard → Settings → Resources → Increase

---

## 🎉 SUCCESS!

Your BiruCyber Cyber Security Platform is now:
- ✅ Live on the internet
- ✅ Accessible globally
- ✅ Auto-scaling
- ✅ Professional deployment
- ✅ PostgreSQL database
- ✅ Real-time WebSocket

**Platform URL:** `https://birucyber.up.railway.app`

---

## 📞 Support

- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app
- BiruCyber Docs: Check project README.md

---

**Ready to deploy? Run:** `railway init` 🚀
