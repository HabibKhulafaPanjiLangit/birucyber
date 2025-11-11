import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Simulated sensitive database tables (for demo purposes)
const creditCards = [
  { id: 1, userId: 1, cardNumber: '4532-1234-5678-9010', cvv: '123', expiry: '12/25' },
  { id: 2, userId: 2, cardNumber: '5425-2345-6789-0123', cvv: '456', expiry: '06/26' },
  { id: 3, userId: 4, cardNumber: '3782-3456-7890-1234', cvv: '789', expiry: '03/27' }
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

    // Safe mode - proper parameter validation using real database
    if (testMode === 'safe') {
      try {
        // Try to find user by username or email
  const user = await db?.user.findFirst({
          where: {
            OR: [
              { username: username.trim() },
              { email: username.trim() }
            ],
            password: password.trim()
          }
        })

        if (user) {
          const result = {
            success: true,
            message: '✅ Login successful (safe mode)',
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              name: user.name,
              role: user.role
            },
            security: {
              method: 'Parameterized query',
              protected: true,
              sqlInjectionPrevented: true
            },
            query: `SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?`,
            parameters: ['[REDACTED]', '[REDACTED]', '[REDACTED]']
          }

          // Save successful safe login to database
          try {
            await db?.sqlInjectionTest.create({
              data: {
                username: username,
                password: '[REDACTED]', // Don't store actual password in safe mode
                testMode: 'safe',
                success: true,
                attackDetected: false,
                attackType: null,
                severity: 'low',
                ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown',
                result: JSON.stringify(result)
              }
            })
          } catch (dbError) {
            console.error('Failed to save SQL injection test to database:', dbError)
          }

          return NextResponse.json(result)
        } else {
          const result = {
            success: false,
            message: '❌ Invalid credentials (safe mode)',
            security: {
              method: 'Parameterized query',
              protected: true,
              sqlInjectionPrevented: true
            },
            query: `SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?`,
            parameters: ['[REDACTED]', '[REDACTED]', '[REDACTED]']
          }

          // Save failed safe login to database
          try {
            await db?.sqlInjectionTest.create({
              data: {
                username: username,
                password: '[REDACTED]',
                testMode: 'safe',
                success: false,
                attackDetected: false,
                attackType: null,
                severity: 'low',
                ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown',
                result: JSON.stringify(result)
              }
            })
          } catch (dbError) {
            console.error('Failed to save SQL injection test to database:', dbError)
          }

          return NextResponse.json(result)
        }
      } catch (error: any) {
        return NextResponse.json({
          success: false,
          message: 'Database error',
          error: error.message
        }, { status: 500 })
      }
    }

    // Vulnerable mode - SQL injection possible
    if (testMode === 'vulnerable') {
      // Simulate SQL injection vulnerability
      let query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`
      
      // Enhanced SQL injection pattern detection
      const sqlInjectionPatterns = [
        { pattern: /' OR '1'='1/i, name: 'Classic OR bypass', severity: 'high' },
        { pattern: /' OR '1'='1' --/i, name: 'OR bypass with comment', severity: 'high' },
        { pattern: /' OR 1=1 --/i, name: 'Numeric OR bypass', severity: 'high' },
        { pattern: /' UNION SELECT/i, name: 'UNION-based injection', severity: 'critical' },
        { pattern: /'; DROP TABLE/i, name: 'DROP TABLE attack', severity: 'critical' },
        { pattern: /' OR 'a'='a/i, name: 'Alternative OR bypass', severity: 'high' },
        { pattern: /' AND '1'='2/i, name: 'AND false condition', severity: 'medium' },
        { pattern: /admin'--/i, name: 'Comment-based bypass', severity: 'high' },
        { pattern: /' UNION ALL SELECT/i, name: 'UNION ALL injection', severity: 'critical' },
        { pattern: /' AND SLEEP\(/i, name: 'Time-based blind SQLi', severity: 'high' },
        { pattern: /' OR SLEEP\(/i, name: 'Time-based OR injection', severity: 'high' },
        { pattern: /' XOR /i, name: 'XOR-based injection', severity: 'medium' },
        { pattern: /'\) OR \('/i, name: 'Parenthesis bypass', severity: 'medium' }
      ]

      const detectedPattern = sqlInjectionPatterns.find(({ pattern }) => 
        pattern.test(username) || pattern.test(password)
      )

      if (detectedPattern) {
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
        
        // Fetch all users from database to simulate data breach
  const allUsers = await db?.user.findMany({
          select: {
            id: true,
            username: true,
            email: true,
            name: true,
            role: true,
            password: true // In real attack, passwords would be exposed
          }
        })

        // Prepare result object
        const result = {
          success: true,
          message: '🚨 SQL INJECTION SUCCESSFUL! Authentication bypassed!',
          vulnerability: 'SQL Injection',
          attackType: detectedPattern.name,
          severity: detectedPattern.severity,
          impact: 'Critical - Authentication bypass & Data exposure',
          maliciousQuery: query,
          exposedData: {
            users: allUsers,
            creditCards: creditCards, // Simulating data breach
            totalRecordsExposed: (allUsers?.length ?? 0) + creditCards.length
          },
          attackVector: username.includes('UNION') ? 'UNION-based SQLi' : 
                       username.includes('SLEEP') ? 'Time-based Blind SQLi' : 
                       'Boolean-based Blind SQLi',
          explanation: `The application executed: ${query}\n\nThis allowed the attacker to ${
            detectedPattern.name === 'UNION-based injection' ? 'extract data from multiple tables' :
            detectedPattern.name === 'DROP TABLE attack' ? 'potentially destroy database tables' :
            'bypass authentication and access unauthorized data'
          }.`,
          realWorldImpact: [
            '💳 Credit card information exposed',
            '🔐 All user credentials compromised',
            '📊 Sensitive salary and SSN data leaked',
            '⚠️ Potential for data manipulation or deletion',
            '🚨 Complete database compromise possible'
          ],
          prevention: [
            '✅ Use Prepared Statements: $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? AND password = ?");',
            '✅ Parameterized Queries: query("SELECT * FROM users WHERE id = @id", {id: userId})',
            '✅ Input Validation: Whitelist acceptable characters and patterns',
            '✅ ORM Usage: Use Prisma, TypeORM, Sequelize with proper escaping',
            '✅ Least Privilege: Database user should have minimal permissions',
            '✅ WAF Implementation: Web Application Firewall to detect patterns',
            '✅ Error Handling: Don\'t expose database errors to users'
          ],
          mitigation: [
            'Immediately patch the vulnerable code',
            'Audit all database queries in the application',
            'Implement input validation middleware',
            'Add query logging and monitoring',
            'Conduct security penetration testing'
          ]
        }

        // Save test result to database
        try {
          await db?.sqlInjectionTest.create({
            data: {
              username: username,
              password: password,
              testMode: 'vulnerable',
              success: true,
              attackDetected: true,
              attackType: detectedPattern.name,
              severity: detectedPattern.severity,
              ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
              userAgent: request.headers.get('user-agent') || 'unknown',
              result: JSON.stringify(result)
            }
          })
        } catch (dbError) {
          console.error('Failed to save SQL injection test to database:', dbError)
        }

        return NextResponse.json(result)
      }

      // Normal login attempt in vulnerable mode (no SQL injection detected)
  const user = await db?.user.findFirst({
        where: {
          OR: [
            { username: username },
            { email: username }
          ],
          password: password
        }
      })

      if (user) {
        const result = {
          success: true,
          message: 'Login successful (vulnerable mode - no protection)',
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email
          },
          query: query
        }

        // Save successful login to database
        try {
          await db?.sqlInjectionTest.create({
            data: {
              username: username,
              password: password,
              testMode: 'vulnerable',
              success: true,
              attackDetected: false,
              attackType: null,
              severity: 'low',
              ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
              userAgent: request.headers.get('user-agent') || 'unknown',
              result: JSON.stringify(result)
            }
          })
        } catch (dbError) {
          console.error('Failed to save SQL injection test to database:', dbError)
        }

        return NextResponse.json(result)
      } else {
        const result = {
          success: false,
          message: 'Invalid credentials',
          query: query
        }

        // Save failed login to database
        try {
          await db?.sqlInjectionTest.create({
            data: {
              username: username,
              password: password,
              testMode: 'vulnerable',
              success: false,
              attackDetected: false,
              attackType: null,
              severity: 'low',
              ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
              userAgent: request.headers.get('user-agent') || 'unknown',
              result: JSON.stringify(result)
            }
          })
        } catch (dbError) {
          console.error('Failed to save SQL injection test to database:', dbError)
        }

        return NextResponse.json(result)
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