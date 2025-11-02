// Test script to verify auto-save functionality
const baseUrl = 'http://localhost:3000'

async function testSqlInjection() {
  console.log('\n🧪 Testing SQL Injection Auto-Save...')
  
  const response = await fetch(`${baseUrl}/api/sql-injection`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: "admin' OR '1'='1' --",
      password: 'anything',
      testMode: 'vulnerable'
    })
  })
  
  const data = await response.json()
  console.log('✅ SQL Injection test completed:', data.success ? 'PASSED' : 'FAILED')
  console.log('   Attack detected:', data.attackType || 'None')
}

async function testXSS() {
  console.log('\n🧪 Testing XSS Auto-Save...')
  
  const response = await fetch(`${baseUrl}/api/xss`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      author: 'TestUser',
      comment: '<script>alert("XSS")</script>',
      testMode: 'vulnerable'
    })
  })
  
  const data = await response.json()
  console.log('✅ XSS test completed:', data.success ? 'PASSED' : 'FAILED')
  console.log('   Attack type:', data.xssType || 'None')
}

async function testAccessControl() {
  console.log('\n🧪 Testing Access Control Auto-Save...')
  
  const response = await fetch(`${baseUrl}/api/access-control`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resource: '/admin?admin=true',
      userToken: 'test@example.com',
      testMode: 'vulnerable',
      bypassAttempt: true
    })
  })
  
  const data = await response.json()
  console.log('✅ Access Control test completed:', data.success ? 'PASSED' : 'FAILED')
  console.log('   Bypass method:', data.bypassMethod || 'None')
}

async function checkDatabase() {
  console.log('\n📊 Checking database for saved records...')
  
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  
  try {
    const sqlTests = await prisma.sqlInjectionTest.count()
    const xssTests = await prisma.xssTest.count()
    const accessTests = await prisma.accessControlTest.count()
    
    console.log('\n📈 Database Records:')
    console.log(`   SQL Injection Tests: ${sqlTests}`)
    console.log(`   XSS Tests: ${xssTests}`)
    console.log(`   Access Control Tests: ${accessTests}`)
    console.log(`   Total: ${sqlTests + xssTests + accessTests}`)
    
    // Show latest records
    console.log('\n🔍 Latest SQL Injection Test:')
    const latestSql = await prisma.sqlInjectionTest.findFirst({
      orderBy: { createdAt: 'desc' }
    })
    if (latestSql) {
      console.log(`   Username: ${latestSql.username}`)
      console.log(`   Test Mode: ${latestSql.testMode}`)
      console.log(`   Success: ${latestSql.success}`)
      console.log(`   Attack Detected: ${latestSql.attackDetected}`)
      console.log(`   Attack Type: ${latestSql.attackType || 'None'}`)
      console.log(`   Severity: ${latestSql.severity}`)
      console.log(`   Created At: ${latestSql.createdAt.toLocaleString()}`)
    }
    
    console.log('\n🔍 Latest XSS Test:')
    const latestXss = await prisma.xssTest.findFirst({
      orderBy: { createdAt: 'desc' }
    })
    if (latestXss) {
      console.log(`   Author: ${latestXss.author}`)
      console.log(`   Test Mode: ${latestXss.testMode}`)
      console.log(`   Success: ${latestXss.success}`)
      console.log(`   Attack Detected: ${latestXss.attackDetected}`)
      console.log(`   XSS Type: ${latestXss.xssType || 'None'}`)
      console.log(`   Severity: ${latestXss.severity}`)
      console.log(`   Created At: ${latestXss.createdAt.toLocaleString()}`)
    }
    
    console.log('\n🔍 Latest Access Control Test:')
    const latestAccess = await prisma.accessControlTest.findFirst({
      orderBy: { createdAt: 'desc' }
    })
    if (latestAccess) {
      console.log(`   Resource: ${latestAccess.resource}`)
      console.log(`   User Token: ${latestAccess.userToken}`)
      console.log(`   Test Mode: ${latestAccess.testMode}`)
      console.log(`   Access Granted: ${latestAccess.accessGranted}`)
      console.log(`   Bypass Attempted: ${latestAccess.bypassAttempted}`)
      console.log(`   Bypass Successful: ${latestAccess.bypassSuccessful}`)
      console.log(`   Vulnerability Type: ${latestAccess.vulnerabilityType || 'None'}`)
      console.log(`   Created At: ${latestAccess.createdAt.toLocaleString()}`)
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

async function runTests() {
  console.log('🚀 Starting Auto-Save Tests...')
  console.log('=' .repeat(60))
  
  try {
    await testSqlInjection()
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await testXSS()
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await testAccessControl()
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    await checkDatabase()
    
    console.log('\n' + '='.repeat(60))
    console.log('✅ All tests completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

runTests()
