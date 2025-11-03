# 🗄️ Setup Database Production - BiruCyber Scanner

## Panduan Lengkap: Railway PostgreSQL Database Setup

**Tujuan:** Membuat scanner menjadi **professional-grade tool** dengan database realtime yang 100% tanpa error!

---

## 📋 LANGKAH-LANGKAH SETUP

### **Step 1: Create PostgreSQL Database di Railway**

1. **Buka Railway Dashboard**
   ```
   https://railway.app/dashboard
   ```

2. **Pilih Project BiruCyber**
   - Klik project `birucyber-production`

3. **Add PostgreSQL Database**
   - Klik tombol `+ New`
   - Pilih `Database` → `Add PostgreSQL`
   - Tunggu provisioning selesai (2-3 menit)

4. **Database akan otomatis dibuat dengan:**
   - PostgreSQL 16.x
   - 8GB Storage
   - Automatic backups
   - SSL Connection

---

### **Step 2: Get Database Connection String**

1. **Klik PostgreSQL Service** di Railway dashboard

2. **Tab "Variables"** akan menampilkan:
   ```
   DATABASE_URL=postgresql://postgres:PASSWORD@HOSTNAME:PORT/railway
   PGHOST=hostname.railway.internal
   PGPORT=5432
   PGUSER=postgres
   PGPASSWORD=your-password
   PGDATABASE=railway
   ```

3. **Copy nilai `DATABASE_URL`** - Ini yang kita butuhkan!
   
   Format:
   ```
   postgresql://postgres:xxxxxxxxxxxxx@containers-us-west-xxx.railway.app:7890/railway
   ```

---

### **Step 3: Add DATABASE_URL ke BiruCyber Service**

1. **Klik Service `birucyber` (bukan PostgreSQL)**

2. **Tab "Variables"**

3. **Klik "+ New Variable"**
   - **Name:** `DATABASE_URL`
   - **Value:** Paste connection string dari Step 2
   
   ```
   DATABASE_URL=postgresql://postgres:xxxxxxxxxxxxx@containers-us-west-xxx.railway.app:7890/railway
   ```

4. **Klik "Add"**

5. **Railway akan auto-redeploy** (tunggu 2-3 menit)

---

### **Step 4: Run Database Migrations**

Setelah redeploy selesai, jalankan migration untuk create tables:

#### **Option A: Via Railway Dashboard** (Recommended)

1. **Klik Service BiruCyber**

2. **Tab "Settings"**

3. **Scroll ke "Deploy Triggers"**

4. **Di bagian "Build Command" pastikan ada:**
   ```bash
   npm run build && npx prisma migrate deploy
   ```

5. **Trigger redeploy:**
   - Tab "Deployments"
   - Klik "Redeploy" pada latest deployment

#### **Option B: Via Local Terminal**

```powershell
# Set DATABASE_URL temporarily
$env:DATABASE_URL="postgresql://postgres:xxxxx@containers-us-west-xxx.railway.app:7890/railway"

# Run migration
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

---

### **Step 5: Verify Database Connection**

1. **Check Railway Logs:**
   ```
   Service BiruCyber → Deployments → View Logs
   ```

2. **Look for SUCCESS messages:**
   ```
   ✓ Prisma Client generated
   ✓ Database connection established
   ✓ Migration applied: 20251102084221_init
   ✓ Server running on port 3000
   ```

3. **Test Scanner:**
   - Go to https://birucyber-production.up.railway.app
   - Tab SCANNER
   - Run a Quick Scan
   - Check if results are saved

---

## 🔧 SCHEMA OPTIMIZATIONS

### **Current Schema:**

```prisma
model WebsiteScan {
  id                Int       @id @default(autoincrement())
  targetUrl         String
  scanType          String    // 'quick' or 'full'
  status            String    // 'pending', 'scanning', 'completed', 'failed'
  
  // Results
  vulnerabilities   Json?     // Array of vulnerability objects
  securityScore     Int?      // 0-100
  securityHeaders   Json?     // Headers analysis
  sslInfo           Json?     // SSL/TLS info
  technologies      Json?     // Detected technologies
  
  // Metadata
  severity          String?   // 'low', 'medium', 'high', 'critical'
  scanDuration      Int?      // In seconds
  errorMessage      String?
  
  // Timestamps
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

### **Optimizations to Add:**

```prisma
model WebsiteScan {
  id                Int       @id @default(autoincrement())
  targetUrl         String    @db.VarChar(2048)
  scanType          String    @db.VarChar(20)
  status            String    @db.VarChar(20)
  
  // Results
  vulnerabilities   Json?
  securityScore     Int?      @db.SmallInt // 0-100
  securityHeaders   Json?
  sslInfo           Json?
  technologies      Json?
  subdomains        Json?     // NEW: Subdomain enumeration results
  exposedFiles      Json?     // NEW: Sensitive files found
  
  // Metadata
  severity          String?   @db.VarChar(20)
  scanDuration      Int?      @db.SmallInt
  errorMessage      String?   @db.Text
  
  // User tracking (for future multi-user support)
  userId            Int?
  
  // Timestamps
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // Indexes for performance
  @@index([targetUrl])
  @@index([status])
  @@index([createdAt])
  @@index([userId])
}

model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique @db.VarChar(255)
  username      String    @unique @db.VarChar(100)
  passwordHash  String    @db.VarChar(255)
  role          String    @default("user") @db.VarChar(20)
  
  // Stats
  totalScans    Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  scans         WebsiteScan[]
}
```

---

## 🚀 PRODUCTION FEATURES TO IMPLEMENT

### **1. Database Connection Pool**

Update `src/lib/db.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Connection health check
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { status: 'connected', error: null }
  } catch (error) {
    return { 
      status: 'disconnected', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Graceful shutdown
export async function disconnectDatabase() {
  await prisma.$disconnect()
}
```

---

### **2. Scan History API**

Create `src/app/api/scan-history/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const targetUrl = searchParams.get('targetUrl')
    
    const skip = (page - 1) * limit
    
    // Build where clause
    const where: any = {}
    if (targetUrl) {
      where.targetUrl = { contains: targetUrl }
    }
    
    // Get scans with pagination
    const [scans, total] = await Promise.all([
      prisma.websiteScan.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          targetUrl: true,
          scanType: true,
          status: true,
          securityScore: true,
          severity: true,
          scanDuration: true,
          createdAt: true,
        }
      }),
      prisma.websiteScan.count({ where })
    ])
    
    return NextResponse.json({
      success: true,
      data: scans,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Error fetching scan history:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch scan history' },
      { status: 500 }
    )
  }
}

// DELETE endpoint to clear old scans
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const scanId = searchParams.get('id')
    const olderThan = searchParams.get('olderThan') // days
    
    if (scanId) {
      // Delete specific scan
      await prisma.websiteScan.delete({
        where: { id: parseInt(scanId) }
      })
      return NextResponse.json({ success: true, message: 'Scan deleted' })
    }
    
    if (olderThan) {
      // Delete scans older than X days
      const date = new Date()
      date.setDate(date.getDate() - parseInt(olderThan))
      
      const result = await prisma.websiteScan.deleteMany({
        where: {
          createdAt: { lt: date }
        }
      })
      
      return NextResponse.json({ 
        success: true, 
        message: `Deleted ${result.count} old scans` 
      })
    }
    
    return NextResponse.json(
      { success: false, error: 'Missing parameter: id or olderThan' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Error deleting scans:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete scans' },
      { status: 500 }
    )
  }
}
```

---

### **3. Database Health Check API**

Create `src/app/api/db-health/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { checkDatabaseConnection } from '@/lib/db'

export async function GET() {
  const health = await checkDatabaseConnection()
  
  return NextResponse.json({
    database: health.status,
    timestamp: new Date().toISOString(),
    error: health.error
  }, {
    status: health.status === 'connected' ? 200 : 503
  })
}
```

---

### **4. Automatic Cleanup Job**

Create `src/lib/cleanup.ts`:

```typescript
import { prisma } from './db'

export async function cleanupOldScans(daysToKeep: number = 30) {
  try {
    const date = new Date()
    date.setDate(date.getDate() - daysToKeep)
    
    const result = await prisma.websiteScan.deleteMany({
      where: {
        createdAt: { lt: date },
        status: { in: ['completed', 'failed'] }
      }
    })
    
    console.log(`[Cleanup] Deleted ${result.count} old scans`)
    return result.count
    
  } catch (error) {
    console.error('[Cleanup] Error:', error)
    return 0
  }
}

// Run cleanup every 24 hours
export function startCleanupSchedule() {
  if (process.env.NODE_ENV === 'production') {
    setInterval(() => {
      cleanupOldScans(30).catch(console.error)
    }, 24 * 60 * 60 * 1000) // 24 hours
    
    // Run immediately on startup
    cleanupOldScans(30).catch(console.error)
  }
}
```

---

## 📊 MONITORING & ANALYTICS

### **Database Stats API**

Create `src/app/api/stats/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const [
      totalScans,
      completedScans,
      failedScans,
      avgScore,
      criticalFindings,
      recentScans
    ] = await Promise.all([
      prisma.websiteScan.count(),
      prisma.websiteScan.count({ where: { status: 'completed' } }),
      prisma.websiteScan.count({ where: { status: 'failed' } }),
      prisma.websiteScan.aggregate({
        _avg: { securityScore: true },
        where: { status: 'completed', securityScore: { not: null } }
      }),
      prisma.websiteScan.count({ where: { severity: 'critical' } }),
      prisma.websiteScan.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          targetUrl: true,
          securityScore: true,
          severity: true,
          createdAt: true
        }
      })
    ])
    
    return NextResponse.json({
      success: true,
      stats: {
        totalScans,
        completedScans,
        failedScans,
        successRate: totalScans > 0 
          ? ((completedScans / totalScans) * 100).toFixed(2) 
          : 0,
        averageSecurityScore: avgScore._avg.securityScore?.toFixed(1) || 0,
        criticalFindings,
        recentScans
      }
    })
    
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
```

---

## 🔐 SECURITY BEST PRACTICES

### **Environment Variables**

```env
# Railway Production
DATABASE_URL="postgresql://postgres:xxxxx@containers-us-west-xxx.railway.app:7890/railway"
NODE_ENV="production"

# Optional: Connection Pool Settings
DATABASE_CONNECTION_LIMIT=10
DATABASE_POOL_TIMEOUT=20

# Security
SESSION_SECRET="your-super-secret-key-change-this"
BCRYPT_ROUNDS=12
```

### **Connection Pooling**

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  
  // Connection pool settings
  connectionLimit = 10
}
```

---

## ✅ TESTING CHECKLIST

### **Manual Testing:**

1. **Database Connection**
   ```
   GET https://birucyber-production.up.railway.app/api/db-health
   Expected: { "database": "connected" }
   ```

2. **Create Scan**
   ```
   POST https://birucyber-production.up.railway.app/api/website-scan
   Body: { "url": "https://google.com", "scanType": "quick" }
   Expected: { "success": true, "scanId": 1 }
   ```

3. **Get Scan Results**
   ```
   GET https://birucyber-production.up.railway.app/api/website-scan?scanId=1
   Expected: Full scan results with securityScore
   ```

4. **Scan History**
   ```
   GET https://birucyber-production.up.railway.app/api/scan-history?page=1&limit=10
   Expected: Array of recent scans
   ```

5. **Statistics**
   ```
   GET https://birucyber-production.up.railway.app/api/stats
   Expected: totalScans, averageScore, etc.
   ```

---

## 🚨 TROUBLESHOOTING

### **Error: "Can't reach database server"**

**Solution:**
1. Check DATABASE_URL is correct
2. Verify PostgreSQL service is running in Railway
3. Check if IP whitelist is needed (Railway usually doesn't need this)

### **Error: "Connection pool timeout"**

**Solution:**
1. Reduce `DATABASE_CONNECTION_LIMIT`
2. Add connection retry logic
3. Check for connection leaks (missing `prisma.$disconnect()`)

### **Error: "Migration failed"**

**Solution:**
```bash
# Reset database (CAREFUL: deletes all data)
npx prisma migrate reset --force

# Or apply specific migration
npx prisma migrate deploy
```

---

## 📈 PERFORMANCE OPTIMIZATION

### **1. Database Indexes**

```prisma
model WebsiteScan {
  // ... fields ...
  
  @@index([targetUrl])        // Fast search by URL
  @@index([status])           // Fast filter by status
  @@index([createdAt])        // Fast sort by date
  @@index([securityScore])    // Fast sort by score
  @@index([severity])         // Fast filter by severity
}
```

### **2. Query Optimization**

```typescript
// ❌ Bad - Fetches all fields
const scans = await prisma.websiteScan.findMany()

// ✅ Good - Only fetch needed fields
const scans = await prisma.websiteScan.findMany({
  select: {
    id: true,
    targetUrl: true,
    securityScore: true,
    createdAt: true
  }
})
```

### **3. Caching Strategy**

```typescript
// Cache scan results for 5 minutes
const CACHE_TTL = 5 * 60 * 1000
const cache = new Map<number, { data: any; timestamp: number }>()

export async function getCachedScan(scanId: number) {
  const cached = cache.get(scanId)
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  
  const scan = await prisma.websiteScan.findUnique({
    where: { id: scanId }
  })
  
  if (scan) {
    cache.set(scanId, { data: scan, timestamp: Date.now() })
  }
  
  return scan
}
```

---

## 🎯 NEXT STEPS

1. ✅ **Setup Railway PostgreSQL** - Add database to project
2. ✅ **Configure DATABASE_URL** - Add to environment variables
3. ✅ **Run Migrations** - Create tables in production
4. ✅ **Test Connection** - Verify scanner saves to database
5. 🔄 **Add Scan History UI** - Show previous scans
6. 🔄 **Add Statistics Dashboard** - Show usage stats
7. 🔄 **Implement User Auth** - Multi-user support
8. 🔄 **Add Export Feature** - PDF/JSON reports

---

## 🎉 FINAL RESULT

**Professional Security Scanner dengan:**
- ✅ PostgreSQL Database (Realtime)
- ✅ Persistent Scan History
- ✅ No Errors (No fallback needed)
- ✅ Production-Ready
- ✅ Scalable Architecture
- ✅ Auto Backups (Railway)
- ✅ SSL Encrypted Connection
- ✅ Connection Pooling
- ✅ Performance Optimized

**Status:** Ready untuk menolong orang-orang yang terkena hack! 🛡️
