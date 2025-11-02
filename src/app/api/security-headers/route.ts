import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { testMode = 'safe', checkHeaders = true } = await request.json()

    const requestHeaders = Object.fromEntries(request.headers.entries())
    
    // Security headers to check
    const securityHeaders = {
      'Content-Security-Policy': {
        recommended: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
        purpose: 'Prevents XSS by controlling resource loading',
        severity: 'critical'
      },
      'X-Frame-Options': {
        recommended: 'DENY or SAMEORIGIN',
        purpose: 'Prevents clickjacking attacks',
        severity: 'high'
      },
      'X-Content-Type-Options': {
        recommended: 'nosniff',
        purpose: 'Prevents MIME-type sniffing',
        severity: 'medium'
      },
      'Strict-Transport-Security': {
        recommended: 'max-age=31536000; includeSubDomains',
        purpose: 'Forces HTTPS connections',
        severity: 'high'
      },
      'X-XSS-Protection': {
        recommended: '1; mode=block',
        purpose: 'Enables browser XSS filtering',
        severity: 'medium'
      },
      'Referrer-Policy': {
        recommended: 'strict-origin-when-cross-origin',
        purpose: 'Controls referrer information',
        severity: 'low'
      },
      'Permissions-Policy': {
        recommended: 'geolocation=(), microphone=(), camera=()',
        purpose: 'Controls browser features/APIs',
        severity: 'medium'
      }
    }

    if (testMode === 'safe') {
      // Simulate response with proper security headers
      const resultData = {
        success: true,
        message: '✅ All security headers properly configured',
        headers: securityHeaders,
        status: 'SECURE',
        score: 100,
        details: Object.entries(securityHeaders).map(([header, config]) => ({
          header,
          present: true,
          configured: config.recommended,
          purpose: config.purpose,
          severity: config.severity,
          status: '✅ PASS'
        }))
      }

      // Save test result to database
      try {
        await prisma.securityHeadersTest.create({
          data: {
            testMode: 'safe',
            score: 100,
            missingHeaders: 0,
            vulnerabilities: JSON.stringify([]),
            ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            result: JSON.stringify(resultData)
          }
        })
      } catch (dbError) {
        console.error('Failed to save security headers test to database:', dbError)
      }

      const response = NextResponse.json(resultData)

      // Set all security headers
      response.headers.set('Content-Security-Policy', securityHeaders['Content-Security-Policy'].recommended)
      response.headers.set('X-Frame-Options', 'DENY')
      response.headers.set('X-Content-Type-Options', 'nosniff')
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
      response.headers.set('X-XSS-Protection', '1; mode=block')
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
      response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

      return response
    }

    if (testMode === 'vulnerable') {
      // Check which headers are missing
      const missingHeaders: string[] = []
      const presentHeaders: string[] = []
      let score = 100

      Object.entries(securityHeaders).forEach(([header, config]) => {
        const headerLower = header.toLowerCase()
        const isPresent = Array.from(request.headers.keys()).some(h => h.toLowerCase() === headerLower)
        
        if (!isPresent) {
          missingHeaders.push(header)
          const deduction = config.severity === 'critical' ? 25 : config.severity === 'high' ? 15 : config.severity === 'medium' ? 10 : 5
          score -= deduction
        } else {
          presentHeaders.push(header)
        }
      })

      // Log to dashboard
      if (missingHeaders.length > 0) {
        try {
          await fetch(`${request.nextUrl.origin}/api/dashboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              eventType: 'SECURITY_HEADERS',
              description: `Missing ${missingHeaders.length} security headers`,
              payload: { missingHeaders, score },
              severity: score < 50 ? 'critical' : score < 75 ? 'high' : 'medium',
              blocked: false
            })
          })
        } catch (e) {
          console.error('Failed to log to dashboard:', e)
        }
      }

      const resultVuln = {
        success: false,
        message: `🚨 Security Headers Missing! ${missingHeaders.length} critical headers not configured`,
        vulnerability: 'Missing Security Headers',
        severity: score < 50 ? 'critical' : score < 75 ? 'high' : 'medium',
        score,
        status: score >= 80 ? 'GOOD' : score >= 60 ? 'FAIR' : score >= 40 ? 'POOR' : 'CRITICAL',
        missingHeaders: missingHeaders.map(header => ({
          header,
          recommended: securityHeaders[header as keyof typeof securityHeaders].recommended,
          purpose: securityHeaders[header as keyof typeof securityHeaders].purpose,
          severity: securityHeaders[header as keyof typeof securityHeaders].severity,
          risk: getRisk(header)
        })),
        presentHeaders,
        vulnerabilities: generateVulnerabilities(missingHeaders),
        realWorldImpact: [
          '🎯 Clickjacking: Site can be embedded in malicious iframe (missing X-Frame-Options)',
          '🔓 XSS Attacks: No CSP protection allows script injection',
          '📡 Man-in-the-Middle: HTTP connections allowed (missing HSTS)',
          '🎭 MIME Sniffing: Browser may execute malicious files (missing X-Content-Type-Options)',
          '📍 Privacy Leaks: Referrer exposes sensitive URLs',
          '📱 Unauthorized API Access: No feature policy restrictions'
        ],
        explanation: `Security headers are HTTP response headers that instruct browsers to enable security protections.

Missing Headers Risk:
${missingHeaders.map(h => `- ${h}: ${securityHeaders[h as keyof typeof securityHeaders].purpose}`).join('\n')}

These headers provide defense-in-depth security layers. Without them, applications are vulnerable to multiple attack vectors even if other security measures are in place.`,
        prevention: [
          '✅ Set Content-Security-Policy to prevent XSS',
          '✅ Enable X-Frame-Options to prevent clickjacking',
          '✅ Use HSTS to enforce HTTPS',
          '✅ Set X-Content-Type-Options: nosniff',
          '✅ Configure Referrer-Policy to protect privacy',
          '✅ Use Permissions-Policy to restrict feature access',
          '✅ Regularly audit headers with security scanners'
        ],
        codeExamples: {
          nextjs: `
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline';"
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()'
          }
        ]
      }
    ]
  }
}`,
          express: `
// Express.js with Helmet
const helmet = require('helmet');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true
  }
}));`,
          nginx: `
# NGINX configuration
add_header Content-Security-Policy "default-src 'self';" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;`
        },
        mitigation: [
          'Configure security headers in web server or application',
          'Use security header libraries (Helmet.js, django-csp)',
          'Test headers with online scanners (securityheaders.com)',
          'Monitor header configuration in production',
          'Implement CSP gradually to avoid breaking functionality',
          'Use report-only mode first for CSP testing'
        ],
        resources: [
          'OWASP Secure Headers Project',
          'Mozilla Observatory',
          'SecurityHeaders.com scanner',
          'Content Security Policy Reference'
        ]
      }

      // Save vulnerable test result to database
      try {
        await prisma.securityHeadersTest.create({
          data: {
            testMode: 'vulnerable',
            score: score,
            missingHeaders: missingHeaders.length,
            vulnerabilities: JSON.stringify(missingHeaders),
            ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            result: JSON.stringify(resultVuln)
          }
        })
      } catch (dbError) {
        console.error('Failed to save security headers test to database:', dbError)
      }

      return NextResponse.json(resultVuln)
    }

    return NextResponse.json(
      { error: 'Invalid test mode' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Security headers test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getRisk(header: string): string {
  const risks: Record<string, string> = {
    'Content-Security-Policy': 'XSS attacks, data injection, malicious script execution',
    'X-Frame-Options': 'Clickjacking, UI redressing attacks',
    'X-Content-Type-Options': 'MIME confusion attacks, drive-by downloads',
    'Strict-Transport-Security': 'Man-in-the-middle attacks, session hijacking',
    'X-XSS-Protection': 'Reflected XSS attacks (legacy browsers)',
    'Referrer-Policy': 'Information disclosure, privacy leaks',
    'Permissions-Policy': 'Unauthorized feature access, privacy violations'
  }
  return risks[header] || 'Security misconfiguration'
}

function generateVulnerabilities(missingHeaders: string[]): Array<{attack: string, possible: boolean}> {
  return [
    { attack: 'Cross-Site Scripting (XSS)', possible: missingHeaders.includes('Content-Security-Policy') },
    { attack: 'Clickjacking', possible: missingHeaders.includes('X-Frame-Options') },
    { attack: 'MIME Sniffing Attack', possible: missingHeaders.includes('X-Content-Type-Options') },
    { attack: 'Man-in-the-Middle', possible: missingHeaders.includes('Strict-Transport-Security') },
    { attack: 'Information Disclosure', possible: missingHeaders.includes('Referrer-Policy') }
  ].filter(v => v.possible)
}

export async function GET() {
  return NextResponse.json({
    message: 'Security Headers Testing API',
    endpoints: {
      'POST /api/security-headers': {
        description: 'Test security headers configuration',
        parameters: {
          testMode: 'safe|vulnerable (default: safe)',
          checkHeaders: 'boolean (default: true)'
        }
      }
    },
    headers: {
      'Content-Security-Policy': 'Prevents XSS and data injection',
      'X-Frame-Options': 'Prevents clickjacking',
      'X-Content-Type-Options': 'Prevents MIME sniffing',
      'Strict-Transport-Security': 'Forces HTTPS',
      'X-XSS-Protection': 'Browser XSS filter',
      'Referrer-Policy': 'Controls referrer info',
      'Permissions-Policy': 'Controls browser features'
    },
    warning: 'This API is for educational purposes only.'
  })
}
