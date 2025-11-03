import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Fetch scan history with pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const targetUrl = searchParams.get('targetUrl')
    const status = searchParams.get('status')
    const severity = searchParams.get('severity')
    
    const skip = (page - 1) * limit
    
    // Build where clause
    const where: any = {}
    
    if (targetUrl) {
      where.targetUrl = { contains: targetUrl, mode: 'insensitive' }
    }
    
    if (status) {
      where.status = status
    }
    
    if (severity) {
      where.severity = severity
    }
    
    // Get scans with pagination
    const [scans, total] = await Promise.all([
      prisma.websiteScan.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          targetUrl: true,
          scanType: true,
          status: true,
          securityScore: true,
          severity: true,
          scanDuration: true,
          totalChecks: true,
          passedChecks: true,
          failedChecks: true,
          sqlInjection: true,
          xssVulnerable: true,
          brokenAccessControl: true,
          createdAt: true,
          completedAt: true,
        }
      }),
      prisma.websiteScan.count({ where })
    ])
    
    return NextResponse.json({
      success: true,
      data: scans,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + limit < total
      }
    })
    
  } catch (error) {
    console.error('Error fetching scan history:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch scan history',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete scans
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const scanId = searchParams.get('id')
    const olderThan = searchParams.get('olderThan') // days
    const status = searchParams.get('status') // e.g., 'completed', 'failed'
    
    if (scanId) {
      // Delete specific scan
      await prisma.websiteScan.delete({
        where: { id: scanId }
      })
      
      return NextResponse.json({ 
        success: true, 
        message: 'Scan deleted successfully' 
      })
    }
    
    if (olderThan) {
      // Delete scans older than X days
      const date = new Date()
      date.setDate(date.getDate() - parseInt(olderThan))
      
      const where: any = {
        createdAt: { lt: date }
      }
      
      // Optionally filter by status
      if (status) {
        where.status = status
      }
      
      const result = await prisma.websiteScan.deleteMany({ where })
      
      return NextResponse.json({ 
        success: true, 
        message: `Deleted ${result.count} scans`,
        count: result.count
      })
    }
    
    return NextResponse.json(
      { success: false, error: 'Missing parameter: id or olderThan' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Error deleting scans:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete scans',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
