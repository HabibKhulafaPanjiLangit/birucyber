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
      // Table doesn't exist - need to run migration
      if (error.code === 'P2021' || error.message?.includes('does not exist')) {
        console.log('⚠️  Tables do not exist - attempting to create...')
        
        try {
          // Try to run migration
          console.log('🔄 Running database migration...')
          execSync('npx prisma migrate deploy', { stdio: 'inherit' })
          console.log('✅ Migration completed successfully')
          return true
        } catch (migrationError) {
          console.error('❌ Migration failed:', migrationError)
          
          // Fallback: try db push
          try {
            console.log('🔄 Trying prisma db push as fallback...')
            execSync('npx prisma db push --skip-generate', { stdio: 'inherit' })
            console.log('✅ Database schema pushed successfully')
            return true
          } catch (pushError) {
            console.error('❌ DB push also failed:', pushError)
            return false
          }
        }
      }
      
      throw error
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error)
    return false
  }
}
