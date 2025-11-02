import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    totalModules: 6,
    modulesAvailable: ['SQL Injection', 'XSS', 'Access Control', 'CSRF', 'Security Headers', 'Rate Limiting'],
    tests: [] as any[],
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      successRate: 0
    }
  }

  // Test 1: SQL Injection API
  try {
    const sqlResponse = await fetch('http://localhost:3000/api/sql-injection')
    const sqlData = await sqlResponse.json()
    results.tests.push({
      name: 'SQL Injection API',
      status: sqlResponse.ok ? 'PASS' : 'FAIL',
      details: sqlData
    })

    // Test SQL Injection Safe Mode
    const sqlSafeResponse = await fetch('http://localhost:3000/api/sql-injection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123',
        testMode: 'safe'
      })
    })
    const sqlSafeData = await sqlSafeResponse.json()
    results.tests.push({
      name: 'SQL Injection Safe Mode',
      status: sqlSafeResponse.ok ? 'PASS' : 'FAIL',
      details: sqlSafeData
    })

    // Test SQL Injection Vulnerable Mode
    const sqlVulnResponse = await fetch('http://localhost:3000/api/sql-injection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: "' OR '1'='1' --",
        password: 'anything',
        testMode: 'vulnerable'
      })
    })
    const sqlVulnData = await sqlVulnResponse.json()
    results.tests.push({
      name: 'SQL Injection Vulnerable Mode',
      status: sqlVulnResponse.ok ? 'PASS' : 'FAIL',
      details: sqlVulnData
    })
  } catch (error) {
    results.tests.push({
      name: 'SQL Injection API',
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Test 2: XSS API
  try {
    const xssResponse = await fetch('http://localhost:3000/api/xss')
    const xssData = await xssResponse.json()
    results.tests.push({
      name: 'XSS API',
      status: xssResponse.ok ? 'PASS' : 'FAIL',
      details: xssData
    })

    // Test XSS Safe Mode
    const xssSafeResponse = await fetch('http://localhost:3000/api/xss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comment: 'Hello world',
        author: 'user',
        testMode: 'safe'
      })
    })
    const xssSafeData = await xssSafeResponse.json()
    results.tests.push({
      name: 'XSS Safe Mode',
      status: xssSafeResponse.ok ? 'PASS' : 'FAIL',
      details: xssSafeData
    })

    // Test XSS Vulnerable Mode
    const xssVulnResponse = await fetch('http://localhost:3000/api/xss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comment: '<script>alert("XSS")</script>',
        author: 'attacker',
        testMode: 'vulnerable'
      })
    })
    const xssVulnData = await xssVulnResponse.json()
    results.tests.push({
      name: 'XSS Vulnerable Mode',
      status: xssVulnResponse.ok ? 'PASS' : 'FAIL',
      details: xssVulnData
    })
  } catch (error) {
    results.tests.push({
      name: 'XSS API',
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Test 3: Access Control API
  try {
    const accessResponse = await fetch('http://localhost:3000/api/access-control')
    const accessData = await accessResponse.json()
    results.tests.push({
      name: 'Access Control API',
      status: accessResponse.ok ? 'PASS' : 'FAIL',
      details: accessData
    })

    // Test Access Control Safe Mode
    const accessSafeResponse = await fetch('http://localhost:3000/api/access-control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resource: '/admin',
        userToken: 'guest-token-789',
        testMode: 'safe'
      })
    })
    const accessSafeData = await accessSafeResponse.json()
    results.tests.push({
      name: 'Access Control Safe Mode',
      status: accessSafeResponse.ok ? 'PASS' : 'FAIL',
      details: accessSafeData
    })

    // Test Access Control Bypass
    const accessBypassResponse = await fetch('http://localhost:3000/api/access-control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resource: '/admin',
        userToken: 'guest-token-789',
        testMode: 'vulnerable',
        bypassAttempt: true
      })
    })
    const accessBypassData = await accessBypassResponse.json()
    results.tests.push({
      name: 'Access Control Bypass',
      status: accessBypassResponse.ok ? 'PASS' : 'FAIL',
      details: accessBypassData
    })
  } catch (error) {
    results.tests.push({
      name: 'Access Control API',
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Test 4: Other APIs
  try {
    const dashboardResponse = await fetch('http://localhost:3000/api/dashboard')
    const dashboardData = await dashboardResponse.json()
    results.tests.push({
      name: 'Dashboard API',
      status: dashboardResponse.ok ? 'PASS' : 'FAIL',
      details: dashboardData
    })
  } catch (error) {
    results.tests.push({
      name: 'Dashboard API',
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Test 4: CSRF Protection API
  try {
    const csrfResponse = await fetch('http://localhost:3000/api/csrf')
    const csrfData = await csrfResponse.json()
    results.tests.push({
      name: 'CSRF Protection API',
      status: csrfResponse.ok ? 'PASS' : 'FAIL',
      details: csrfData
    })

    // Test CSRF Vulnerable Mode
    const csrfVulnResponse = await fetch('http://localhost:3000/api/csrf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'transfer',
        amount: 1000,
        recipient: 'attacker',
        sessionToken: 'session-admin-abc123',
        testMode: 'vulnerable'
      })
    })
    const csrfVulnData = await csrfVulnResponse.json()
    results.tests.push({
      name: 'CSRF Vulnerable Mode',
      status: csrfVulnResponse.ok ? 'PASS' : 'FAIL',
      details: csrfVulnData
    })
  } catch (error) {
    results.tests.push({
      name: 'CSRF Protection API',
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Test 5: Security Headers API
  try {
    const headersResponse = await fetch('http://localhost:3000/api/security-headers')
    const headersData = await headersResponse.json()
    results.tests.push({
      name: 'Security Headers API',
      status: headersResponse.ok ? 'PASS' : 'FAIL',
      details: headersData
    })

    // Test Security Headers Vulnerable Mode
    const headersVulnResponse = await fetch('http://localhost:3000/api/security-headers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        testMode: 'vulnerable'
      })
    })
    const headersVulnData = await headersVulnResponse.json()
    results.tests.push({
      name: 'Security Headers Scan',
      status: headersVulnResponse.ok || headersVulnResponse.status === 400 ? 'PASS' : 'FAIL',
      details: headersVulnData
    })
  } catch (error) {
    results.tests.push({
      name: 'Security Headers API',
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Test 6: Rate Limiting API
  try {
    const rateLimitResponse = await fetch('http://localhost:3000/api/rate-limiting')
    const rateLimitData = await rateLimitResponse.json()
    results.tests.push({
      name: 'Rate Limiting API',
      status: rateLimitResponse.ok ? 'PASS' : 'FAIL',
      details: rateLimitData
    })

    // Test Brute Force Detection
    const bruteForceResponse = await fetch('http://localhost:3000/api/rate-limiting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        username: 'admin',
        password: 'wrong',
        testMode: 'vulnerable'
      })
    })
    const bruteForceData = await bruteForceResponse.json()
    results.tests.push({
      name: 'Brute Force Detection',
      status: bruteForceResponse.ok || bruteForceResponse.status === 401 ? 'PASS' : 'FAIL',
      details: bruteForceData
    })
  } catch (error) {
    results.tests.push({
      name: 'Rate Limiting API',
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  try {
    const modulesResponse = await fetch('http://localhost:3000/api/modules')
    const modulesData = await modulesResponse.json()
    results.tests.push({
      name: 'Modules API',
      status: modulesResponse.ok ? 'PASS' : 'FAIL',
      details: { modulesCount: modulesData.data?.length || 0 }
    })
  } catch (error) {
    results.tests.push({
      name: 'Modules API',
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  try {
    const dbResponse = await fetch('http://localhost:3000/api/test-db')
    const dbData = await dbResponse.json()
    results.tests.push({
      name: 'Database Connection',
      status: dbResponse.ok ? 'PASS' : 'FAIL',
      details: dbData
    })
  } catch (error) {
    results.tests.push({
      name: 'Database Connection',
      status: 'FAIL',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  const passedTests = results.tests.filter(test => test.status === 'PASS').length
  const totalTests = results.tests.length

  results.summary = {
    total: totalTests,
    passed: passedTests,
    failed: totalTests - passedTests,
    successRate: Math.round((passedTests / totalTests) * 100)
  }

  return NextResponse.json({
    success: true,
    ...results
  })
}