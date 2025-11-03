import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const [
      totalScans,
      completedScans,
      failedScans,
      pendingScans,
      avgScore,
      avgDuration,
      criticalFindings,
      highFindings,
      sqlInjectionCount,
      xssCount,
      accessControlCount,
      recentScans,
      topVulnerableUrls
    ] = await Promise.all([
      // Total scans
      prisma.websiteScan.count(),
      
      // Completed scans
      prisma.websiteScan.count({ where: { status: 'completed' } }),
      
      // Failed scans
      prisma.websiteScan.count({ where: { status: 'failed' } }),
      
      // Pending scans
      prisma.websiteScan.count({ where: { status: { in: ['pending', 'scanning'] } } }),
      
      // Average security score
      prisma.websiteScan.aggregate({
        _avg: { securityScore: true },
        where: { status: 'completed', securityScore: { not: null } }
      }),
      
      // Average scan duration
      prisma.websiteScan.aggregate({
        _avg: { scanDuration: true },
        where: { status: 'completed', scanDuration: { not: null } }
      }),
      
      // Critical severity findings
      prisma.websiteScan.count({ where: { severity: 'critical' } }),
      
      // High severity findings
      prisma.websiteScan.count({ where: { severity: 'high' } }),
      
      // SQL Injection vulnerabilities
      prisma.websiteScan.count({ where: { sqlInjection: true } }),
      
      // XSS vulnerabilities
      prisma.websiteScan.count({ where: { xssVulnerable: true } }),
      
      // Broken Access Control
      prisma.websiteScan.count({ where: { brokenAccessControl: true } }),
      
      // Recent scans (last 5)
      prisma.websiteScan.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          targetUrl: true,
          scanType: true,
          status: true,
          securityScore: true,
          severity: true,
          createdAt: true
        }
      }),
      
      // Top vulnerable URLs (lowest scores)
      prisma.websiteScan.findMany({
        where: {
          status: 'completed',
          securityScore: { not: null }
        },
        orderBy: { securityScore: 'asc' },
        take: 5,
        select: {
          id: true,
          targetUrl: true,
          securityScore: true,
          severity: true,
          sqlInjection: true,
          xssVulnerable: true,
          brokenAccessControl: true,
          createdAt: true
        }
      })
    ])
    
    // Calculate success rate
    const successRate = totalScans > 0 
      ? ((completedScans / totalScans) * 100).toFixed(2) 
      : '0'
    
    // Calculate vulnerability rate
    const vulnerabilityRate = completedScans > 0
      ? (((sqlInjectionCount + xssCount + accessControlCount) / completedScans) * 100).toFixed(2)
      : '0'
    
    return NextResponse.json({
      success: true,
      stats: {
        overview: {
          totalScans,
          completedScans,
          failedScans,
          pendingScans,
          successRate: parseFloat(successRate),
          averageSecurityScore: avgScore._avg.securityScore 
            ? Math.round(avgScore._avg.securityScore) 
            : 0,
          averageScanDuration: avgDuration._avg.scanDuration 
            ? Math.round(avgDuration._avg.scanDuration) 
            : 0,
        },
        
        vulnerabilities: {
          critical: criticalFindings,
          high: highFindings,
          sqlInjection: sqlInjectionCount,
          xss: xssCount,
          brokenAccessControl: accessControlCount,
          vulnerabilityRate: parseFloat(vulnerabilityRate)
        },
        
        recentScans,
        topVulnerableUrls,
        
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
