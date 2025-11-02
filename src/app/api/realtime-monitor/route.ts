import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Real-time attack monitoring
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const since = searchParams.get('since') // timestamp
    const severity = searchParams.get('severity')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Get recent attacks (last 5 minutes by default)
    const sinceTime = since 
      ? new Date(parseInt(since))
      : new Date(Date.now() - 5 * 60 * 1000)

    // Fetch recent attacks from all test tables
    const [sqlAttacks, xssAttacks, csrfAttacks, accessAttacks] = await Promise.all([
      prisma.sqlInjectionTest.findMany({
        where: {
          attackDetected: true,
          createdAt: { gte: sinceTime },
          ...(severity && { severity })
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          username: true,
          attackType: true,
          severity: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true
        }
      }),
      prisma.xssTest.findMany({
        where: {
          attackDetected: true,
          createdAt: { gte: sinceTime },
          ...(severity && { severity })
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          author: true,
          comment: true,
          xssType: true,
          severity: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true
        }
      }),
      prisma.csrfTest.findMany({
        where: {
          attackDetected: true,
          createdAt: { gte: sinceTime },
          ...(severity && { severity })
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          action: true,
          severity: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true
        }
      }),
      prisma.accessControlTest.findMany({
        where: {
          bypassSuccessful: true,
          createdAt: { gte: sinceTime }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
          id: true,
          resource: true,
          userToken: true,
          vulnerabilityType: true,
          userRole: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true
        }
      })
    ])

    // Combine and format attacks
    const attacks = [
      ...sqlAttacks.map(a => ({
        id: a.id,
        type: 'SQL Injection',
        target: a.username,
        attackType: a.attackType,
        severity: a.severity,
        ipAddress: a.ipAddress,
        userAgent: a.userAgent,
        timestamp: a.createdAt,
        icon: '💉'
      })),
      ...xssAttacks.map(a => ({
        id: a.id,
        type: 'XSS',
        target: a.author,
        attackType: a.xssType,
        severity: a.severity,
        ipAddress: a.ipAddress,
        userAgent: a.userAgent,
        timestamp: a.createdAt,
        icon: '⚡'
      })),
      ...csrfAttacks.map(a => ({
        id: a.id,
        type: 'CSRF',
        target: a.action,
        attackType: 'Cross-Site Request Forgery',
        severity: a.severity,
        ipAddress: a.ipAddress,
        userAgent: a.userAgent,
        timestamp: a.createdAt,
        icon: '🎭'
      })),
      ...accessAttacks.map(a => ({
        id: a.id,
        type: 'Access Control',
        target: a.resource,
        attackType: a.vulnerabilityType,
        severity: 'critical',
        ipAddress: a.ipAddress,
        userAgent: a.userAgent,
        timestamp: a.createdAt,
        icon: '🔓'
      }))
    ]

    // Sort by timestamp (most recent first)
    attacks.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Calculate statistics
    const stats = {
      total: attacks.length,
      bySeverity: {
        critical: attacks.filter(a => a.severity === 'critical').length,
        high: attacks.filter(a => a.severity === 'high').length,
        medium: attacks.filter(a => a.severity === 'medium').length,
        low: attacks.filter(a => a.severity === 'low').length
      },
      byType: {
        sql: sqlAttacks.length,
        xss: xssAttacks.length,
        csrf: csrfAttacks.length,
        access: accessAttacks.length
      },
      uniqueIPs: new Set(attacks.map(a => a.ipAddress).filter(Boolean)).size,
      timeRange: {
        from: sinceTime.toISOString(),
        to: new Date().toISOString(),
        durationSeconds: Math.floor((Date.now() - sinceTime.getTime()) / 1000)
      }
    }

    return NextResponse.json({
      success: true,
      realtime: true,
      attacks: attacks.slice(0, limit),
      statistics: stats,
      lastUpdate: new Date().toISOString()
    })

  } catch (error) {
    console.error('Real-time monitor error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch real-time attacks' },
      { status: 500 }
    )
  }
}

// Stream real-time updates (Server-Sent Events simulation)
export async function POST(request: NextRequest) {
  try {
    const { action, threshold } = await request.json()

    if (action === 'subscribe') {
      // In production, this would set up WebSocket or SSE
      // For now, return configuration
      return NextResponse.json({
        success: true,
        subscribed: true,
        updateInterval: 2000, // 2 seconds
        threshold: threshold || 'medium',
        endpoint: '/api/realtime-monitor',
        websocket: 'ws://localhost:3000/api/socketio',
        instructions: {
          polling: 'GET /api/realtime-monitor?since=<timestamp>',
          websocket: 'Connect to Socket.IO at /api/socketio',
          events: ['attack_detected', 'critical_alert', 'stats_update']
        }
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Real-time subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
