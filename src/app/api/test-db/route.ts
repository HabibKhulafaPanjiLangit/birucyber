import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Test database connection
    const userCount = await db.user.count()
    const postCount = await db.post.count()
    const commentCount = await db.comment.count()
    const logCount = await db.securityLog.count()

    // Create test data if empty
    if (userCount === 0) {
      await db.user.create({
        data: {
          username: 'admin',
          email: 'admin@test.com',
          password: 'admin123',
          role: 'ADMIN',
          name: 'Administrator'
        }
      })

      await db.user.create({
        data: {
          username: 'user1',
          email: 'user1@test.com',
          password: 'user123',
          role: 'USER',
          name: 'Test User'
        }
      })

      await db.user.create({
        data: {
          username: 'guest',
          email: 'guest@test.com',
          password: 'guest123',
          role: 'GUEST',
          name: 'Guest User'
        }
      })
    }

    // Create test security log
    await db.securityLog.create({
      data: {
        eventType: 'TEST_CONNECTION',
        description: 'Database connection test',
        ipAddress: '127.0.0.1',
        userAgent: 'Test Agent'
      }
    })

    const updatedCounts = await db.user.count()

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        users: updatedCounts,
        posts: postCount,
        comments: commentCount,
        securityLogs: logCount + 1,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}