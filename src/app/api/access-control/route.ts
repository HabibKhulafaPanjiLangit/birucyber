import { NextRequest, NextResponse } from 'next/server'

// Simulated user roles and permissions
const userRoles = {
  guest: {
    permissions: ['read:public'],
    resources: ['/public', '/home']
  },
  user: {
    permissions: ['read:public', 'read:profile', 'update:profile'],
    resources: ['/public', '/home', '/profile', '/dashboard']
  },
  admin: {
    permissions: ['read:public', 'read:profile', 'update:profile', 'read:admin', 'write:admin', 'delete:admin', 'read:users'],
    resources: ['/public', '/home', '/profile', '/dashboard', '/admin', '/api/users', '/api/reports']
  }
}

// Simulated users
const users = [
  { id: 1, username: 'admin', role: 'admin', token: 'admin-token-123' },
  { id: 2, username: 'user1', role: 'user', token: 'user-token-456' },
  { id: 3, username: 'guest', role: 'guest', token: 'guest-token-789' }
]

export async function POST(request: NextRequest) {
  try {
    const { resource, userToken, testMode = 'safe', bypassAttempt = false } = await request.json()

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource is required' },
        { status: 400 }
      )
    }

    // Safe mode - proper access control
    if (testMode === 'safe') {
      const user = userToken ? users.find(u => u.token === userToken) || { id: 0, username: 'anonymous', role: 'guest', token: '' } : { id: 0, username: 'anonymous', role: 'guest', token: '' }
      const userRole = userRoles[user.role as keyof typeof userRoles]
      
      const hasAccess = userRole.resources.includes(resource) || resource.startsWith('/public')

      return NextResponse.json({
        success: hasAccess,
        message: hasAccess ? 'Access granted (safe mode)' : 'Access denied (safe mode)',
        user: {
          id: user.id,
          username: user.username,
          role: user.role
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
      })
    }

    // Vulnerable mode - broken access control
    if (testMode === 'vulnerable') {
      const user = userToken ? users.find(u => u.token === userToken) : { id: 0, username: 'anonymous', role: 'guest', token: '' }
      
      if (!user) {
        return NextResponse.json({ error: 'Invalid user token' }, { status: 400 })
      }
      
      const userRole = userRoles[user.role as keyof typeof userRoles]
      
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
        if (resource.includes('/api/users/') && user.role !== 'admin') {
          hasAccess = true
          vulnerabilityType = 'IDOR (Insecure Direct Object Reference)'
          bypassMethod = 'Direct API endpoint access'
        }
      }

      // Normal access check if no bypass
      if (!hasAccess) {
        hasAccess = userRole.resources.includes(resource) || resource.startsWith('/public')
      }

      if (hasAccess && (bypassAttempt || (user.role === 'guest' && resource.includes('/admin')))) {
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
        
        return NextResponse.json({
          success: true,
          message: '🚨 ACCESS CONTROL BYPASSED! Unauthorized access granted!',
          vulnerability: vulnerabilityType || 'Broken Access Control',
          bypassMethod: bypassMethod || 'Insufficient authorization checks',
          impact: 'Unauthorized access to protected resources',
          user: {
            id: user.id,
            username: user.username,
            role: user.role
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
        })
      }

      return NextResponse.json({
        success: hasAccess,
        message: hasAccess ? 'Access granted' : 'Access denied',
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        },
        requestedResource: resource,
        accessControl: 'Vulnerable mode',
        security: {
          validated: false,
          bypassProtected: false,
          authorizationChecked: false
        }
      })
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
  return NextResponse.json({
    message: 'Access Control Testing API',
    users: users.map(u => ({ id: u.id, username: u.username, role: u.role })),
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