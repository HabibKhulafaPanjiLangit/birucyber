import { NextRequest, NextResponse } from 'next/server'

// Simulated comments storage
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

      return NextResponse.json({
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
      })
    }

    // Vulnerable mode - XSS possible
    if (testMode === 'vulnerable') {
      // Check for XSS patterns
      const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<img[^>]*src[^>]*javascript:/gi,
        /<svg[^>]*onload[^>]*>/gi,
        /<link[^>]*href[^>]*javascript:/gi
      ]

      const hasXSS = xssPatterns.some(pattern => pattern.test(comment))

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
        
        // Simulate XSS attack
        return NextResponse.json({
          success: true,
          message: '🚨 XSS VULNERABILITY DETECTED! Script injected!',
          vulnerability: 'Cross Site Scripting (XSS)',
          impact: 'Malicious script can execute in users\' browsers',
          maliciousInput: comment,
          simulatedAttack: {
            type: 'Stored XSS',
            execution: 'Script runs when other users view the comment',
            consequences: [
              'Session hijacking',
              'Cookie theft',
              'Redirect to malicious sites',
              'Keylogging',
              'Defacement'
            ]
          },
          explanation: 'The input was not properly sanitized, allowing script injection.',
          prevention: [
            'Always escape HTML entities',
            'Use Content Security Policy (CSP)',
            'Validate input on server side',
            'Use libraries like DOMPurify',
            'HttpOnly cookies',
            'SameSite cookie attributes'
          ]
        })
      }

      // Normal comment in vulnerable mode (no XSS detected)
      const newComment = {
        id: comments.length + 1,
        author: author || 'Anonymous',
        content: comment,
        timestamp: new Date().toISOString()
      }

      comments.push(newComment)

      return NextResponse.json({
        success: true,
        message: 'Comment posted successfully',
        comment: newComment,
        security: {
          xssPrevention: 'None (vulnerable mode)',
          safeForDisplay: hasXSS ? false : true,
          vulnerabilities: hasXSS ? 'XSS detected' : 'None detected'
        }
      })
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