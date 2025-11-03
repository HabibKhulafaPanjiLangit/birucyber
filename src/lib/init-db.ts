import { prisma } from './db'
import { execSync } from 'child_process'

/**
 * Initialize database - create tables if they don't exist
 * This runs on server startup
 */
export async function initializeDatabase() {
  if (!prisma) {
    console.warn('⚠️  Database not available - skipping initialization')
    return false
  }

  try {
    console.log('🔄 Checking database connection...')
    
    // Test connection
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connected')

    // Try to query WebsiteScan table to see if it exists
    try {
      await prisma.websiteScan.findFirst({ take: 1 })
      console.log('✅ Database tables exist')
      return true
    } catch (error: any) {
      // Table doesn't exist - use db push to create it
      if (error.code === 'P2021' || error.message?.includes('does not exist')) {
        console.log('⚠️  Tables do not exist - creating with db push...')
        
        try {
          console.log('🔄 Running prisma db push...')
          execSync('npx prisma db push --accept-data-loss --skip-generate', { 
            stdio: 'inherit',
            env: process.env 
          })
          console.log('✅ Database schema created successfully')
          
          // Verify tables were created
          await prisma.websiteScan.findFirst({ take: 1 })
          console.log('✅ Tables verified')
          return true
        } catch (pushError: any) {
          console.error('❌ DB push failed:', pushError.message)
          console.error('📋 Please check DATABASE_URL is correct')
          return false
        }
      }
      
      throw error
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error)
    return false
  }
}
