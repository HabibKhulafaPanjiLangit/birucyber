import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get('type') || 'summary'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let reportData = {}

    switch (reportType) {
      case 'summary':
        reportData = await generateSummaryReport()
        break
      case 'security':
        reportData = await generateSecurityReport(startDate, endDate)
        break
      case 'user-activity':
        reportData = await generateUserActivityReport(startDate, endDate)
        break
      case 'vulnerability':
        reportData = await generateVulnerabilityReport()
        break
      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      reportType,
      generatedAt: new Date().toISOString(),
      data: reportData
    })

  } catch (error) {
    console.error('Reports API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

async function generateSummaryReport() {
  const totalUsers = await db.user.count()
  const totalPosts = await db.post.count()
  const totalComments = await db.comment.count()
  const totalSecurityLogs = await db.securityLog.count()

  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const recentActivity = await db.securityLog.count({
    where: { timestamp: { gte: last24Hours } }
  })

  const roleDistribution = await db.user.groupBy({
    by: ['role'],
    _count: { role: true }
  })

  return {
    overview: {
      totalUsers,
      totalPosts,
      totalComments,
      totalSecurityLogs,
      recentActivity24h: recentActivity
    },
    userRoles: roleDistribution,
    systemHealth: {
      status: 'Healthy',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage()
    }
  }
}

async function generateSecurityReport(startDate?: string | null, endDate?: string | null) {
  const dateFilter: any = {}
  if (startDate) dateFilter.gte = new Date(startDate)
  if (endDate) dateFilter.lte = new Date(endDate)

  const securityLogs = await db.securityLog.findMany({
    where: dateFilter.timestamp ? { timestamp: dateFilter } : undefined,
    orderBy: { timestamp: 'desc' },
    take: 100
  })

  const threatTypes = await db.securityLog.groupBy({
    by: ['eventType'],
    where: {
      eventType: { contains: 'THREAT' },
      ...dateFilter.timestamp ? { timestamp: dateFilter } : undefined
    },
    _count: { eventType: true }
  })

  const topIPs = await db.securityLog.groupBy({
    by: ['ipAddress'],
    where: dateFilter.timestamp ? { timestamp: dateFilter } : undefined,
    _count: { ipAddress: true },
    orderBy: { _count: { ipAddress: 'desc' } },
    take: 10
  })

  return {
    totalEvents: securityLogs.length,
    threatsDetected: threatTypes.reduce((sum, threat) => sum + threat._count.eventType, 0),
    threatTypes,
    topSourceIPs: topIPs.filter(ip => ip.ipAddress !== null),
    recentEvents: securityLogs.slice(0, 20).map(log => ({
      ...log,
      timestamp: log.timestamp.toISOString()
    }))
  }
}

async function generateUserActivityReport(startDate?: string | null, endDate?: string | null) {
  const dateFilter: any = {}
  if (startDate) dateFilter.gte = new Date(startDate)
  if (endDate) dateFilter.lte = new Date(endDate)

  const newUsers = await db.user.count({
    where: dateFilter.createdAt ? { createdAt: dateFilter } : undefined
  })

  const activeUsers = await db.user.groupBy({
    by: ['role'],
    _count: { role: true }
  })

  const recentPosts = await db.post.count({
    where: dateFilter.createdAt ? { createdAt: dateFilter } : undefined
  })

  const recentComments = await db.comment.count({
    where: dateFilter.createdAt ? { createdAt: dateFilter } : undefined
  })

  return {
    newUsers,
    activeUsers,
    contentActivity: {
      newPosts: recentPosts,
      newComments: recentComments
    },
    engagement: {
      totalInteractions: recentPosts + recentComments,
      averagePostsPerUser: activeUsers.length > 0 ? recentPosts / activeUsers.length : 0
    }
  }
}

async function generateVulnerabilityReport() {
  // Simulate vulnerability scan results
  const vulnerabilities = [
    {
      type: 'SQL Injection',
      severity: 'High',
      count: 3,
      description: 'Potential SQL injection points detected',
      recommendations: ['Use prepared statements', 'Validate input parameters']
    },
    {
      type: 'XSS',
      severity: 'Medium',
      count: 5,
      description: 'Cross-site scripting vulnerabilities found',
      recommendations: ['Implement output encoding', 'Use CSP headers']
    },
    {
      type: 'Access Control',
      severity: 'High',
      count: 2,
      description: 'Broken access control issues identified',
      recommendations: ['Implement proper authorization checks', 'Use RBAC']
    }
  ]

  const riskScore = vulnerabilities.reduce((score, vuln) => {
    const severityWeight = vuln.severity === 'High' ? 10 : vuln.severity === 'Medium' ? 5 : 2
    return score + (vuln.count * severityWeight)
  }, 0)

  return {
    totalVulnerabilities: vulnerabilities.reduce((sum, vuln) => sum + vuln.count, 0),
    riskScore: Math.min(100, riskScore),
    riskLevel: riskScore > 50 ? 'High' : riskScore > 20 ? 'Medium' : 'Low',
    vulnerabilities,
    lastScan: new Date().toISOString(),
    recommendations: [
      'Address high severity vulnerabilities immediately',
      'Implement regular security scanning',
      'Train development team on secure coding practices',
      'Set up automated security testing in CI/CD pipeline'
    ]
  }
}

export async function POST(request: NextRequest) {
  try {
    const { reportType, filters } = await request.json()

    // Generate custom report based on type and filters
    let reportData = {}
    
    switch (reportType) {
      case 'custom':
        reportData = await generateCustomReport(filters)
        break
      case 'export':
        reportData = await generateExportReport(filters)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      reportType,
      generatedAt: new Date().toISOString(),
      data: reportData
    })

  } catch (error) {
    console.error('Custom report generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate custom report' },
      { status: 500 }
    )
  }
}

async function generateCustomReport(filters: any) {
  // Implement custom report logic based on filters
  return {
    message: 'Custom report generated',
    filters,
    data: 'Custom report data would go here'
  }
}

async function generateExportReport(filters: any) {
  // Implement export report logic (CSV, PDF, etc.)
  return {
    message: 'Export report generated',
    format: filters.format || 'json',
    data: 'Export data would go here'
  }
}