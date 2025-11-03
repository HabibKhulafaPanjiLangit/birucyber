import { NextResponse } from 'next/server'
import { checkDatabaseConnection } from '@/lib/db'

export async function GET() {
  const health = await checkDatabaseConnection()
  
  const response = {
    database: health.status,
    timestamp: new Date().toISOString(),
    error: health.error,
    environment: process.env.NODE_ENV || 'development',
    hasEnv: !!process.env.DATABASE_URL
  }
  
  return NextResponse.json(response, {
    status: health.status === 'connected' ? 200 : 503
  })
}
