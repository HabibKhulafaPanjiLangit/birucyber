# 🚀 Railway Deployment - DVWA Security Portal

## Status Push GitHub
✅ **Berhasil di-push ke GitHub!**
- Repository: https://github.com/HabibKhulafaPanjiLangit/birucyber
- Commit: "Add complete DVWA Security Portal with Emergency Response, Learning Hub, Forensics and Incident Management"
- Files: 14 files changed, 4361 insertions(+)

## Cara Deploy ke Railway

### Option 1: Deploy via Railway Dashboard (TERMUDAH)

1. **Login ke Railway**
   - Buka https://railway.app
   - Login dengan GitHub account Anda

2. **Create New Project**
   - Click "New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository: `HabibKhulafaPanjiLangit/birucyber`
   - Railway akan otomatis detect Next.js project

3. **Configure Environment Variables**
   ```
   DATABASE_URL=postgresql://...  (Railway akan provide otomatis jika add PostgreSQL)
   NODE_ENV=production
   ```

4. **Add PostgreSQL Database**
   - Di project dashboard, click "New"
   - Pilih "Database" → "PostgreSQL"
   - Railway akan otomatis link ke service Anda

5. **Deploy**
   - Railway akan otomatis build dan deploy
   - Tunggu sampai status "Active"
   - Domain otomatis tersedia

### Option 2: Deploy via Railway CLI

```powershell
# Install Railway CLI (jika belum)
npm install -g @railway/cli

# Login
railway login

# Link to existing project atau create new
railway link

# Deploy
railway up
```

### Option 3: Deploy via Git Push (Sudah Setup)

```powershell
# Setelah railway link, setiap push akan auto-deploy
git add .
git commit -m "Update features"
git push origin master
```

## Environment Variables yang Dibutuhkan

Railway akan otomatis set variable ini jika Anda add PostgreSQL:
```env
DATABASE_URL=postgresql://...
POSTGRES_URL=postgresql://...
```

Variable tambahan (optional):
```env
NODE_ENV=production
PORT=3000
```

## Verifikasi Deployment

1. **Check Status**
   - Railway dashboard akan show "Active" status
   - Build logs tersedia di console

2. **Test URL**
   - Railway provide URL: `https://your-app.up.railway.app`
   - Buka URL dan check:
     - ✅ Homepage loads
     - ✅ DVWA Portal button accessible
     - ✅ Database connected
     - ✅ All features working

3. **Test Endpoints**
   ```powershell
   # Health check
   curl https://your-app.up.railway.app/api/health
   
   # Database check
   curl https://your-app.up.railway.app/api/test-db
   
   # Incidents API
   curl https://your-app.up.railway.app/api/incidents
   ```

## Troubleshooting

### Issue: Build Failed
**Solution**: Check build logs di Railway dashboard
- Pastikan all dependencies installed
- Verify `package.json` scripts correct

### Issue: Database Connection Error
**Solution**: 
1. Pastikan PostgreSQL service sudah di-add
2. Check `DATABASE_URL` environment variable
3. Run Prisma migrate:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

### Issue: Port Already in Use
**Solution**: Railway otomatis handle port, tidak perlu set PORT variable

### Issue: App Crashes After Deploy
**Solution**:
1. Check logs di Railway dashboard
2. Verify start command: `npm start`
3. Ensure `server.ts` atau `next start` working

## Post-Deployment Checklist

- [ ] Application accessible via Railway URL
- [ ] DVWA Portal button works
- [ ] Emergency Response System loads
- [ ] Security Learning Hub shows challenges
- [ ] Vulnerability Playground functional
- [ ] Incident Response Portal accessible
- [ ] Database connected (check user registration)
- [ ] API endpoints responding
- [ ] No errors in Railway logs

## Railway Configuration Files

Sudah tersedia di project:
- ✅ `railway.json` - Build & deploy config
- ✅ `nixpacks.toml` - Build system config
- ✅ `Procfile` - Alternative start command
- ✅ `.env.example` - Environment variables template

## Monitoring & Logs

1. **View Logs**
   - Railway dashboard → Your service → Logs tab
   - Real-time logs available

2. **Metrics**
   - CPU usage
   - Memory usage
   - Network traffic
   - Deployment history

3. **Custom Domain** (Optional)
   - Settings → Domains
   - Add your custom domain
   - Configure DNS records

## Database Management

```powershell
# Connect to Railway PostgreSQL
railway connect postgres

# Run Prisma commands
railway run npx prisma studio
railway run npx prisma migrate deploy
```

## Rollback (Jika Perlu)

1. Railway dashboard → Deployments
2. Pilih deployment sebelumnya
3. Click "Redeploy"

## Next Steps Setelah Deploy

1. **Test Semua Fitur**
   - Emergency Response System
   - Security Learning Hub (24 challenges)
   - Vulnerability Playground
   - Incident Response Portal

2. **Monitor Performance**
   - Check Railway metrics
   - Review error logs
   - Monitor database queries

3. **Share URL**
   - Copy Railway URL
   - Share dengan team/users
   - Add to README

4. **Setup CI/CD** (Optional)
   - Auto-deploy on push sudah active
   - Add GitHub Actions untuk testing

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: https://github.com/HabibKhulafaPanjiLangit/birucyber/issues

---

**🎉 Selamat! Project DVWA Security Portal Anda siap di-deploy!**

**Quick Deploy: Go to Railway → New Project → Deploy from GitHub → Select birucyber**
