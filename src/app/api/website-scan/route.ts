import { NextRequest, NextResponse } from 'next/server'
import { prisma, isDatabaseAvailable } from '@/lib/db'

// Security Headers to check
const SECURITY_HEADERS = [
  'Content-Security-Policy',
  'X-Frame-Options',
  'X-Content-Type-Options',
  'Strict-Transport-Security',
  'X-XSS-Protection',
  'Referrer-Policy',
  'Permissions-Policy'
]

// Advanced SQL Injection test payloads - MAKSIMAL
const SQL_PAYLOADS = [
  "' OR '1'='1",
  "admin'--",
  "' OR 1=1--",
  "1' UNION SELECT NULL--",
  "1' AND 1=0 UNION ALL SELECT 'admin', '81dc9bdb52d04dc20036dbd8313ed055'",
  "admin' or '1'='1'/*",
  "' or 1=1--",
  "' union select null, null, null--",
  "1' WAITFOR DELAY '0:0:5'--",
  "1' AND SLEEP(5)--",
  "'; DROP TABLE users--",
  "' OR EXISTS(SELECT * FROM users)--",
  "1' ORDER BY 1--",
  "1' ORDER BY 2--",
  "1' ORDER BY 3--",
  "' HAVING 1=1--",
  "' GROUP BY columnnames HAVING 1=1--",
  "admin' AND 1=0 UNION ALL SELECT NULL, NULL, NULL--",
  "' UNION SELECT user, password FROM users--",
  "1' AND extractvalue(1,concat(0x7e,version()))--",
  "' AND (SELECT * FROM (SELECT(SLEEP(5)))a)--",
  "'; EXEC xp_cmdshell('dir')--",
  "' UNION SELECT NULL, table_name FROM information_schema.tables--",
  "' AND 1=2 UNION SELECT NULL, column_name FROM information_schema.columns--",
  "admin' OR '1'='1' #",
  "1' AND CHAR(124)+CHAR(124)+1--",
  "' OR 'x'='x",
  "') OR ('1'='1",
  "' OR username LIKE '%",
  "' AND password LIKE '%",
  "1' UNION ALL SELECT NULL,NULL,NULL,NULL,NULL,NULL,NULL--"
]

// Advanced XSS test payloads - MAKSIMAL
const XSS_PAYLOADS = [
  "<script>alert('XSS')</script>",
  "<img src=x onerror=alert(1)>",
  "<svg/onload=alert(1)>",
  "<iframe src=javascript:alert(1)>",
  "<body onload=alert(1)>",
  "<input onfocus=alert(1) autofocus>",
  "<marquee onstart=alert(1)>",
  "<details open ontoggle=alert(1)>",
  "javascript:alert(1)",
  "<script>alert(String.fromCharCode(88,83,83))</script>",
  "\"><script>alert(1)</script>",
  "';alert(String.fromCharCode(88,83,83))//",
  "<img src=x:alert(1) onerror=eval(src)>",
  "<svg><script>alert(1)</script></svg>",
  "<img src=x onerror=prompt(1)>",
  "<img src=x onerror=confirm(1)>",
  "<img src=x onerror=javascript:alert(1)>",
  "<svg onload=alert(document.domain)>",
  "<iframe srcdoc='<script>alert(1)</script>'>",
  "<object data='javascript:alert(1)'>",
  "<embed src='javascript:alert(1)'>",
  "<form action='javascript:alert(1)'><input type=submit>",
  "<input type='text' value='' onfocus='alert(1)' autofocus>",
  "<select onfocus=alert(1) autofocus><option>",
  "<textarea onfocus=alert(1) autofocus>",
  "<keygen onfocus=alert(1) autofocus>",
  "<video><source onerror=alert(1)>",
  "<audio src=x onerror=alert(1)>",
  "<style>@import'javascript:alert(1)';</style>",
  "<link rel=stylesheet href='javascript:alert(1)'>",
  "<base href='javascript:alert(1)//'>",
  "<isindex type=submit value=click onfocus=alert(1)>",
  "'-alert(1)-'",
  "\"-alert(1)-\"",
  "</script><script>alert(1)</script>",
  "<img src=x:alert(1) onerror=eval(src) />",
  "<svg><animate onbegin=alert(1) attributeName=x dur=1s>"
]

// Path Traversal payloads
const PATH_TRAVERSAL_PAYLOADS = [
  "../../../etc/passwd",
  "..\\..\\..\\windows\\system32\\config\\sam",
  "....//....//....//etc/passwd",
  "..%2F..%2F..%2Fetc%2Fpasswd",
  "..%5c..%5c..%5cwindows%5csystem32%5cconfig%5csam"
]

// Command Injection payloads
const COMMAND_INJECTION_PAYLOADS = [
  "; ls -la",
  "| whoami",
  "& dir",
  "; cat /etc/passwd",
  "| cat /etc/passwd",
  "`whoami`",
  "$(whoami)",
  "; ping -c 10 127.0.0.1"
]

// Common vulnerable files/endpoints
const VULNERABLE_FILES = [
  ".git/config",
  ".env",
  ".env.local",
  ".env.production",
  "config.php",
  "configuration.php",
  "wp-config.php",
  "database.yml",
  ".htaccess",
  "phpinfo.php",
  "info.php",
  "test.php",
  "backup.sql",
  "dump.sql",
  "server-status",
  "server-info",
  ".DS_Store",
  "web.config",
  "composer.json",
  "package.json",
  ".npmrc",
  ".dockerenv"
]

// File Upload dangerous extensions
const DANGEROUS_FILE_EXTENSIONS = [
  '.php', '.php3', '.php4', '.php5', '.phtml',
  '.asp', '.aspx', '.jsp', '.jspx',
  '.exe', '.bat', '.cmd', '.sh',
  '.py', '.rb', '.pl',
  '.svg', '.xml',
  '.html', '.htm'
]

// Access Control test endpoints
const ACCESS_CONTROL_ENDPOINTS = [
  '/admin',
  '/admin/dashboard',
  '/admin/users',
  '/administrator',
  '/dashboard',
  '/user/profile',
  '/api/admin',
  '/api/users',
  '/api/user/1',
  '/api/user/2',
  '/.git/config',
  '/backup',
  '/config',
  '/wp-admin',
  '/phpmyadmin',
  '/adminer.php'
]

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { targetUrl, scanType = 'quick' } = await request.json()

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'Target URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    let url: URL
    try {
      url = new URL(targetUrl)
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Invalid protocol')
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format. Use http:// or https://' },
        { status: 400 }
      )
    }

    // Check if database is available
    if (!isDatabaseAvailable() || !prisma) {
      return NextResponse.json(
        { 
          error: 'Database not configured',
          message: 'DATABASE_URL environment variable is not set. Please setup PostgreSQL database in Railway.',
          instructions: 'Follow the guide: QUICK-START-DATABASE.md',
          setupSteps: [
            '1. Railway Dashboard → Add PostgreSQL',
            '2. Copy DATABASE_URL from PostgreSQL service',
            '3. Add DATABASE_URL to BiruCyber service variables',
            '4. Wait for auto-redeploy (~3 minutes)'
          ]
        },
        { status: 503 }
      )
    }

    // Create scan record in database
    const scan = await prisma.websiteScan.create({
      data: {
        targetUrl: url.toString(),
        scanType,
        status: 'scanning',
        scannerIp: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'BiruCyber Scanner'
      }
    })

    // Start scanning (async)
    performScan(scan.id, url, scanType).catch(console.error)

    return NextResponse.json({
      success: true,
      message: 'Scan initiated',
      scanId: scan.id,
      targetUrl: url.toString(),
      estimatedTime: scanType === 'full' ? '2-5 minutes' : '30-60 seconds'
    })

  } catch (error: any) {
    console.error('Website scan error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate scan: ' + error.message },
      { status: 500 }
    )
  }
}

// Removed in-memory storage - now uses database only

// Advanced technology detection
function detectTechnologies(html: string, headers: any): string[] {
  const technologies: string[] = []
  const htmlLower = html.toLowerCase()
  
  // Server detection
  if (headers.server) technologies.push(`Server: ${headers.server}`)
  if (headers['x-powered-by']) technologies.push(`Powered-By: ${headers['x-powered-by']}`)
  
  // Framework detection
  if (htmlLower.includes('wp-content') || htmlLower.includes('wordpress')) technologies.push('WordPress')
  if (htmlLower.includes('drupal')) technologies.push('Drupal')
  if (htmlLower.includes('joomla')) technologies.push('Joomla')
  if (htmlLower.includes('laravel')) technologies.push('Laravel')
  if (htmlLower.includes('next.js') || htmlLower.includes('_next/')) technologies.push('Next.js')
  if (htmlLower.includes('react')) technologies.push('React')
  if (htmlLower.includes('vue.js') || htmlLower.includes('vue')) technologies.push('Vue.js')
  if (htmlLower.includes('angular')) technologies.push('Angular')
  if (htmlLower.includes('django')) technologies.push('Django')
  if (htmlLower.includes('flask')) technologies.push('Flask')
  if (htmlLower.includes('rails') || htmlLower.includes('ruby')) technologies.push('Ruby on Rails')
  
  // CMS detection
  if (htmlLower.includes('shopify')) technologies.push('Shopify')
  if (htmlLower.includes('wix.com')) technologies.push('Wix')
  if (htmlLower.includes('squarespace')) technologies.push('Squarespace')
  if (htmlLower.includes('magento')) technologies.push('Magento')
  if (htmlLower.includes('prestashop')) technologies.push('PrestaShop')
  
  // JavaScript libraries
  if (htmlLower.includes('jquery')) technologies.push('jQuery')
  if (htmlLower.includes('bootstrap')) technologies.push('Bootstrap')
  if (htmlLower.includes('tailwind')) technologies.push('Tailwind CSS')
  if (htmlLower.includes('material-ui')) technologies.push('Material-UI')
  
  // Analytics & Tracking
  if (htmlLower.includes('google-analytics') || htmlLower.includes('gtag')) technologies.push('Google Analytics')
  if (htmlLower.includes('facebook.com/tr')) technologies.push('Facebook Pixel')
  if (htmlLower.includes('hotjar')) technologies.push('Hotjar')
  
  // CDN detection
  if (htmlLower.includes('cloudflare')) technologies.push('Cloudflare CDN')
  if (htmlLower.includes('akamai')) technologies.push('Akamai CDN')
  if (htmlLower.includes('fastly')) technologies.push('Fastly CDN')
  
  return [...new Set(technologies)] // Remove duplicates
}

// Check for exposed sensitive files
async function checkSensitiveFiles(baseUrl: URL): Promise<any[]> {
  const findings: any[] = []
  
  for (const file of VULNERABLE_FILES.slice(0, 10)) { // Check first 10 to save time
    try {
      const testUrl = new URL(file, baseUrl.toString())
      const response = await fetch(testUrl.toString(), {
        method: 'HEAD',
        signal: AbortSignal.timeout(3000)
      })
      
      if (response.status === 200) {
        findings.push({
          type: 'Exposed Sensitive File',
          severity: 'high',
          description: `Sensitive file accessible: ${file}`,
          recommendation: `Restrict access to ${file} or remove it from public directory`,
          url: testUrl.toString()
        })
      }
    } catch {
      // File not accessible, which is good
    }
  }
  
  return findings
}

// MAKSIMAL: Test SQL Injection vulnerability
async function testSQLInjection(baseUrl: URL, html: string): Promise<any[]> {
  const findings: any[] = []
  
  // 1. Check for SQL error messages in response
  const sqlErrors = [
    'sql syntax', 'mysql', 'mysqli', 'pg_query', 'sqlite', 'odbc',
    'you have an error in your sql syntax',
    'warning: mysql',
    'unclosed quotation mark',
    'quoted string not properly terminated',
    'ora-01756',
    'sqlstate',
    'syntax error or access violation',
    'postgresql query failed',
    'unterminated string literal'
  ]
  
  const htmlLower = html.toLowerCase()
  for (const error of sqlErrors) {
    if (htmlLower.includes(error)) {
      findings.push({
        type: 'SQL Injection - Error Disclosure',
        severity: 'critical',
        description: `SQL error message detected: "${error}"`,
        recommendation: 'Disable detailed error messages in production and use parameterized queries',
        evidence: error
      })
      break
    }
  }
  
  // 2. Test GET parameters with SQL payloads
  const urlParams = new URLSearchParams(baseUrl.search)
  if (urlParams.toString()) {
    for (const [key, value] of urlParams.entries()) {
      // Test with a simple SQL payload
      try {
        const testUrl = new URL(baseUrl.toString())
        testUrl.searchParams.set(key, "' OR '1'='1")
        
        const response = await fetch(testUrl.toString(), {
          signal: AbortSignal.timeout(5000)
        })
        
        const testHtml = await response.text()
        const testHtmlLower = testHtml.toLowerCase()
        
        // Check if SQL errors appear after injection
        for (const error of sqlErrors) {
          if (testHtmlLower.includes(error)) {
            findings.push({
              type: 'SQL Injection Vulnerability',
              severity: 'critical',
              description: `Parameter "${key}" is vulnerable to SQL injection`,
              recommendation: 'Use parameterized queries/prepared statements to prevent SQL injection',
              evidence: `Payload: ' OR '1'='1 triggered SQL error`,
              url: testUrl.toString()
            })
            break
          }
        }
        
        // Check for unusual response patterns
        if (testHtml.length > html.length * 1.5 || testHtml.length < html.length * 0.5) {
          findings.push({
            type: 'Potential SQL Injection',
            severity: 'high',
            description: `Parameter "${key}" shows abnormal behavior with SQL payloads`,
            recommendation: 'Review input validation and use prepared statements',
            evidence: 'Response size changed significantly with SQL payload'
          })
        }
      } catch {
        // Error during test
      }
    }
  }
  
  return findings
}

// MAKSIMAL: Test XSS vulnerability
async function testXSS(baseUrl: URL, html: string): Promise<any[]> {
  const findings: any[] = []
  
  // 1. Check for reflected input without sanitization
  const urlParams = new URLSearchParams(baseUrl.search)
  
  // 2. Find forms in HTML
  const formRegex = /<form[^>]*>([\s\S]*?)<\/form>/gi
  const forms = html.match(formRegex) || []
  
  if (forms.length > 0) {
    findings.push({
      type: 'Forms Detected - Potential XSS Target',
      severity: 'medium',
      description: `Found ${forms.length} form(s) that could be vulnerable to XSS`,
      recommendation: 'Implement input sanitization and output encoding',
      evidence: `${forms.length} forms found`
    })
  }
  
  // 3. Check for dangerous HTML patterns
  const dangerousPatterns = [
    'eval\\(',
    'innerHTML',
    'document\\.write',
    'document\\.writeln',
    'dangerouslySetInnerHTML',
    '\\.html\\(',
    'v-html',
    'onclick=',
    'onerror=',
    'onload='
  ]
  
  for (const pattern of dangerousPatterns) {
    const regex = new RegExp(pattern, 'gi')
    if (regex.test(html)) {
      findings.push({
        type: 'XSS Risk - Dangerous Pattern',
        severity: 'high',
        description: `Found dangerous pattern: ${pattern}`,
        recommendation: 'Avoid using dangerous JavaScript patterns, use safe DOM manipulation',
        evidence: pattern
      })
    }
  }
  
  // 4. Test GET parameters with XSS payloads
  if (urlParams.toString()) {
    for (const [key, value] of urlParams.entries()) {
      try {
        const testPayload = "<script>alert('XSS')</script>"
        const testUrl = new URL(baseUrl.toString())
        testUrl.searchParams.set(key, testPayload)
        
        const response = await fetch(testUrl.toString(), {
          signal: AbortSignal.timeout(5000)
        })
        
        const testHtml = await response.text()
        
        // Check if payload is reflected without encoding
        if (testHtml.includes(testPayload)) {
          findings.push({
            type: 'Reflected XSS Vulnerability',
            severity: 'critical',
            description: `Parameter "${key}" is vulnerable to reflected XSS`,
            recommendation: 'Sanitize and encode all user input before rendering',
            evidence: 'XSS payload reflected without encoding',
            url: testUrl.toString()
          })
        } else if (testHtml.includes('alert') || testHtml.includes('<script')) {
          findings.push({
            type: 'Potential XSS Vulnerability',
            severity: 'high',
            description: `Parameter "${key}" may be vulnerable to XSS (partial reflection)`,
            recommendation: 'Implement proper input validation and output encoding',
            evidence: 'Partial XSS payload detected in response'
          })
        }
      } catch {
        // Error during test
      }
    }
  }
  
  // 5. Check Content-Type header
  return findings
}

// MAKSIMAL: Test File Upload vulnerability
async function testFileUpload(baseUrl: URL, html: string): Promise<any[]> {
  const findings: any[] = []
  
  // 1. Find file upload forms
  const fileInputRegex = /<input[^>]*type\s*=\s*["']?file["']?[^>]*>/gi
  const fileInputs = html.match(fileInputRegex) || []
  
  if (fileInputs.length > 0) {
    findings.push({
      type: 'File Upload Detected',
      severity: 'medium',
      description: `Found ${fileInputs.length} file upload form(s)`,
      recommendation: 'Implement strict file type validation, file size limits, and secure file storage',
      evidence: `${fileInputs.length} file input fields found`
    })
    
    // 2. Check if upload form has validation
    const hasAcceptAttribute = fileInputs.some(input => input.includes('accept='))
    if (!hasAcceptAttribute) {
      findings.push({
        type: 'Unrestricted File Upload Risk',
        severity: 'high',
        description: 'File upload form without client-side validation detected',
        recommendation: 'Add "accept" attribute and implement server-side validation for allowed file types',
        evidence: 'No accept attribute found in file inputs'
      })
    }
    
    // 3. Check for dangerous file extension warnings
    findings.push({
      type: 'File Upload Security Recommendations',
      severity: 'medium',
      description: 'File upload requires comprehensive security measures',
      recommendation: [
        'Validate file types on server-side (whitelist approach)',
        'Scan uploaded files for malware',
        'Store files outside web root',
        'Rename uploaded files',
        'Limit file size',
        `Block dangerous extensions: ${DANGEROUS_FILE_EXTENSIONS.join(', ')}`,
        'Use Content-Type validation',
        'Implement rate limiting'
      ].join('; ')
    })
  }
  
  // 4. Check for common upload endpoints
  const uploadEndpoints = ['/upload', '/file-upload', '/api/upload', '/uploader']
  for (const endpoint of uploadEndpoints) {
    try {
      const testUrl = new URL(endpoint, baseUrl.toString())
      const response = await fetch(testUrl.toString(), {
        method: 'OPTIONS',
        signal: AbortSignal.timeout(3000)
      })
      
      if (response.ok) {
        const allowHeader = response.headers.get('allow') || ''
        if (allowHeader.includes('POST')) {
          findings.push({
            type: 'Upload Endpoint Detected',
            severity: 'medium',
            description: `Upload endpoint found: ${endpoint}`,
            recommendation: 'Ensure upload endpoint has proper authentication and validation',
            url: testUrl.toString()
          })
        }
      }
    } catch {
      // Endpoint not accessible
    }
  }
  
  return findings
}

// MAKSIMAL: Test Broken Access Control
async function testAccessControl(baseUrl: URL): Promise<any[]> {
  const findings: any[] = []
  
  // 1. Test common admin/sensitive endpoints
  for (const endpoint of ACCESS_CONTROL_ENDPOINTS) {
    try {
      const testUrl = new URL(endpoint, baseUrl.toString())
      
      // Test WITHOUT authentication
      const response = await fetch(testUrl.toString(), {
        method: 'GET',
        redirect: 'manual',
        signal: AbortSignal.timeout(5000)
      })
      
      // If we get 200 OK without auth, it's a problem
      if (response.status === 200) {
        findings.push({
          type: 'Broken Access Control - Unauthorized Access',
          severity: 'critical',
          description: `Sensitive endpoint "${endpoint}" is publicly accessible`,
          recommendation: 'Implement proper authentication and authorization checks',
          url: testUrl.toString(),
          evidence: 'HTTP 200 returned without authentication'
        })
      }
      
      // If we get 403 Forbidden, access control exists (good)
      // If we get 401 Unauthorized, authentication is required (good)
      // If we get 404, endpoint doesn't exist (neutral)
      
    } catch {
      // Error during test
    }
  }
  
  // 2. Test IDOR (Insecure Direct Object Reference)
  const idorEndpoints = [
    '/api/user/1',
    '/api/user/2',
    '/user/profile/1',
    '/document/1',
    '/file/1'
  ]
  
  for (const endpoint of idorEndpoints) {
    try {
      const testUrl = new URL(endpoint, baseUrl.toString())
      const response = await fetch(testUrl.toString(), {
        signal: AbortSignal.timeout(5000)
      })
      
      if (response.status === 200) {
        findings.push({
          type: 'Potential IDOR Vulnerability',
          severity: 'high',
          description: `Endpoint "${endpoint}" may be vulnerable to IDOR attacks`,
          recommendation: 'Implement proper authorization checks to verify user owns the resource',
          url: testUrl.toString(),
          evidence: 'Sequential ID accessible without proper authorization check'
        })
      }
    } catch {
      // Error during test
    }
  }
  
  // 3. Check for exposed admin interfaces
  const adminInterfaces = [
    '/admin',
    '/administrator',
    '/wp-admin',
    '/phpmyadmin',
    '/adminer',
    '/admin.php',
    '/administrator.php',
    '/cpanel',
    '/plesk'
  ]
  
  for (const admin of adminInterfaces) {
    try {
      const testUrl = new URL(admin, baseUrl.toString())
      const response = await fetch(testUrl.toString(), {
        method: 'HEAD',
        signal: AbortSignal.timeout(3000)
      })
      
      if (response.status === 200 || response.status === 302) {
        findings.push({
          type: 'Exposed Admin Interface',
          severity: 'high',
          description: `Admin interface found at: ${admin}`,
          recommendation: 'Restrict admin interface access by IP whitelist or VPN, use strong authentication',
          url: testUrl.toString()
        })
      }
    } catch {
      // Interface not accessible
    }
  }
  
  return findings
}

// Advanced subdomain detection
async function findSubdomains(domain: string): Promise<string[]> {
  const subdomains = ['www', 'api', 'admin', 'dev', 'staging', 'test', 'mail', 'ftp', 'blog', 'shop']
  const found: string[] = []
  
  for (const sub of subdomains.slice(0, 5)) { // Check first 5 to save time
    try {
      const testUrl = `https://${sub}.${domain}`
      await fetch(testUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(2000)
      })
      found.push(`${sub}.${domain}`)
    } catch {
      // Subdomain doesn't exist or not accessible
    }
  }
  
  return found
}

// Main scan function - saves to database
async function performScan(scanId: string, url: URL, scanType: string) {
  const startTime = Date.now()
  const results: any = {
    vulnerabilities: [],
    securityHeaders: {},
    sslInfo: {},
    technologies: [],
    openPorts: [],
    checks: {
      total: 0,
      passed: 0,
      failed: 0
    }
  }

  try {
    // 1. Check if website is accessible
    results.checks.total++
    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'User-Agent': 'BiruCyber Security Scanner/1.0'
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      if (response.ok) {
        results.checks.passed++
      }

      // 2. Check Security Headers
      results.checks.total += SECURITY_HEADERS.length
      const headers: any = {}
      
      for (const header of SECURITY_HEADERS) {
        const value = response.headers.get(header)
        headers[header] = value || 'Missing'
        
        if (value) {
          results.checks.passed++
        } else {
          results.checks.failed++
          results.vulnerabilities.push({
            type: 'Missing Security Header',
            name: header,
            severity: 'medium',
            description: `Security header ${header} is not set`,
            recommendation: `Add ${header} header to improve security`
          })
        }
      }
      results.securityHeaders = headers

      // 3. Detect Technologies
      const contentType = response.headers.get('content-type')
      const server = response.headers.get('server')
      const poweredBy = response.headers.get('x-powered-by')
      
      if (server) results.technologies.push(`Server: ${server}`)
      if (poweredBy) results.technologies.push(`Powered By: ${poweredBy}`)
      if (contentType) results.technologies.push(`Content-Type: ${contentType}`)

      // 4. Get response body for further analysis
      const html = await response.text()

      // Check for common vulnerabilities in HTML
      if (html.toLowerCase().includes('<input') && !html.toLowerCase().includes('csrf')) {
        results.checks.total++
        results.checks.failed++
        results.vulnerabilities.push({
          type: 'Potential CSRF Vulnerability',
          severity: 'high',
          description: 'Forms detected without visible CSRF protection',
          recommendation: 'Implement CSRF tokens for all forms'
        })
      }

      // ===== MAKSIMAL TESTING STARTS HERE =====
      
      // 1. SQL INJECTION TESTING
      console.log('🔍 Testing SQL Injection...')
      const sqlFindings = await testSQLInjection(url, html)
      results.vulnerabilities.push(...sqlFindings)
      results.checks.total += 5
      if (sqlFindings.length > 0) {
        results.checks.failed += sqlFindings.length
      } else {
        results.checks.passed += 5
      }
      
      // 2. XSS TESTING
      console.log('🔍 Testing XSS...')
      const xssFindings = await testXSS(url, html)
      results.vulnerabilities.push(...xssFindings)
      results.checks.total += 5
      if (xssFindings.length > 0) {
        results.checks.failed += xssFindings.length
      } else {
        results.checks.passed += 5
      }
      
      // 3. FILE UPLOAD TESTING
      console.log('🔍 Testing File Upload...')
      const uploadFindings = await testFileUpload(url, html)
      results.vulnerabilities.push(...uploadFindings)
      results.checks.total += 3
      if (uploadFindings.length > 0) {
        results.checks.failed += uploadFindings.length
      } else {
        results.checks.passed += 3
      }
      
      // 4. BROKEN ACCESS CONTROL TESTING
      if (scanType === 'full') {
        console.log('🔍 Testing Access Control...')
        const accessFindings = await testAccessControl(url)
        results.vulnerabilities.push(...accessFindings)
        results.checks.total += 10
        if (accessFindings.length > 0) {
          results.checks.failed += accessFindings.length
        } else {
          results.checks.passed += 10
        }
      }

      // Check for exposed sensitive info
      results.checks.total++
      const sensitivePatterns = ['password', 'api_key', 'secret', 'token', 'private']
      let foundSensitive = false
      for (const pattern of sensitivePatterns) {
        if (html.toLowerCase().includes(`"${pattern}"`)) {
          results.checks.failed++
          foundSensitive = true
          results.vulnerabilities.push({
            type: 'Sensitive Information Exposure',
            severity: 'high',
            description: `Potential sensitive data found: ${pattern}`,
            recommendation: 'Remove sensitive information from client-side code'
          })
          break
        }
      }
      if (!foundSensitive) results.checks.passed++

    } catch (fetchError: any) {
      results.checks.failed++
      results.vulnerabilities.push({
        type: 'Connection Error',
        severity: 'critical',
        description: `Failed to connect to website: ${fetchError.message}`,
        recommendation: 'Verify website is accessible and not blocking automated requests'
      })
    }

    // 5. SSL/TLS Check
    results.checks.total++
    if (url.protocol === 'https:') {
      results.checks.passed++
      results.sslInfo = {
        enabled: true,
        protocol: 'HTTPS',
        status: 'Secure connection established'
      }
    } else {
      results.checks.failed++
      results.sslInfo = {
        enabled: false,
        protocol: 'HTTP',
        status: 'Insecure connection'
      }
      results.vulnerabilities.push({
        type: 'No SSL/TLS Encryption',
        severity: 'critical',
        description: 'Website is not using HTTPS',
        recommendation: 'Enable SSL/TLS certificate and enforce HTTPS'
      })
    }

    // 6. Check for common vulnerable endpoints
    if (scanType === 'full') {
      const vulnerableEndpoints = [
        '/admin',
        '/login',
        '/api',
        '/.git',
        '/.env',
        '/config',
        '/backup',
        '/phpMyAdmin'
      ]

      results.checks.total += vulnerableEndpoints.length
      for (const endpoint of vulnerableEndpoints) {
        try {
          const testUrl = new URL(endpoint, url.toString())
          const resp = await fetch(testUrl.toString(), {
            method: 'HEAD',
            signal: AbortSignal.timeout(5000)
          })

          if (resp.status === 200) {
            results.checks.failed++
            results.vulnerabilities.push({
              type: 'Exposed Sensitive Endpoint',
              severity: 'medium',
              description: `Endpoint ${endpoint} is publicly accessible`,
              recommendation: 'Restrict access to sensitive endpoints'
            })
          } else {
            results.checks.passed++
          }
        } catch {
          results.checks.passed++ // Not accessible = good
        }
      }
    }

    // Calculate security score
    const score = results.checks.total > 0 
      ? Math.round((results.checks.passed / results.checks.total) * 100)
      : 0

    // Determine overall severity
    const criticalCount = results.vulnerabilities.filter((v: any) => v.severity === 'critical').length
    const highCount = results.vulnerabilities.filter((v: any) => v.severity === 'high').length
    const mediumCount = results.vulnerabilities.filter((v: any) => v.severity === 'medium').length
    
    let overallSeverity = 'low'
    if (criticalCount > 0) overallSeverity = 'critical'
    else if (highCount > 0) overallSeverity = 'high'
    else if (mediumCount > 0) overallSeverity = 'medium'

    // Generate recommendations
    const recommendations = [
      'Enable HTTPS if not already enabled',
      'Implement all missing security headers',
      'Use Content Security Policy (CSP)',
      'Enable HTTP Strict Transport Security (HSTS)',
      'Disable detailed error messages in production',
      'Implement rate limiting on sensitive endpoints',
      'Use CSRF tokens for all state-changing operations',
      'Regular security audits and penetration testing'
    ]

    // Update scan record
    const duration = Math.round((Date.now() - startTime) / 1000)
    await prisma.websiteScan.update({
      where: { id: scanId },
      data: {
        status: 'completed',
        vulnerabilities: JSON.stringify(results.vulnerabilities),
        securityScore: score,
        sqlInjection: results.vulnerabilities.some((v: any) => v.type.includes('SQL')),
        xssVulnerable: results.vulnerabilities.some((v: any) => v.type.includes('XSS')),
        brokenAccessControl: results.vulnerabilities.some((v: any) => v.type.includes('Access')),
        securityHeaders: JSON.stringify(results.securityHeaders),
        sslInfo: JSON.stringify(results.sslInfo),
        technologies: JSON.stringify(results.technologies),
        openPorts: JSON.stringify([]), // Placeholder
        scanDuration: duration,
        totalChecks: results.checks.total,
        passedChecks: results.checks.passed,
        failedChecks: results.checks.failed,
        recommendations: JSON.stringify(recommendations),
        severity: overallSeverity,
        completedAt: new Date()
      }
    })

  } catch (error: any) {
    console.error('Scan error:', error)
    await prisma.websiteScan.update({
      where: { id: scanId },
      data: {
        status: 'failed',
        errorMessage: error.message,
        completedAt: new Date()
      }
    })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const scanId = searchParams.get('scanId')

    // Check if database is available
    if (!isDatabaseAvailable() || !prisma) {
      return NextResponse.json(
        { 
          error: 'Database not configured',
          message: 'DATABASE_URL environment variable is not set.',
          instructions: 'Follow QUICK-START-DATABASE.md to setup PostgreSQL'
        },
        { status: 503 }
      )
    }

    if (scanId) {
      // Get specific scan result from database
      const scan = await prisma.websiteScan.findUnique({
        where: { id: scanId }
      })

      if (!scan) {
        return NextResponse.json(
          { error: 'Scan not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        scan: {
          ...scan,
          vulnerabilities: scan.vulnerabilities ? JSON.parse(scan.vulnerabilities) : [],
          securityHeaders: scan.securityHeaders ? JSON.parse(scan.securityHeaders) : {},
          sslInfo: scan.sslInfo ? JSON.parse(scan.sslInfo) : {},
          technologies: scan.technologies ? JSON.parse(scan.technologies) : [],
          openPorts: scan.openPorts ? JSON.parse(scan.openPorts) : [],
          recommendations: scan.recommendations ? JSON.parse(scan.recommendations) : [],
          subdomains: scan.subdomains ? JSON.parse(scan.subdomains) : [],
          exposedFiles: scan.exposedFiles ? JSON.parse(scan.exposedFiles) : []
        }
      })
    }

    // Get all scans from database (recent 50)
    const scans = await prisma.websiteScan.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json({
      success: true,
      scans: scans.map(scan => ({
        id: scan.id,
        targetUrl: scan.targetUrl,
        status: scan.status,
        securityScore: scan.securityScore,
        severity: scan.severity,
        scanDuration: scan.scanDuration,
        createdAt: scan.createdAt,
        completedAt: scan.completedAt
      })),
      source: 'database'
    })

  } catch (error: any) {
    console.error('Get scan error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve scan' },
      { status: 500 }
    )
  }
}
