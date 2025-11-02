import { NextRequest, NextResponse } from 'next/server'
import {
  SQL_INJECTION_PAYLOADS,
  XSS_PAYLOADS,
  ACCESS_CONTROL_PAYLOADS,
  CSRF_PAYLOADS,
  BRUTE_FORCE_PAYLOADS,
  SECURITY_HEADERS_TESTS,
  PAYLOAD_STATS,
  getRandomPayload,
  getAllPayloads
} from '@/lib/exploit-payloads'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // sql|xss|access|csrf|brute|headers
    const category = searchParams.get('category')
    const random = searchParams.get('random') === 'true'

    // Return statistics if no type specified
    if (!type) {
      return NextResponse.json({
        success: true,
        message: 'Advanced Exploit Payloads Library',
        statistics: PAYLOAD_STATS,
        totalPayloads: Object.values(PAYLOAD_STATS).reduce((acc, stat) => acc + stat.total, 0),
        availableTypes: ['sql', 'xss', 'access', 'csrf', 'brute', 'headers'],
        usage: {
          getAll: '/api/payloads?type=sql',
          getCategory: '/api/payloads?type=sql&category=authenticationBypass',
          getRandom: '/api/payloads?type=xss&random=true',
          listCategories: '/api/payloads?type=sql&list=true'
        }
      })
    }

    // List categories
    if (searchParams.get('list') === 'true') {
      let categories: string[] = []
      switch (type) {
        case 'sql':
          categories = Object.keys(SQL_INJECTION_PAYLOADS)
          break
        case 'xss':
          categories = Object.keys(XSS_PAYLOADS)
          break
        case 'access':
          categories = Object.keys(ACCESS_CONTROL_PAYLOADS)
          break
        case 'csrf':
          categories = Object.keys(CSRF_PAYLOADS)
          break
        case 'brute':
          categories = Object.keys(BRUTE_FORCE_PAYLOADS)
          break
        case 'headers':
          categories = Object.keys(SECURITY_HEADERS_TESTS)
          break
      }

      return NextResponse.json({
        success: true,
        type,
        categories,
        count: categories.length
      })
    }

    // Get random payload
    if (random) {
      let payload: string
      switch (type) {
        case 'sql':
          payload = getRandomPayload('authenticationBypass')
          break
        case 'xss':
          payload = getRandomPayload('basic')
          break
        default:
          return NextResponse.json({ error: 'Random not supported for this type' }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        type,
        payload,
        note: 'Random payload from all categories'
      })
    }

    // Get specific category or all payloads
    let payloads: any
    switch (type) {
      case 'sql':
        payloads = category && SQL_INJECTION_PAYLOADS[category as keyof typeof SQL_INJECTION_PAYLOADS]
          ? SQL_INJECTION_PAYLOADS[category as keyof typeof SQL_INJECTION_PAYLOADS]
          : SQL_INJECTION_PAYLOADS
        break
      case 'xss':
        payloads = category && XSS_PAYLOADS[category as keyof typeof XSS_PAYLOADS]
          ? XSS_PAYLOADS[category as keyof typeof XSS_PAYLOADS]
          : XSS_PAYLOADS
        break
      case 'access':
        payloads = category && ACCESS_CONTROL_PAYLOADS[category as keyof typeof ACCESS_CONTROL_PAYLOADS]
          ? ACCESS_CONTROL_PAYLOADS[category as keyof typeof ACCESS_CONTROL_PAYLOADS]
          : ACCESS_CONTROL_PAYLOADS
        break
      case 'csrf':
        payloads = category && CSRF_PAYLOADS[category as keyof typeof CSRF_PAYLOADS]
          ? CSRF_PAYLOADS[category as keyof typeof CSRF_PAYLOADS]
          : CSRF_PAYLOADS
        break
      case 'brute':
        payloads = category && BRUTE_FORCE_PAYLOADS[category as keyof typeof BRUTE_FORCE_PAYLOADS]
          ? BRUTE_FORCE_PAYLOADS[category as keyof typeof BRUTE_FORCE_PAYLOADS]
          : BRUTE_FORCE_PAYLOADS
        break
      case 'headers':
        payloads = category && SECURITY_HEADERS_TESTS[category as keyof typeof SECURITY_HEADERS_TESTS]
          ? SECURITY_HEADERS_TESTS[category as keyof typeof SECURITY_HEADERS_TESTS]
          : SECURITY_HEADERS_TESTS
        break
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const count = Array.isArray(payloads) ? payloads.length : Object.values(payloads).flat().length

    return NextResponse.json({
      success: true,
      type,
      category: category || 'all',
      payloads,
      count,
      warning: '⚠️ These payloads are for educational and authorized security testing only. Unauthorized use is illegal.'
    })

  } catch (error) {
    console.error('Payloads API error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve payloads' },
      { status: 500 }
    )
  }
}

// Test payload endpoint
export async function POST(request: NextRequest) {
  try {
    const { type, payload, target } = await request.json()

    if (!type || !payload) {
      return NextResponse.json({ error: 'Type and payload required' }, { status: 400 })
    }

    // Simulate payload testing
    const testResult = {
      success: true,
      type,
      payload,
      target: target || 'test-environment',
      timestamp: new Date().toISOString(),
      results: {
        executed: true,
        detected: Math.random() > 0.5,
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
        impact: 'Test completed successfully',
        recommendation: 'Review and patch vulnerability'
      },
      note: 'This is a simulated test. In production, use actual testing modules.'
    }

    return NextResponse.json(testResult)

  } catch (error) {
    console.error('Payload test error:', error)
    return NextResponse.json(
      { error: 'Failed to test payload' },
      { status: 500 }
    )
  }
}
