import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const testType = searchParams.get('type') // sql|xss|access|csrf|headers|rate
    const limit = parseInt(searchParams.get('limit') || '50')
    const severity = searchParams.get('severity') // low|medium|high|critical
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Get all test counts
    const [
      sqlCount,
      xssCount,
      accessCount,
      csrfCount,
      headersCount,
      rateCount,
      userCount,
      logCount
    ] = await Promise.all([
      prisma.sqlInjectionTest.count(),
      prisma.xssTest.count(),
      prisma.accessControlTest.count(),
      prisma.csrfTest.count(),
      prisma.securityHeadersTest.count(),
      prisma.rateLimitingTest.count(),
      prisma.user.count(),
      prisma.securityLog.count()
    ])

    // Attack detection statistics
    const sqlAttacks = await prisma.sqlInjectionTest.count({ where: { attackDetected: true } })
    const xssAttacks = await prisma.xssTest.count({ where: { attackDetected: true } })
    const csrfAttacks = await prisma.csrfTest.count({ where: { attackDetected: true } })
    const accessBypass = await prisma.accessControlTest.count({ where: { bypassSuccessful: true } })
    const rateLockouts = await prisma.rateLimitingTest.count({ where: { lockoutTriggered: true } })

    // Severity distribution for SQL Injection
    const sqlSeverity = await prisma.sqlInjectionTest.groupBy({
      by: ['severity'],
      _count: { severity: true }
    })

    // Severity distribution for XSS
    const xssSeverity = await prisma.xssTest.groupBy({
      by: ['severity'],
      _count: { severity: true }
    })

    // Test mode distribution
    const sqlModes = await prisma.sqlInjectionTest.groupBy({
      by: ['testMode'],
      _count: { testMode: true }
    })

    // Recent tests based on type
    let recentTests: any[] = []
    if (testType === 'sql' || !testType) {
      const tests = await prisma.sqlInjectionTest.findMany({
        take: testType ? limit : 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          username: true,
          testMode: true,
          success: true,
          attackDetected: true,
          attackType: true,
          severity: true,
          ipAddress: true,
          createdAt: true
        }
      })
      recentTests = [...recentTests, ...tests.map(t => ({ ...t, type: 'SQL Injection' }))]
    }

    if (testType === 'xss' || !testType) {
      const tests = await prisma.xssTest.findMany({
        take: testType ? limit : 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          author: true,
          testMode: true,
          success: true,
          attackDetected: true,
          xssType: true,
          severity: true,
          ipAddress: true,
          createdAt: true
        }
      })
      recentTests = [...recentTests, ...tests.map(t => ({ ...t, type: 'XSS', username: t.author, attackType: t.xssType }))]
    }

    if (testType === 'access' || !testType) {
      const tests = await prisma.accessControlTest.findMany({
        take: testType ? limit : 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          resource: true,
          userToken: true,
          testMode: true,
          accessGranted: true,
          bypassSuccessful: true,
          vulnerabilityType: true,
          userRole: true,
          ipAddress: true,
          createdAt: true
        }
      })
      recentTests = [...recentTests, ...tests.map(t => ({ 
        ...t, 
        type: 'Access Control', 
        username: t.userToken,
        attackDetected: t.bypassSuccessful,
        attackType: t.vulnerabilityType,
        severity: t.bypassSuccessful ? 'critical' : 'low'
      }))]
    }

    if (testType === 'csrf' || !testType) {
      const tests = await prisma.csrfTest.findMany({
        take: testType ? limit : 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          action: true,
          testMode: true,
          success: true,
          attackDetected: true,
          severity: true,
          ipAddress: true,
          createdAt: true
        }
      })
      recentTests = [...recentTests, ...tests.map(t => ({ ...t, type: 'CSRF', username: t.action }))]
    }

    if (testType === 'headers' || !testType) {
      const tests = await prisma.securityHeadersTest.findMany({
        take: testType ? limit : 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          testMode: true,
          score: true,
          missingHeaders: true,
          ipAddress: true,
          createdAt: true
        }
      })
      recentTests = [...recentTests, ...tests.map(t => ({ 
        ...t, 
        type: 'Security Headers',
        username: 'scan',
        attackDetected: (t.missingHeaders || 0) > 2,
        severity: (t.score || 0) < 50 ? 'critical' : (t.score || 0) < 75 ? 'high' : 'medium',
        success: (t.score || 0) >= 80
      }))]
    }

    if (testType === 'rate' || !testType) {
      const tests = await prisma.rateLimitingTest.findMany({
        take: testType ? limit : 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          action: true,
          username: true,
          testMode: true,
          attempts: true,
          blocked: true,
          lockoutTriggered: true,
          ipAddress: true,
          createdAt: true
        }
      })
      recentTests = [...recentTests, ...tests.map(t => ({ 
        ...t, 
        type: 'Rate Limiting',
        attackDetected: t.attempts > 5,
        severity: t.lockoutTriggered ? 'critical' : t.attempts > 5 ? 'high' : 'low',
        success: !t.blocked
      }))]
    }

    // Sort all tests by date
    recentTests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    if (!testType) {
      recentTests = recentTests.slice(0, 50)
    }

    // Attack timeline (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const recentSqlAttacks = await prisma.sqlInjectionTest.count({
      where: {
        attackDetected: true,
        createdAt: { gte: oneDayAgo }
      }
    })
    const recentXssAttacks = await prisma.xssTest.count({
      where: {
        attackDetected: true,
        createdAt: { gte: oneDayAgo }
      }
    })
    const recentCsrfAttacks = await prisma.csrfTest.count({
      where: {
        attackDetected: true,
        createdAt: { gte: oneDayAgo }
      }
    })

    // Top attackers by IP
    const sqlIPs = await prisma.sqlInjectionTest.groupBy({
      by: ['ipAddress'],
      _count: { ipAddress: true },
      where: { attackDetected: true },
      orderBy: { _count: { ipAddress: 'desc' } },
      take: 10
    })

    // Success rate
    const sqlSuccessRate = sqlCount > 0 
      ? ((await prisma.sqlInjectionTest.count({ where: { success: true } })) / sqlCount * 100).toFixed(1)
      : '0'
    const xssSuccessRate = xssCount > 0
      ? ((await prisma.xssTest.count({ where: { success: true } })) / xssCount * 100).toFixed(1)
      : '0'

    return NextResponse.json({
      success: true,
      statistics: {
        totalTests: sqlCount + xssCount + accessCount + csrfCount + headersCount + rateCount,
        testsByType: {
          sqlInjection: sqlCount,
          xss: xssCount,
          accessControl: accessCount,
          csrf: csrfCount,
          securityHeaders: headersCount,
          rateLimiting: rateCount
        },
        attacks: {
          total: sqlAttacks + xssAttacks + csrfAttacks + accessBypass,
          sql: sqlAttacks,
          xss: xssAttacks,
          csrf: csrfAttacks,
          accessBypass: accessBypass,
          rateLockouts: rateLockouts,
          last24Hours: recentSqlAttacks + recentXssAttacks + recentCsrfAttacks
        },
        severity: {
          sql: sqlSeverity,
          xss: xssSeverity
        },
        testModes: sqlModes,
        successRates: {
          sql: `${sqlSuccessRate}%`,
          xss: `${xssSuccessRate}%`
        },
        topAttackers: sqlIPs.map(ip => ({
          ipAddress: ip.ipAddress,
          attacks: ip._count.ipAddress
        })),
        database: {
          users: userCount,
          securityLogs: logCount
        }
      },
      recentTests: recentTests.slice(0, limit),
      timeline: {
        last24Hours: {
          sql: recentSqlAttacks,
          xss: recentXssAttacks,
          csrf: recentCsrfAttacks,
          total: recentSqlAttacks + recentXssAttacks + recentCsrfAttacks
        }
      }
    })

  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

// Export specific test type details
export async function POST(request: NextRequest) {
  try {
    const { testType, testId } = await request.json()

    let testDetails: any = null

    switch (testType) {
      case 'sql':
        testDetails = await prisma.sqlInjectionTest.findUnique({
          where: { id: testId }
        })
        break
      case 'xss':
        testDetails = await prisma.xssTest.findUnique({
          where: { id: testId }
        })
        break
      case 'access':
        testDetails = await prisma.accessControlTest.findUnique({
          where: { id: testId }
        })
        break
      case 'csrf':
        testDetails = await prisma.csrfTest.findUnique({
          where: { id: testId }
        })
        break
      case 'headers':
        testDetails = await prisma.securityHeadersTest.findUnique({
          where: { id: testId }
        })
        break
      case 'rate':
        testDetails = await prisma.rateLimitingTest.findUnique({
          where: { id: testId }
        })
        break
    }

    if (!testDetails) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    // Parse result JSON if it exists
    if (testDetails.result) {
      try {
        testDetails.resultParsed = JSON.parse(testDetails.result)
      } catch (e) {
        // Keep as string if parse fails
      }
    }

    return NextResponse.json({
      success: true,
      testDetails
    })

  } catch (error) {
    console.error('Test details error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch test details' },
      { status: 500 }
    )
  }
}
