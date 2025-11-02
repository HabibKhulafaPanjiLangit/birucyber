import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    tests: [] as any[]
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

  return NextResponse.json({
    success: true,
    summary: {
      total: totalTests,
      passed: passedTests,
      failed: totalTests - passedTests,
      successRate: Math.round((passedTests / totalTests) * 100)
    },
    results
  })
}