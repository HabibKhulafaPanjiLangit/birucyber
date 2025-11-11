import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all users
export async function GET(request: NextRequest) {
  try {
  const users = await db?.user.findMany({
    orderBy: { createdAt: 'desc' }
  }) ?? [];

  return NextResponse.json({
    success: true,
    count: users.length,
    users: users
  })
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch users',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// POST - Create new user with complete fields for testing
export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      name, 
      username,
      password = 'default123',
      role = 'USER',
      // XSS Testing Fields
      authorName,
      bio,
      // Access Control Testing Fields  
      accessToken,
      allowedResources,
      // Additional Fields
      avatar,
      phone,
      address
    } = await request.json()

    if (!email || !name) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Email and name are required' 
        },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email format' 
        },
        { status: 400 }
      )
    }

    // Check if user already exists
  const existingUser = await db?.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User with this email already exists' 
        },
        { status: 409 }
      )
    }

    // Generate username if not provided
    const finalUsername = username || email.split('@')[0]

    // Check if username is taken
  const existingUsername = await db?.user.findUnique({
      where: { username: finalUsername }
    })

    if (existingUsername) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Username already taken' 
        },
        { status: 409 }
      )
    }

    // Validate role
    const validRoles = ['USER', 'ADMIN', 'GUEST']
    const upperRole = role.toUpperCase()
    if (!validRoles.includes(upperRole)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid role. Must be USER, ADMIN, or GUEST' 
        },
        { status: 400 }
      )
    }

    // Generate access token if not provided
    const finalAccessToken = accessToken || `token_${finalUsername}_${Date.now()}`

    // Parse allowed resources (default based on role)
    let resourcesArray: string[] = []
    if (allowedResources) {
      resourcesArray = typeof allowedResources === 'string' 
        ? JSON.parse(allowedResources) 
        : allowedResources
    } else {
      // Default resources based on role
      switch (upperRole) {
        case 'ADMIN':
          resourcesArray = ['/public', '/home', '/profile', '/dashboard', '/admin', '/api/users', '/api/reports']
          break
        case 'USER':
          resourcesArray = ['/public', '/home', '/profile', '/dashboard']
          break
        case 'GUEST':
          resourcesArray = ['/public', '/home']
          break
      }
    }

    // Create user with all fields
  const newUser = await db?.user.create({
      data: {
        email,
        name,
        username: finalUsername,
        password,
        role: upperRole,
        // XSS Testing Fields
        authorName: authorName || name, // Default to name if not provided
        bio: bio || null,
        // Access Control Testing Fields
        accessToken: finalAccessToken,
        allowedResources: JSON.stringify(resourcesArray),
        // Additional Fields
        avatar: avatar || null,
        phone: phone || null,
        address: address || null
      } as any // Type assertion until Prisma client reloads
    })

    // Type assertion for response until Prisma types reload
    const userWithFields = newUser as any

    return NextResponse.json({
      success: true,
      message: '✅ User created successfully with complete testing fields!',
      user: newUser,
      details: {
        id: userWithFields.id,
        email: userWithFields.email,
        name: userWithFields.name,
        username: userWithFields.username,
        role: userWithFields.role,
        // Testing Fields
        authorName: userWithFields.authorName,
        bio: userWithFields.bio,
        accessToken: userWithFields.accessToken,
        allowedResources: JSON.parse(userWithFields.allowedResources || '[]'),
        // Additional
        avatar: userWithFields.avatar,
        phone: userWithFields.phone,
        address: userWithFields.address,
        createdAt: userWithFields.createdAt
      },
      testingInfo: {
        xssTesting: {
          field: 'authorName',
          value: userWithFields.authorName,
          usage: 'Use this as author in XSS comment testing'
        },
        accessControlTesting: {
          field: 'accessToken',
          value: userWithFields.accessToken,
          allowedResources: JSON.parse(userWithFields.allowedResources || '[]'),
          usage: 'Use this token in Access Control testing'
        }
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create user',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete user by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User ID is required' 
        },
        { status: 400 }
      )
    }

  const deletedUser = await db?.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({
      success: true,
      message: '🗑️ User deleted successfully!',
      deletedUser
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete user',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
