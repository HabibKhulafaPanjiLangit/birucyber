import { NextRequest, NextResponse } from 'next/server'

// Simulated database users
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', email: 'admin@example.com' },
  { id: 2, username: 'user1', password: 'user123', role: 'user', email: 'user1@example.com' },
  { id: 3, username: 'guest', password: 'guest123', role: 'guest', email: 'guest@example.com' }
]

export async function POST(request: NextRequest) {
  try {
    const { username, password, testMode = 'safe' } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Safe mode - proper parameter validation
    if (testMode === 'safe') {
      const user = users.find(u => 
        u.username === username.trim() && u.password === password.trim()
      )

      if (user) {
        return NextResponse.json({
          success: true,
          message: 'Login successful (safe mode)',
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email
          },
          query: `SELECT * FROM users WHERE username = ? AND password = ?`,
          parameters: [username, password]
        })
      } else {
        return NextResponse.json({
          success: false,
          message: 'Invalid credentials (safe mode)',
          query: `SELECT * FROM users WHERE username = ? AND password = ?`,
          parameters: [username, password]
        })
      }
    }

    // Vulnerable mode - SQL injection possible
    if (testMode === 'vulnerable') {
      // Simulate SQL injection vulnerability
      let query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`
      
      // Check for common SQL injection patterns
      const sqlInjectionPatterns = [
        /' OR '1'='1/i,
        /' OR '1'='1' --/i,
        /' OR 1=1 --/i,
        /' UNION SELECT/i,
        /'; DROP TABLE/i,
        /' OR 'a'='a/i
      ]

      const isInjection = sqlInjectionPatterns.some(pattern => 
        pattern.test(username) || pattern.test(password)
      )

      if (isInjection) {
        // Log to dashboard
        try {
          await fetch(`${request.nextUrl.origin}/api/dashboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              eventType: 'SQL_INJECTION',
              description: 'SQL Injection attack detected',
              payload: { username, password, query },
              severity: 'high',
              blocked: false
            })
          })
        } catch (e) {
          console.error('Failed to log to dashboard:', e)
        }
        
        // Simulate successful SQL injection attack
        return NextResponse.json({
          success: true,
          message: '🚨 SQL INJECTION SUCCESSFUL! Authentication bypassed!',
          vulnerability: 'SQL Injection',
          impact: 'Authentication bypass - all users exposed',
          maliciousQuery: query,
          simulatedResult: users, // All users exposed
          explanation: 'The input was not properly sanitized, allowing SQL injection to bypass authentication.',
          prevention: [
            'Use prepared statements or parameterized queries',
            'Validate and sanitize all user inputs',
            'Use ORM with built-in protection',
            'Implement least privilege database access'
          ]
        })
      }

      // Normal login attempt in vulnerable mode
      const user = users.find(u => 
        u.username === username && u.password === password
      )

      if (user) {
        return NextResponse.json({
          success: true,
          message: 'Login successful',
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email
          },
          query: query
        })
      } else {
        return NextResponse.json({
          success: false,
          message: 'Invalid credentials',
          query: query
        })
      }
    }

    return NextResponse.json(
      { error: 'Invalid test mode' },
      { status: 400 }
    )

  } catch (error) {
    console.error('SQL Injection test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'SQL Injection Testing API',
    endpoints: {
      'POST /api/sql-injection': {
        description: 'Test SQL injection vulnerability',
        parameters: {
          username: 'string',
          password: 'string',
          testMode: 'safe|vulnerable (default: safe)'
        },
        examples: {
          safe: {
            username: 'admin',
            password: 'admin123',
            testMode: 'safe'
          },
          vulnerable: {
            username: "' OR '1'='1' --",
            password: 'anything',
            testMode: 'vulnerable'
          }
        }
      }
    },
    warning: 'This API is for educational purposes only. Do not use for malicious activities.'
  })
}