# 🚀 Panduan Deployment ke Railway

Panduan lengkap untuk deploy aplikasi BiruCyber ke Railway.

## 📋 Persiapan Sebelum Deploy

### 1. Pastikan File Konfigurasi Sudah Benar

File-file berikut sudah dikonfigurasi untuk Railway:
- ✅ `package.json` - Script build dan start
- ✅ `railway.json` - Konfigurasi Railway
- ✅ `nixpacks.toml` - Build configuration
- ✅ `next.config.ts` - Next.js production config
- ✅ `server.ts` - Custom server dengan Socket.IO
- ✅ `Procfile` - Alternative process file
- ✅ `.env.example` - Template environment variables

### 2. Cek Dependencies

Pastikan semua dependencies terinstall:
```bash
npm install --legacy-peer-deps
```

### 3. Test Build Lokal (Opsional)

Test build untuk memastikan tidak ada error:
```bash
npm run build
```

## 🗄️ Setup Database PostgreSQL di Railway

### Langkah 1: Buat PostgreSQL Database

1. Login ke [Railway.app](https://railway.app)
2. Buat project baru atau pilih project yang ada
3. Klik **"+ New"** → **"Database"** → **"Add PostgreSQL"**
4. Database akan otomatis dibuat dengan kredensial

### Langkah 2: Ambil Database URL

Setelah database dibuat, Railway akan generate:
- `DATABASE_URL` - URL koneksi PostgreSQL
- `POSTGRES_URL` - Alias untuk DATABASE_URL

Copy URL tersebut untuk digunakan di aplikasi.

## 🚀 Deploy Aplikasi ke Railway

### Opsi 1: Deploy dari GitHub (Recommended)

1. **Push code ke GitHub repository**
   ```bash
   git add .
   git commit -m "Ready for Railway deployment"
   git push origin master
   ```

2. **Connect Repository ke Railway**
   - Di Railway dashboard, klik **"+ New"** → **"GitHub Repo"**
   - Pilih repository `birucyber`
   - Railway akan otomatis detect dan setup

3. **Configure Environment Variables**
   
   Di Railway dashboard → Settings → Variables, tambahkan:
   
   ```env
   DATABASE_URL=<copy-dari-postgresql-database>
   DIRECT_DATABASE_URL=<copy-dari-postgresql-database>
   NODE_ENV=production
   PORT=3000
   ```

   **Catatan untuk Prisma Accelerate:**
   Jika menggunakan Prisma Accelerate:
   - `DATABASE_URL` = Accelerate URL (untuk queries)
   - `DIRECT_DATABASE_URL` = PostgreSQL URL langsung (untuk migrations)
   
   Jika TIDAK menggunakan Accelerate:
   - `DATABASE_URL` = PostgreSQL URL langsung
   - `DIRECT_DATABASE_URL` = PostgreSQL URL langsung (sama)

4. **Deploy**
   - Railway akan otomatis build dan deploy
   - Monitor logs untuk memastikan tidak ada error

### Opsi 2: Deploy dari CLI

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login ke Railway**
   ```bash
   railway login
   ```

3. **Link Project**
   ```bash
   railway link
   ```

4. **Set Environment Variables**
   ```bash
   railway variables set DATABASE_URL="<your-database-url>"
   railway variables set DIRECT_DATABASE_URL="<your-database-url>"
   railway variables set NODE_ENV="production"
   ```

5. **Deploy**
   ```bash
   railway up
   ```

## 🔧 Konfigurasi Lanjutan

### Setup Custom Domain (Opsional)

1. Di Railway dashboard → Settings → Domains
2. Generate domain atau add custom domain
3. Klik **"Generate Domain"** untuk mendapat subdomain gratis
4. Atau tambahkan custom domain dengan update DNS settings

### Setup Environment Variables Tambahan

Jika menggunakan fitur tambahan, tambahkan variables:

```env
# Next Auth (jika digunakan)
NEXTAUTH_URL=https://your-domain.railway.app
NEXTAUTH_SECRET=<generate-dengan-openssl>

# CORS Origin (jika perlu restrict)
CORS_ORIGIN=https://your-domain.railway.app

# Optional: Prisma Accelerate
# DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=<your-key>
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## 🗃️ Database Migration

### Auto Migration (Recommended untuk Production)

Migrations akan otomatis dijalankan saat build karena sudah ada di script:
```json
"build": "prisma generate && next build"
```

### Manual Migration (jika diperlukan)

Jika perlu run migration manual:

1. Via Railway CLI:
   ```bash
   railway run npx prisma migrate deploy
   ```

2. Atau via Railway dashboard → Variables, tambahkan temporary script:
   - Klik **"Deploy"** → **"Custom Start Command"**
   - Masukkan: `npx prisma migrate deploy && npm start`
   - Setelah selesai, kembalikan ke `npm start`

### Reset Database (Development Only)

⚠️ **JANGAN LAKUKAN DI PRODUCTION!**

```bash
railway run npx prisma migrate reset
```

## 🔍 Monitoring & Debugging

### 1. Cek Logs

Di Railway dashboard → Deployments → Klik deployment → Logs

Atau via CLI:
```bash
railway logs
```

### 2. Health Check

Aplikasi memiliki health check endpoint:
```
https://your-domain.railway.app/api/health
```

### 3. Common Issues

**Issue: Build Failed - "Cannot find module"**
- Solution: Pastikan semua dependencies ada di `package.json`
- Run: `npm install --legacy-peer-deps`

**Issue: Database Connection Error**
- Solution: Cek `DATABASE_URL` dan `DIRECT_DATABASE_URL` sudah benar
- Pastikan PostgreSQL database sudah aktif di Railway

**Issue: Server Timeout**
- Solution: Cek `healthcheckTimeout` di `railway.json`
- Increase timeout jika startup lambat

**Issue: Module Not Found di Production**
- Solution: Pastikan import path benar (gunakan `./src/lib/...` bukan `@/lib/...` di server.ts)

**Issue: Socket.IO tidak connect**
- Solution: Pastikan CORS origin sudah benar
- Cek WebSocket connection di browser console

## 🎯 Checklist Sebelum Go Live

- [ ] Database PostgreSQL sudah setup
- [ ] Environment variables sudah dikonfigurasi
- [ ] Build berhasil tanpa error
- [ ] Health check endpoint merespon OK
- [ ] Database migrations sudah dijalankan
- [ ] Socket.IO connection berfungsi
- [ ] Custom domain sudah dikonfigurasi (jika ada)
- [ ] SSL/HTTPS aktif (otomatis dari Railway)
- [ ] Test semua endpoint API
- [ ] Test user registration dan login

## 📚 Resources

- [Railway Documentation](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Railway Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway)

## 🆘 Support

Jika ada masalah:
1. Cek logs di Railway dashboard
2. Cek dokumentasi Railway
3. Review error messages
4. Test di local environment terlebih dahulu

---

**Happy Deploying! 🚀**
