import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

export const prisma = db // Alias for consistency

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Database health check
export async function checkDatabaseConnection() {
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
  await db.$disconnect()
}