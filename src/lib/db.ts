import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined | null
}

// Initialize Prisma with error handling
let prismaInstance: PrismaClient | null = null

try {
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL not configured. Database features disabled.')
    console.warn('📚 Follow QUICK-START-DATABASE.md to setup PostgreSQL')
    prismaInstance = null
  } else {
    prismaInstance = globalForPrisma.prisma ?? new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
    
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaInstance
    }
  }
} catch (error) {
  console.error('❌ Failed to initialize Prisma:', error)
  prismaInstance = null
}

export const db = prismaInstance
export const prisma = prismaInstance // Alias for consistency

// Check if database is available
export function isDatabaseAvailable(): boolean {
  return prismaInstance !== null && !!process.env.DATABASE_URL
}

// Database health check
export async function checkDatabaseConnection() {
  if (!isDatabaseAvailable() || !db) {
    return { 
      status: 'disconnected', 
      error: 'DATABASE_URL not configured. Follow QUICK-START-DATABASE.md to setup.' 
    }
  }
  
  try {
    await db.$queryRaw`SELECT 1`
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
  if (db) {
    await db.$disconnect()
  }
}