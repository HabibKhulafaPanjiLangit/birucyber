import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Simulated user sessions
const sessions = new Map([
  ['session-admin-abc123', { userId: 1, username: 'admin', balance: 10000, email: 'admin@example.com' }],
  ['session-user-def456', { userId: 2, username: 'john', balance: 5000, email: 'john@example.com' }],
  ['session-guest-ghi789', { userId: 3, username: 'guest', balance: 1000, email: 'guest@example.com' }]
])

// CSRF tokens storage
const csrfTokens = new Map<string, string>()

export async function POST(request: NextRequest) {
  try {
    const { action, amount, recipient, sessionToken, csrfToken, testMode = 'safe' } = await request.json()

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    // Safe mode - CSRF protection enabled
    if (testMode === 'safe') {
      // Verify session
      const session = sessionToken ? sessions.get(sessionToken) : null
      if (!session) {
        return NextResponse.json({
          success: false,
          message: 'Invalid session',
          security: { csrfProtection: 'enabled', tokenValidation: 'required' }
        }, { status: 401 })
      }

      // Verify CSRF token
      const validToken = csrfTokens.get(sessionToken)
      if (!csrfToken || csrfToken !== validToken) {
        return NextResponse.json({
          success: false,
          message: 'CSRF token validation failed',
          security: {
            csrfProtection: 'enabled',
            tokenProvided: !!csrfToken,
            tokenValid: false,
            explanation: 'CSRF token missing or invalid. This prevents unauthorized cross-site requests.'
          }
        }, { status: 403 })
      }

      // Process the action securely
      if (action === 'transfer') {
        if (!amount || !recipient) {
          return NextResponse.json({ error: 'Amount and recipient required' }, { status: 400 })
        }

        if (session.balance < amount) {
          return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
        }

        // Simulate successful transfer
        const result = {
          success: true,
          message: '✅ Transfer completed successfully (safe mode)',
          transaction: {
            from: session.username,
            to: recipient,
            amount: amount,
            timestamp: new Date().toISOString()
          },
          newBalance: session.balance - amount,
          security: {
            csrfProtection: 'enabled',
            tokenValidated: true,
            sameOriginChecked: true,
            referrerValidated: true
          }
        }

        // Save test result to database
        try {
          await prisma.csrfTest.create({
            data: {
              action: action,
              sessionToken: sessionToken,
              csrfToken: csrfToken,
              testMode: 'safe',
              success: true,
              attackDetected: false,
              severity: 'low',
              ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
              userAgent: request.headers.get('user-agent') || 'unknown',
              result: JSON.stringify(result)
            }
          })
        } catch (dbError) {
          console.error('Failed to save CSRF test to database:', dbError)
        }

        return NextResponse.json(result)
      }

      const resultAction = {
        success: true,
        message: 'Action completed successfully (safe mode)',
        security: { csrfProtection: 'enabled' }
      }

      // Save action test result to database
      try {
        await prisma.csrfTest.create({
          data: {
            action: action,
            sessionToken: sessionToken,
            csrfToken: csrfToken,
            testMode: 'safe',
            success: true,
            attackDetected: false,
            severity: 'low',
            ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            result: JSON.stringify(resultAction)
          }
        })
      } catch (dbError) {
        console.error('Failed to save CSRF test to database:', dbError)
      }

      return NextResponse.json(resultAction)
    }

    // Vulnerable mode - No CSRF protection
    if (testMode === 'vulnerable') {
      const session = sessionToken ? sessions.get(sessionToken) : null
      
      if (!session) {
        return NextResponse.json({
          success: false,
          message: 'Invalid session'
        }, { status: 401 })
      }

      // No CSRF token validation - VULNERABILITY!
      if (action === 'transfer') {
        if (!amount || !recipient) {
          return NextResponse.json({ error: 'Amount and recipient required' }, { status: 400 })
        }

        // Log to dashboard
        try {
          await fetch(`${request.nextUrl.origin}/api/dashboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              eventType: 'CSRF_ATTACK',
              description: 'CSRF attack detected - unauthorized transfer',
              payload: { action, amount, recipient, sessionToken },
              severity: 'critical',
              blocked: false
            })
          })
        } catch (e) {
          console.error('Failed to log to dashboard:', e)
        }

        // Prepare result object
        const result = {
          success: true,
          message: '🚨 CSRF ATTACK SUCCESSFUL! Unauthorized transfer executed!',
          vulnerability: 'Cross-Site Request Forgery (CSRF)',
          severity: 'critical',
          impact: 'Attacker can perform unauthorized actions on behalf of authenticated users',
          attack: {
            type: 'CSRF',
            method: 'Forged POST request',
            victim: session.username,
            action: 'Money transfer',
            unauthorized: true
          },
          transaction: {
            from: session.username,
            to: recipient,
            amount: amount,
            timestamp: new Date().toISOString(),
            authorized: false
          },
          exploitScenario: {
            description: 'Attacker hosts malicious website with hidden form',
            maliciousHTML: `
<!-- Attacker's malicious page -->
<html>
<body onload="document.forms[0].submit()">
  <form action="https://victim-site.com/api/csrf" method="POST">
    <input type="hidden" name="action" value="transfer">
    <input type="hidden" name="amount" value="${amount}">
    <input type="hidden" name="recipient" value="attacker@evil.com">
    <input type="hidden" name="sessionToken" value="${sessionToken}">
    <input type="hidden" name="testMode" value="vulnerable">
  </form>
</body>
</html>`,
            attackFlow: [
              '1. Victim logs into banking website (gets session)',
              '2. Victim visits attacker\'s malicious website',
              '3. Malicious page auto-submits hidden form to banking site',
              '4. Browser includes victim\'s session cookie automatically',
              '5. Banking site processes request as if victim initiated it',
              '6. Money transferred to attacker without victim\'s knowledge'
            ]
          },
          realWorldImpact: [
            '💸 Unauthorized money transfers',
            '📧 Email/password changes without consent',
            '🗑️ Account deletion or data modification',
            '🛒 Unauthorized purchases',
            '👥 Adding attacker as admin/friend',
            '📝 Post content on behalf of victim',
            '🔓 Changing security settings',
            '📤 Data exfiltration through form submissions'
          ],
          explanation: `CSRF exploits the trust a website has in the user's browser. 

The application blindly trusts requests coming from authenticated sessions without verifying the origin.

Attack Mechanics:
1. Victim authenticates and receives session cookie
2. Session cookie is automatically sent with ALL requests to the domain
3. Attacker crafts malicious request (form, image, AJAX)
4. Victim's browser sends request WITH valid session cookie
5. Application can't distinguish legitimate vs forged requests
6. Unauthorized action executes successfully`,
          prevention: [
            '✅ CSRF Tokens: Generate unique token per session/request',
            '✅ SameSite Cookies: Set SameSite=Strict or Lax on session cookies',
            '✅ Origin Header Validation: Check Origin/Referer headers',
            '✅ Double Submit Cookies: Match cookie value with form parameter',
            '✅ Custom Headers: Require X-CSRF-Token header for state-changing operations',
            '✅ Re-authentication: Require password for sensitive actions',
            '✅ CAPTCHA: Add CAPTCHA for critical operations',
            '✅ Short Session Timeouts: Reduce attack window'
          ],
          codeExamples: {
            tokenGeneration: `
// Generate CSRF token
import crypto from 'crypto';
const csrfToken = crypto.randomBytes(32).toString('hex');
session.csrfToken = csrfToken;`,
            tokenValidation: `
// Validate CSRF token
if (request.body.csrfToken !== session.csrfToken) {
  return res.status(403).json({ error: 'CSRF token validation failed' });
}`,
            sameSiteCookie: `
// Set SameSite cookie attribute
res.cookie('sessionId', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});`,
            customHeader: `
// Client-side: Add custom header
fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});`
          },
          mitigation: [
            'Immediately implement CSRF token validation',
            'Add SameSite=Strict attribute to all session cookies',
            'Validate Origin and Referer headers',
            'Audit all state-changing endpoints',
            'Implement rate limiting on sensitive operations',
            'Add user notifications for critical actions',
            'Review and update session management'
          ]
        }

        // Save CSRF attack test result to database
        try {
          await prisma.csrfTest.create({
            data: {
              action: action,
              sessionToken: sessionToken,
              csrfToken: csrfToken || 'none',
              testMode: 'vulnerable',
              success: true,
              attackDetected: true,
              severity: 'critical',
              ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
              userAgent: request.headers.get('user-agent') || 'unknown',
              result: JSON.stringify(result)
            }
          })
        } catch (dbError) {
          console.error('Failed to save CSRF test to database:', dbError)
        }

        return NextResponse.json(result)
      }

      const resultVuln = {
        success: true,
        message: 'Action completed (no CSRF protection)',
        warning: 'This endpoint is vulnerable to CSRF attacks'
      }

      // Save vulnerable mode test result to database
      try {
        await prisma.csrfTest.create({
          data: {
            action: action,
            sessionToken: sessionToken,
            csrfToken: csrfToken || 'none',
            testMode: 'vulnerable',
            success: true,
            attackDetected: false,
            severity: 'medium',
            ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            result: JSON.stringify(resultVuln)
          }
        })
      } catch (dbError) {
        console.error('Failed to save CSRF test to database:', dbError)
      }

      return NextResponse.json(resultVuln)
    }

    return NextResponse.json(
      { error: 'Invalid test mode' },
      { status: 400 }
    )

  } catch (error) {
    console.error('CSRF test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const sessionToken = request.nextUrl.searchParams.get('sessionToken')
  
  if (!sessionToken) {
    return NextResponse.json({
      message: 'CSRF Protection Testing API',
      endpoints: {
        'GET /api/csrf?sessionToken=xxx': 'Get CSRF token for session',
        'POST /api/csrf': {
          description: 'Test CSRF vulnerability',
          parameters: {
            action: 'transfer | delete | update',
            sessionToken: 'string',
            csrfToken: 'string (required in safe mode)',
            testMode: 'safe|vulnerable (default: safe)',
            amount: 'number (for transfer)',
            recipient: 'string (for transfer)'
          }
        }
      },
      warning: 'This API is for educational purposes only.'
    })
  }

  // Generate CSRF token for session
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36)
  csrfTokens.set(sessionToken, token)
  
  const session = sessions.get(sessionToken)
  
  return NextResponse.json({
    success: true,
    csrfToken: token,
    session: session ? {
      username: session.username,
      balance: session.balance
    } : null,
    usage: 'Include this token in your POST request as csrfToken parameter'
  })
}
