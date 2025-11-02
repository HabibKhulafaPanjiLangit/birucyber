import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Role-based permissions mapping
const userRoles = {
  GUEST: {
    permissions: ['read:public'],
    resources: ['/public', '/home']
  },
  USER: {
    permissions: ['read:public', 'read:profile', 'update:profile'],
    resources: ['/public', '/home', '/profile', '/dashboard']
  },
  ADMIN: {
    permissions: ['read:public', 'read:profile', 'update:profile', 'read:admin', 'write:admin', 'delete:admin', 'read:users'],
    resources: ['/public', '/home', '/profile', '/dashboard', '/admin', '/api/users', '/api/reports']
  }
}

export async function POST(request: NextRequest) {
  try {
    const { resource, userToken, testMode = 'safe', bypassAttempt = false } = await request.json()

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource is required' },
        { status: 400 }
      )
    }

    // Safe mode - proper access control using real database
    if (testMode === 'safe') {
      try {
        // Find user by email or username (userToken can be email/username)
        const user = userToken ? await prisma.user.findFirst({
          where: {
            OR: [
              { email: userToken },
              { username: userToken }
            ]
          }
        }) : null
        
        const userRole = user ? userRoles[user.role] : userRoles['GUEST']
        const hasAccess = userRole.resources.includes(resource) || resource.startsWith('/public')

        const result = {
          success: hasAccess,
          message: hasAccess ? '✅ Access granted (safe mode)' : '❌ Access denied (safe mode)',
          user: user ? {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role
          } : {
            username: 'anonymous',
            role: 'GUEST'
          },
          requestedResource: resource,
          allowedResources: userRole.resources,
          permissions: userRole.permissions,
          accessControl: 'Properly implemented',
          security: {
            validated: true,
            bypassProtected: true,
            authorizationChecked: true
          }
        }

        // Save test result to database
        try {
          await prisma.accessControlTest.create({
            data: {
              resource: resource,
              userToken: userToken || 'anonymous',
              testMode: 'safe',
              accessGranted: hasAccess,
              bypassAttempted: false,
              bypassSuccessful: false,
              vulnerabilityType: null,
              userRole: user ? user.role : 'GUEST',
              ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
              userAgent: request.headers.get('user-agent') || 'unknown',
              result: JSON.stringify(result)
            }
          })
        } catch (dbError) {
          console.error('Failed to save access control test to database:', dbError)
        }

        return NextResponse.json(result)
      } catch (error: any) {
        return NextResponse.json({
          success: false,
          message: 'Database error',
          error: error.message
        }, { status: 500 })
      }
    }

    // Vulnerable mode - broken access control
    if (testMode === 'vulnerable') {
      const user = userToken ? await prisma.user.findFirst({
        where: {
          OR: [
            { email: userToken },
            { username: userToken }
          ]
        }
      }) : null
      
      const userRole = user ? userRoles[user.role] : userRoles['GUEST']
      
      // Simulate broken access control vulnerabilities
      let hasAccess = false
      let vulnerabilityType: string | null = null
      let bypassMethod: string | null = null

      // Check for bypass attempts
      if (bypassAttempt) {
        // Simulate various bypass techniques
        const bypassTechniques = [
          { method: 'URL Parameter Manipulation', pattern: /\?admin=true/i },
          { method: 'HTTP Method Override', pattern: /\?_method=PUT/i },
          { method: 'Path Traversal', pattern: /\.\.\//g },
          { method: 'Case Manipulation', pattern: /[A-Z]/g }
        ]

        for (const technique of bypassTechniques) {
          if (technique.pattern.test(resource)) {
            hasAccess = true
            vulnerabilityType = 'Broken Access Control'
            bypassMethod = technique.method
            break
          }
        }

        // Simulate IDOR (Insecure Direct Object Reference)
        if (resource.includes('/api/users/') && user && user.role !== 'ADMIN') {
          hasAccess = true
          vulnerabilityType = 'IDOR (Insecure Direct Object Reference)'
          bypassMethod = 'Direct API endpoint access'
        }
      }

      // Normal access check if no bypass
      if (!hasAccess) {
        hasAccess = userRole.resources.includes(resource) || resource.startsWith('/public')
      }

      if (hasAccess && (bypassAttempt || (user && user.role === 'GUEST' && resource.includes('/admin')))) {
        // Log to dashboard
        try {
          await fetch(`${request.nextUrl.origin}/api/dashboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              eventType: 'ACCESS_CONTROL_BYPASS',
              description: 'Access control bypass detected',
              payload: { resource, userToken, bypassMethod },
              severity: 'critical',
              blocked: false
            })
          })
        } catch (e) {
          console.error('Failed to log to dashboard:', e)
        }
        
        const result = {
          success: true,
          message: '🚨 ACCESS CONTROL BYPASSED! Unauthorized access granted!',
          vulnerability: vulnerabilityType || 'Broken Access Control',
          bypassMethod: bypassMethod || 'Insufficient authorization checks',
          impact: 'Unauthorized access to protected resources',
          user: user ? {
            id: user.id,
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role
          } : {
            username: 'anonymous',
            role: 'GUEST'
          },
          requestedResource: resource,
          shouldHaveAccess: userRole.resources.includes(resource),
          actualAccess: hasAccess,
          securityFlaw: {
            description: 'Access control checks can be bypassed',
            weakness: 'Insufficient server-side validation',
            exploitation: 'Bypass technique successful'
          },
          prevention: [
            'Always validate permissions on server-side',
            'Implement proper role-based access control (RBAC)',
            'Validate every request independently',
            'Use middleware for authorization',
            'Implement principle of least privilege',
            'Regular security testing and code review'
          ]
        }

        // Save bypass test result to database
        try {
          await prisma.accessControlTest.create({
            data: {
              resource: resource,
              userToken: userToken || 'anonymous',
              testMode: 'vulnerable',
              accessGranted: true,
              bypassAttempted: bypassAttempt,
              bypassSuccessful: true,
              vulnerabilityType: vulnerabilityType || 'Broken Access Control',
              userRole: user ? user.role : 'GUEST',
              ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
              userAgent: request.headers.get('user-agent') || 'unknown',
              result: JSON.stringify(result)
            }
          })
        } catch (dbError) {
          console.error('Failed to save access control test to database:', dbError)
        }

        return NextResponse.json(result)
      }

      const result = {
        success: hasAccess,
        message: hasAccess ? 'Access granted' : 'Access denied',
        user: user ? {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role
        } : {
          username: 'anonymous',
          role: 'GUEST'
        },
        requestedResource: resource,
        accessControl: 'Vulnerable mode',
        security: {
          validated: false,
          bypassProtected: false,
          authorizationChecked: false
        }
      }

      // Save normal vulnerable mode test result to database
      try {
        await prisma.accessControlTest.create({
          data: {
            resource: resource,
            userToken: userToken || 'anonymous',
            testMode: 'vulnerable',
            accessGranted: hasAccess,
            bypassAttempted: bypassAttempt,
            bypassSuccessful: false,
            vulnerabilityType: null,
            userRole: user ? user.role : 'GUEST',
            ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
            userAgent: request.headers.get('user-agent') || 'unknown',
            result: JSON.stringify(result)
          }
        })
      } catch (dbError) {
        console.error('Failed to save access control test to database:', dbError)
      }

      return NextResponse.json(result)
    }

    return NextResponse.json(
      { error: 'Invalid test mode' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Access control test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const allUsers = await prisma.user.findMany({
    select: { id: true, username: true, email: true, role: true }
  })
  
  return NextResponse.json({
    message: 'Access Control Testing API',
    users: allUsers,
    roles: userRoles,
    endpoints: {
      'POST /api/access-control': {
        description: 'Test access control vulnerability',
        parameters: {
          resource: 'string (required)',
          userToken: 'string (optional)',
          testMode: 'safe|vulnerable (default: safe)',
          bypassAttempt: 'boolean (default: false)'
        },
        examples: {
          safe: {
            resource: '/admin',
            userToken: 'guest-token-789',
            testMode: 'safe'
          },
          vulnerable: {
            resource: '/admin?admin=true',
            userToken: 'guest-token-789',
            testMode: 'vulnerable',
            bypassAttempt: true
          }
        }
      }
    },
    bypassTechniques: [
      'URL Parameter Manipulation',
      'HTTP Method Override',
      'Path Traversal',
      'Case Manipulation',
      'IDOR (Insecure Direct Object Reference)',
      'Missing Authorization Headers',
      'Race Conditions',
      'Token Manipulation'
    ],
    warning: 'This API is for educational purposes only. Do not use for malicious activities.'
  })
}