# 🚀 Quick Railway Deployment Guide

## Prerequisites
- [Railway Account](https://railway.app/) (Free tier available)
- [Railway CLI](https://docs.railway.app/develop/cli) (Optional)
- GitHub repository with your code

## 🎯 Deploy in 5 Minutes

### Option 1: Deploy from GitHub (Recommended)

1. **Go to Railway Dashboard**
   - Visit https://railway.app/
   - Click "Start a New Project"

2. **Deploy from GitHub**
   - Click "Deploy from GitHub repo"
   - Select your repository: `HabibKhulafaPanjiLangit/birucyber`
   - Railway will auto-detect the configuration

3. **Add PostgreSQL Database**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically inject `DATABASE_URL`

4. **Wait for Deployment**
   - Railway will:
     - Install dependencies
     - Generate Prisma client
     - Build Next.js app
     - Start the server
   - Takes ~3-5 minutes

5. **Get Your URL**
   - Click "Settings" → "Networking"
   - Click "Generate Domain"
   - Your app will be live at: `https://your-app.up.railway.app`

### Option 2: Deploy with CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add

# Deploy
railway up

# Generate domain
railway domain
```

## ✅ Verify Deployment

After deployment completes, test these endpoints:

- **Health Check**: `https://your-app.up.railway.app/api/health`
- **Main Page**: `https://your-app.up.railway.app/`
- **Payloads API**: `https://your-app.up.railway.app/api/payloads`

## 🔧 Configuration

All configuration is automatic! Railway will:
- ✅ Detect Node.js 20
- ✅ Install dependencies with `npm install`
- ✅ Run `prisma generate` automatically (postinstall)
- ✅ Build with `npm run build`
- ✅ Start with `npm start`
- ✅ Inject `DATABASE_URL` from PostgreSQL service
- ✅ Set `PORT` environment variable

## 🐛 Troubleshooting

### Build Failed?
```bash
# Check logs in Railway Dashboard
# Most common issues:
# 1. Missing dependencies - Check package.json
# 2. TypeScript errors - Run `npm run build` locally first
# 3. Database connection - Ensure PostgreSQL is added
```

### Can't Connect to Database?
- Make sure PostgreSQL service is added
- Check if `DATABASE_URL` is in environment variables
- Verify Prisma schema is correct

### 502 Bad Gateway?
- Check if health check is passing: `/api/health`
- Verify server is listening on `PORT` environment variable
- Check logs for startup errors

## 📊 Features That Work

✅ Custom Express + Socket.IO server
✅ WebSocket connections (ws://your-app.up.railway.app)
✅ PostgreSQL database with Prisma
✅ Real-time attack monitoring
✅ All 6 security testing modules
✅ 242+ exploit payloads
✅ Auto-save functionality
✅ Analytics dashboard

## 💰 Cost

**Free Tier:**
- $5 credit/month
- ~550 hours/month runtime
- Perfect for testing and demos

**Developer Plan ($20/month):**
- $20 credit
- ~2,000 hours/month
- Better for production

## 🔗 Resources

- [Railway Docs](https://docs.railway.app/)
- [Deployment Logs](https://railway.app/dashboard)
- [Community Support](https://discord.gg/railway)

---

**That's it! Your cyber security platform is now live! 🎉**
