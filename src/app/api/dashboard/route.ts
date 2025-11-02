import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for security logs (for demo purposes)
const securityLogs: any[] = []

export async function GET(request: NextRequest) {
  try {
    // Simulated statistics
    const totalUsers = 150
    const adminUsers = 5
    const regularUsers = 100
    const guestUsers = 45
    
    const totalPosts = 245
    const publishedPosts = 200
    const totalComments = 1250
    
    // Calculate security metrics
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const recentThreats = securityLogs.filter(log => 
      new Date(log.timestamp) >= last24Hours && log.eventType.includes('THREAT')
    ).length
    
    const securityScore = Math.max(0, 100 - (recentThreats * 10))
    
    // Get recent activity
    const recentActivity = securityLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)

    return NextResponse.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          admin: adminUsers,
          regular: regularUsers,
          guest: guestUsers
        },
        content: {
          posts: {
            total: totalPosts,
            published: publishedPosts,
            draft: totalPosts - publishedPosts
          },
          comments: totalComments
        },
        security: {
          score: securityScore,
          recentThreats,
          totalLogs: securityLogs.length,
          recentActivity: recentActivity.map(log => ({
            eventType: log.eventType,
            description: log.description,
            timestamp: log.timestamp,
            ipAddress: log.ipAddress,
            severity: log.severity
          }))
        },
        vulnerabilities: {
          sqlInjection: {
            detected: securityLogs.filter(l => l.eventType === 'SQL_INJECTION').length,
            blocked: securityLogs.filter(l => l.eventType === 'SQL_INJECTION' && l.blocked).length
          },
          xss: {
            detected: securityLogs.filter(l => l.eventType === 'XSS_ATTACK').length,
            blocked: securityLogs.filter(l => l.eventType === 'XSS_ATTACK' && l.blocked).length
          },
          accessControl: {
            detected: securityLogs.filter(l => l.eventType === 'ACCESS_CONTROL_BYPASS').length,
            blocked: securityLogs.filter(l => l.eventType === 'ACCESS_CONTROL_BYPASS' && l.blocked).length
          }
        },
        system: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          nodeVersion: process.version,
          platform: process.platform
        }
      }
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { eventType, description, ipAddress, userAgent, payload, severity = 'medium', blocked = false } = await request.json()

    // Log security event
    const securityLog = {
      id: securityLogs.length + 1,
      eventType,
      description,
      ipAddress: ipAddress || request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: userAgent || request.headers.get('user-agent') || 'unknown',
      payload,
      severity,
      blocked,
      timestamp: new Date().toISOString()
    }
    
    securityLogs.push(securityLog)
    
    // Keep only last 1000 logs
    if (securityLogs.length > 1000) {
      securityLogs.shift()
    }

    return NextResponse.json({
      success: true,
      message: 'Security event logged',
      data: securityLog
    })

  } catch (error) {
    console.error('Security log error:', error)
    return NextResponse.json(
      { error: 'Failed to log security event' },
      { status: 500 }
    )
  }
}