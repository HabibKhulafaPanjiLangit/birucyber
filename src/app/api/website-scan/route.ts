import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Security Headers to check
const SECURITY_HEADERS = [
  'Content-Security-Policy',
  'X-Frame-Options',
  'X-Content-Type-Options',
  'Strict-Transport-Security',
  'X-XSS-Protection',
  'Referrer-Policy',
  'Permissions-Policy'
]

// SQL Injection test payloads
const SQL_PAYLOADS = [
  "' OR '1'='1",
  "admin'--",
  "' OR 1=1--",
  "1' UNION SELECT NULL--"
]

// XSS test payloads
const XSS_PAYLOADS = [
  "<script>alert('XSS')</script>",
  "<img src=x onerror=alert(1)>",
  "<svg/onload=alert(1)>"
]

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { targetUrl, scanType = 'quick' } = await request.json()

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'Target URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    let url: URL
    try {
      url = new URL(targetUrl)
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Invalid protocol')
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format. Use http:// or https://' },
        { status: 400 }
      )
    }

    // Create scan record
    const scan = await prisma.websiteScan.create({
      data: {
        targetUrl: url.toString(),
        scanType,
        status: 'scanning',
        scannerIp: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'BiruCyber Scanner'
      }
    })

    // Start scanning (async)
    performScan(scan.id, url, scanType).catch(console.error)

    return NextResponse.json({
      success: true,
      message: 'Scan initiated',
      scanId: scan.id,
      targetUrl: url.toString(),
      estimatedTime: scanType === 'full' ? '2-5 minutes' : '30-60 seconds'
    })

  } catch (error: any) {
    console.error('Website scan error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate scan: ' + error.message },
      { status: 500 }
    )
  }
}

async function performScan(scanId: string, url: URL, scanType: string) {
  const startTime = Date.now()
  const results: any = {
    vulnerabilities: [],
    securityHeaders: {},
    sslInfo: {},
    technologies: [],
    openPorts: [],
    checks: {
      total: 0,
      passed: 0,
      failed: 0
    }
  }

  try {
    // 1. Check if website is accessible
    results.checks.total++
    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'User-Agent': 'BiruCyber Security Scanner/1.0'
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      if (response.ok) {
        results.checks.passed++
      }

      // 2. Check Security Headers
      results.checks.total += SECURITY_HEADERS.length
      const headers: any = {}
      
      for (const header of SECURITY_HEADERS) {
        const value = response.headers.get(header)
        headers[header] = value || 'Missing'
        
        if (value) {
          results.checks.passed++
        } else {
          results.checks.failed++
          results.vulnerabilities.push({
            type: 'Missing Security Header',
            name: header,
            severity: 'medium',
            description: `Security header ${header} is not set`,
            recommendation: `Add ${header} header to improve security`
          })
        }
      }
      results.securityHeaders = headers

      // 3. Detect Technologies
      const contentType = response.headers.get('content-type')
      const server = response.headers.get('server')
      const poweredBy = response.headers.get('x-powered-by')
      
      if (server) results.technologies.push(`Server: ${server}`)
      if (poweredBy) results.technologies.push(`Powered By: ${poweredBy}`)
      if (contentType) results.technologies.push(`Content-Type: ${contentType}`)

      // 4. Get response body for further analysis
      const html = await response.text()

      // Check for common vulnerabilities in HTML
      if (html.toLowerCase().includes('<input') && !html.toLowerCase().includes('csrf')) {
        results.checks.total++
        results.checks.failed++
        results.vulnerabilities.push({
          type: 'Potential CSRF Vulnerability',
          severity: 'high',
          description: 'Forms detected without visible CSRF protection',
          recommendation: 'Implement CSRF tokens for all forms'
        })
      }

      // Check for SQL error messages (potential SQL injection)
      const sqlErrors = ['sql syntax', 'mysql_fetch', 'pg_query', 'sqlite_query', 'odbc_exec']
      results.checks.total++
      for (const error of sqlErrors) {
        if (html.toLowerCase().includes(error)) {
          results.checks.failed++
          results.vulnerabilities.push({
            type: 'SQL Injection - Error Disclosure',
            severity: 'critical',
            description: 'SQL error messages exposed in response',
            recommendation: 'Disable detailed error messages in production'
          })
          break
        }
      }
      if (!results.vulnerabilities.some((v: any) => v.type.includes('SQL'))) {
        results.checks.passed++
      }

      // Check for exposed sensitive info
      results.checks.total++
      const sensitivePatterns = ['password', 'api_key', 'secret', 'token', 'private']
      let foundSensitive = false
      for (const pattern of sensitivePatterns) {
        if (html.toLowerCase().includes(`"${pattern}"`)) {
          results.checks.failed++
          foundSensitive = true
          results.vulnerabilities.push({
            type: 'Sensitive Information Exposure',
            severity: 'high',
            description: `Potential sensitive data found: ${pattern}`,
            recommendation: 'Remove sensitive information from client-side code'
          })
          break
        }
      }
      if (!foundSensitive) results.checks.passed++

    } catch (fetchError: any) {
      results.checks.failed++
      results.vulnerabilities.push({
        type: 'Connection Error',
        severity: 'critical',
        description: `Failed to connect to website: ${fetchError.message}`,
        recommendation: 'Verify website is accessible and not blocking automated requests'
      })
    }

    // 5. SSL/TLS Check
    results.checks.total++
    if (url.protocol === 'https:') {
      results.checks.passed++
      results.sslInfo = {
        enabled: true,
        protocol: 'HTTPS',
        status: 'Secure connection established'
      }
    } else {
      results.checks.failed++
      results.sslInfo = {
        enabled: false,
        protocol: 'HTTP',
        status: 'Insecure connection'
      }
      results.vulnerabilities.push({
        type: 'No SSL/TLS Encryption',
        severity: 'critical',
        description: 'Website is not using HTTPS',
        recommendation: 'Enable SSL/TLS certificate and enforce HTTPS'
      })
    }

    // 6. Check for common vulnerable endpoints
    if (scanType === 'full') {
      const vulnerableEndpoints = [
        '/admin',
        '/login',
        '/api',
        '/.git',
        '/.env',
        '/config',
        '/backup',
        '/phpMyAdmin'
      ]

      results.checks.total += vulnerableEndpoints.length
      for (const endpoint of vulnerableEndpoints) {
        try {
          const testUrl = new URL(endpoint, url.toString())
          const resp = await fetch(testUrl.toString(), {
            method: 'HEAD',
            signal: AbortSignal.timeout(5000)
          })

          if (resp.status === 200) {
            results.checks.failed++
            results.vulnerabilities.push({
              type: 'Exposed Sensitive Endpoint',
              severity: 'medium',
              description: `Endpoint ${endpoint} is publicly accessible`,
              recommendation: 'Restrict access to sensitive endpoints'
            })
          } else {
            results.checks.passed++
          }
        } catch {
          results.checks.passed++ // Not accessible = good
        }
      }
    }

    // Calculate security score
    const score = results.checks.total > 0 
      ? Math.round((results.checks.passed / results.checks.total) * 100)
      : 0

    // Determine overall severity
    const criticalCount = results.vulnerabilities.filter((v: any) => v.severity === 'critical').length
    const highCount = results.vulnerabilities.filter((v: any) => v.severity === 'high').length
    const mediumCount = results.vulnerabilities.filter((v: any) => v.severity === 'medium').length
    
    let overallSeverity = 'low'
    if (criticalCount > 0) overallSeverity = 'critical'
    else if (highCount > 0) overallSeverity = 'high'
    else if (mediumCount > 0) overallSeverity = 'medium'

    // Generate recommendations
    const recommendations = [
      'Enable HTTPS if not already enabled',
      'Implement all missing security headers',
      'Use Content Security Policy (CSP)',
      'Enable HTTP Strict Transport Security (HSTS)',
      'Disable detailed error messages in production',
      'Implement rate limiting on sensitive endpoints',
      'Use CSRF tokens for all state-changing operations',
      'Regular security audits and penetration testing'
    ]

    // Update scan record
    const duration = Math.round((Date.now() - startTime) / 1000)
    await prisma.websiteScan.update({
      where: { id: scanId },
      data: {
        status: 'completed',
        vulnerabilities: JSON.stringify(results.vulnerabilities),
        securityScore: score,
        sqlInjection: results.vulnerabilities.some((v: any) => v.type.includes('SQL')),
        xssVulnerable: results.vulnerabilities.some((v: any) => v.type.includes('XSS')),
        brokenAccessControl: results.vulnerabilities.some((v: any) => v.type.includes('Access')),
        securityHeaders: JSON.stringify(results.securityHeaders),
        sslInfo: JSON.stringify(results.sslInfo),
        technologies: JSON.stringify(results.technologies),
        openPorts: JSON.stringify([]), // Placeholder
        scanDuration: duration,
        totalChecks: results.checks.total,
        passedChecks: results.checks.passed,
        failedChecks: results.checks.failed,
        recommendations: JSON.stringify(recommendations),
        severity: overallSeverity,
        completedAt: new Date()
      }
    })

  } catch (error: any) {
    console.error('Scan error:', error)
    await prisma.websiteScan.update({
      where: { id: scanId },
      data: {
        status: 'failed',
        errorMessage: error.message,
        completedAt: new Date()
      }
    })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const scanId = searchParams.get('scanId')

    if (scanId) {
      // Get specific scan result
      const scan = await prisma.websiteScan.findUnique({
        where: { id: scanId }
      })

      if (!scan) {
        return NextResponse.json(
          { error: 'Scan not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        scan: {
          ...scan,
          vulnerabilities: scan.vulnerabilities ? JSON.parse(scan.vulnerabilities) : [],
          securityHeaders: scan.securityHeaders ? JSON.parse(scan.securityHeaders) : {},
          sslInfo: scan.sslInfo ? JSON.parse(scan.sslInfo) : {},
          technologies: scan.technologies ? JSON.parse(scan.technologies) : [],
          openPorts: scan.openPorts ? JSON.parse(scan.openPorts) : [],
          recommendations: scan.recommendations ? JSON.parse(scan.recommendations) : []
        }
      })
    }

    // Get all scans (recent 50)
    const scans = await prisma.websiteScan.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json({
      success: true,
      scans: scans.map(scan => ({
        id: scan.id,
        targetUrl: scan.targetUrl,
        status: scan.status,
        securityScore: scan.securityScore,
        severity: scan.severity,
        scanDuration: scan.scanDuration,
        createdAt: scan.createdAt,
        completedAt: scan.completedAt
      }))
    })

  } catch (error: any) {
    console.error('Get scan error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve scan' },
      { status: 500 }
    )
  }
}
