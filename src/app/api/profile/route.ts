import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id') || '1' // Default user for demo

    // Get user profile
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        posts: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get user's security logs
    const securityLogs = await db.securityLog.findMany({
      where: { description: { contains: user.username || user.email } },
      orderBy: { timestamp: 'desc' },
      take: 10
    })

    // Calculate progress metrics
    const progress = await calculateUserProgress(userId)

    return NextResponse.json({
      success: true,
      data: {
        profile: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
          lastLogin: new Date() // Simulated last login
        },
        activity: {
          postsCount: user.posts.length,
          commentsCount: user.comments.length,
          recentPosts: user.posts,
          recentComments: user.comments,
          securityEvents: securityLogs.length
        },
        progress,
        achievements: await getUserAchievements(userId)
      }
    })

  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, name, email, preferences } = await request.json()

    // Update user profile
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email })
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

async function calculateUserProgress(userId: string) {
  // Simulate progress calculation based on completed modules
  const moduleProgress = [
    { moduleId: 'sql-injection', completed: true, score: 85, completedAt: new Date('2024-01-15') },
    { moduleId: 'xss', completed: true, score: 92, completedAt: new Date('2024-01-16') },
    { moduleId: 'access-control', completed: false, score: 0, completedAt: null }
  ]

  const totalModules = moduleProgress.length
  const completedModules = moduleProgress.filter(m => m.completed).length
  const averageScore = moduleProgress
    .filter(m => m.completed)
    .reduce((sum, m) => sum + m.score, 0) / completedModules || 0

  return {
    totalModules,
    completedModules,
    inProgressModules: totalModules - completedModules,
    completionPercentage: (completedModules / totalModules) * 100,
    averageScore: Math.round(averageScore),
    moduleProgress,
    learningStreak: 5, // Simulated learning streak
    totalTimeSpent: 135 // minutes
  }
}

async function getUserAchievements(userId: string) {
  // Simulate achievements system
  const achievements = [
    {
      id: 'first-module',
      title: 'First Steps',
      description: 'Complete your first security module',
      icon: '🎯',
      unlocked: true,
      unlockedAt: new Date('2024-01-15')
    },
    {
      id: 'sql-master',
      title: 'SQL Injection Master',
      description: 'Score 80% or higher in SQL Injection module',
      icon: '🛡️',
      unlocked: true,
      unlockedAt: new Date('2024-01-15')
    },
    {
      id: 'xss-expert',
      title: 'XSS Expert',
      description: 'Complete XSS module with 90% score',
      icon: '🔒',
      unlocked: true,
      unlockedAt: new Date('2024-01-16')
    },
    {
      id: 'security-ninja',
      title: 'Security Ninja',
      description: 'Complete all security modules',
      icon: '🥷',
      unlocked: false,
      unlockedAt: null
    },
    {
      id: 'week-streak',
      title: 'Week Warrior',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      unlocked: false,
      unlockedAt: null
    }
  ]

  return achievements
}