import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number, resetTime: number, blocked: boolean }>()
const loginAttempts = new Map<string, { attempts: number, lastAttempt: number, locked: boolean }>()

// Configuration
const RATE_LIMIT = {
  maxRequests: 10,
  windowMs: 60000, // 1 minute
  maxLoginAttempts: 5,
  lockoutDurationMs: 300000 // 5 minutes
}

// Simulated users for brute force demo
const users = [
  { username: 'admin', password: 'admin123' },
  { username: 'user', password: 'pass123' }
]

export async function POST(request: NextRequest) {
  try {
    const { action, username, password, testMode = 'safe', clientIp = 'unknown' } = await request.json()

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    // Get client identifier
    const identifier = clientIp || 'test-client'
    const now = Date.now()

    if (action === 'login') {
      if (!username || !password) {
        return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
      }

      // Safe mode - Rate limiting enabled
      if (testMode === 'safe') {
        // Check if account is locked
        const accountData = loginAttempts.get(username)
        if (accountData && accountData.locked) {
          const timeRemaining = Math.ceil((accountData.lastAttempt + RATE_LIMIT.lockoutDurationMs - now) / 1000)
          
          if (timeRemaining > 0) {
            return NextResponse.json({
              success: false,
              message: '🔒 Account temporarily locked due to multiple failed attempts',
              locked: true,
              lockoutRemaining: `${Math.floor(timeRemaining / 60)}m ${timeRemaining % 60}s`,
              security: {
                rateLimitingEnabled: true,
                accountLocked: true,
                reason: 'Too many failed login attempts',
                lockoutDuration: '5 minutes'
              }
            }, { status: 429 })
          } else {
            // Reset lock after timeout
            loginAttempts.delete(username)
          }
        }

        // Verify credentials
        const user = users.find(u => u.username === username && u.password === password)
        
        if (user) {
          // Successful login - reset attempts
          loginAttempts.delete(username)
          
          const resultSuccess = {
            success: true,
            message: '✅ Login successful',
            user: { username: user.username },
            security: {
              rateLimitingEnabled: true,
              attemptsReset: true,
              protection: 'Brute force prevention active'
            }
          }

          // Save successful login to database
          try {
            await prisma.rateLimitingTest.create({
              data: {
                action: 'login',
                username: username,
                testMode: 'safe',
                attempts: 1,
                blocked: false,
                lockoutTriggered: false,
                ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown',
                result: JSON.stringify(resultSuccess)
              }
            })
          } catch (dbError) {
            console.error('Failed to save rate limiting test to database:', dbError)
          }
          
          return NextResponse.json(resultSuccess)
        } else {
          // Failed login - increment attempts
          const attempts = loginAttempts.get(username) || { attempts: 0, lastAttempt: now, locked: false }
          attempts.attempts += 1
          attempts.lastAttempt = now
          
          if (attempts.attempts >= RATE_LIMIT.maxLoginAttempts) {
            attempts.locked = true
          }
          
          loginAttempts.set(username, attempts)
          
          const resultFailed = {
            success: false,
            message: 'Invalid credentials',
            attemptsRemaining: Math.max(0, RATE_LIMIT.maxLoginAttempts - attempts.attempts),
            warning: attempts.attempts >= RATE_LIMIT.maxLoginAttempts - 1 
              ? '⚠️ Account will be locked after one more failed attempt' 
              : undefined,
            security: {
              rateLimitingEnabled: true,
              attemptsTracked: true,
              maxAttempts: RATE_LIMIT.maxLoginAttempts
            }
          }

          // Save failed login attempt to database
          try {
            await prisma.rateLimitingTest.create({
              data: {
                action: 'login',
                username: username,
                testMode: 'safe',
                attempts: attempts.attempts,
                blocked: attempts.locked,
                lockoutTriggered: attempts.locked,
                ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown',
                result: JSON.stringify(resultFailed)
              }
            })
          } catch (dbError) {
            console.error('Failed to save rate limiting test to database:', dbError)
          }
          
          return NextResponse.json(resultFailed, { status: 401 })
        }
      }

      // Vulnerable mode - No rate limiting
      if (testMode === 'vulnerable') {
        // Track attempts for demonstration
        const attempts = loginAttempts.get(username) || { attempts: 0, lastAttempt: now, locked: false }
        attempts.attempts += 1
        attempts.lastAttempt = now
        loginAttempts.set(username, attempts)

        const user = users.find(u => u.username === username && u.password === password)
        
        if (user) {
          return NextResponse.json({
            success: true,
            message: 'Login successful',
            user: { username: user.username },
            security: { rateLimitingEnabled: false }
          })
        }

        // Log brute force attack
        if (attempts.attempts >= 10) {
          try {
            await fetch(`${request.nextUrl.origin}/api/dashboard`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                eventType: 'BRUTE_FORCE',
                description: `Brute force attack detected on account: ${username}`,
                payload: { username, attempts: attempts.attempts, clientIp },
                severity: 'critical',
                blocked: false
              })
            })
          } catch (e) {
            console.error('Failed to log to dashboard:', e)
          }

          const resultBrute = {
            success: false,
            message: '🚨 BRUTE FORCE ATTACK DETECTED!',
            vulnerability: 'No Rate Limiting / Brute Force Protection',
            severity: 'critical',
            attack: {
              type: 'Brute Force Attack',
              target: username,
              attempts: attempts.attempts,
              duration: `${Math.floor((now - (attempts.lastAttempt - attempts.attempts * 1000)) / 1000)}s`,
              blocked: false
            },
            impact: 'Unlimited login attempts allow password guessing attacks',
            realWorldImpact: [
              '🔓 Account Takeover: Attackers can guess weak passwords',
              '📊 Credential Stuffing: Test leaked passwords from other breaches',
              '🤖 Automated Attacks: Bots can try millions of combinations',
              '💾 Resource Exhaustion: Overwhelm server with requests',
              '📡 DDoS Potential: Flood application with authentication requests',
              '🔐 2FA Bypass: Attempt to exhaust backup codes',
              '🎭 User Enumeration: Identify valid usernames'
            ],
            attackMethods: [
              {
                method: 'Dictionary Attack',
                description: 'Try common passwords from wordlists',
                effectiveness: 'High against weak passwords'
              },
              {
                method: 'Credential Stuffing',
                description: 'Use leaked username/password combinations',
                effectiveness: 'High due to password reuse'
              },
              {
                method: 'Brute Force',
                description: 'Try all possible password combinations',
                effectiveness: 'Time-consuming but works on simple passwords'
              },
              {
                method: 'Rainbow Tables',
                description: 'Pre-computed hash tables for password cracking',
                effectiveness: 'Very fast for unsalted hashes'
              }
            ],
            statistics: {
              totalAttempts: attempts.attempts,
              successRate: user ? '100%' : '0%',
              averageAttemptRate: `${(attempts.attempts / ((now - (attempts.lastAttempt - attempts.attempts * 1000)) / 1000)).toFixed(2)} attempts/second`,
              estimatedTimeToSuccess: estimateCrackTime(password || '')
            },
            explanation: `The application allows unlimited login attempts without rate limiting.

Attack Scenario:
1. Attacker identifies target username (often 'admin')
2. Automated tool sends thousands of password attempts
3. No delays or lockouts prevent rapid testing
4. Eventually, weak password is discovered
5. Attacker gains unauthorized access

Without rate limiting:
- 1000 attempts in 1 minute
- 60,000 attempts in 1 hour
- 1.4 million attempts in 1 day

This makes even moderately complex passwords crackable.`,
            prevention: [
              '✅ Rate Limiting: Limit login attempts per IP/account',
              '✅ Account Lockout: Temporarily lock after failed attempts',
              '✅ CAPTCHA: Add CAPTCHA after failed attempts',
              '✅ 2FA/MFA: Require second authentication factor',
              '✅ Password Complexity: Enforce strong password requirements',
              '✅ IP Blocking: Block IPs with excessive failed attempts',
              '✅ Exponential Backoff: Increase delay between attempts',
              '✅ Monitoring: Alert on suspicious login patterns',
              '✅ Honeypot Accounts: Detect automated attacks',
              '✅ Login Throttling: Slow down authentication checks'
            ],
            codeExamples: {
              expressRateLimit: `
// Express.js with express-rate-limit
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/login', loginLimiter, (req, res) => {
  // Login logic
});`,
              nextjsMiddleware: `
// Next.js middleware
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimit = new Map();

export function middleware(request: NextRequest) {
  const ip = request.ip ?? 'anonymous';
  const limit = rateLimit.get(ip) ?? { count: 0, resetTime: Date.now() + 60000 };
  
  if (Date.now() > limit.resetTime) {
    limit.count = 0;
    limit.resetTime = Date.now() + 60000;
  }
  
  limit.count++;
  rateLimit.set(ip, limit);
  
  if (limit.count > 10) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
  
  return NextResponse.next();
}`,
              accountLockout: `
// Account lockout implementation
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

function checkLoginAttempt(username) {
  const attempts = loginAttempts.get(username);
  
  if (attempts && attempts.locked) {
    if (Date.now() < attempts.lockoutUntil) {
      throw new Error('Account locked. Try again later.');
    }
    loginAttempts.delete(username);
  }
}

function recordFailedAttempt(username) {
  const attempts = loginAttempts.get(username) || { count: 0 };
  attempts.count++;
  
  if (attempts.count >= MAX_ATTEMPTS) {
    attempts.locked = true;
    attempts.lockoutUntil = Date.now() + LOCKOUT_TIME;
  }
  
  loginAttempts.set(username, attempts);
}`
            },
            mitigation: [
              'Implement rate limiting immediately',
              'Add account lockout after 5 failed attempts',
              'Deploy CAPTCHA for suspicious activity',
              'Enable 2FA for all accounts',
              'Monitor and alert on brute force attempts',
              'Use Web Application Firewall (WAF)',
              'Implement login throttling',
              'Educate users about strong passwords'
            ]
          }

          // Save brute force attack to database
          try {
            await prisma.rateLimitingTest.create({
              data: {
                action: 'login',
                username: username,
                testMode: 'vulnerable',
                attempts: attempts.attempts,
                blocked: false,
                lockoutTriggered: false,
                ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
                userAgent: request.headers.get('user-agent') || 'unknown',
                result: JSON.stringify(resultBrute)
              }
            })
          } catch (dbError) {
            console.error('Failed to save rate limiting test to database:', dbError)
          }

          return NextResponse.json(resultBrute, { status: 429 })
        }

        const resultVulnFail = {
          success: false,
          message: 'Invalid credentials',
          attempts: attempts.attempts,
          warning: 'No rate limiting - unlimited attempts allowed',
          security: { rateLimitingEnabled: false }
        }

        // Save vulnerable failed login to database
        try {
          await prisma.rateLimitingTest.create({
            data: {
              action: 'login',
              username: username,
              testMode: 'vulnerable',
              attempts: attempts.attempts,
              blocked: false,
              lockoutTriggered: false,
              ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
              userAgent: request.headers.get('user-agent') || 'unknown',
              result: JSON.stringify(resultVulnFail)
            }
          })
        } catch (dbError) {
          console.error('Failed to save rate limiting test to database:', dbError)
        }

        return NextResponse.json(resultVulnFail, { status: 401 })
      }
    }

    // General rate limiting test
    const rateData = rateLimitStore.get(identifier) || { count: 0, resetTime: now + RATE_LIMIT.windowMs, blocked: false }
    
    if (now > rateData.resetTime) {
      rateData.count = 0
      rateData.resetTime = now + RATE_LIMIT.windowMs
      rateData.blocked = false
    }

    rateData.count++
    rateLimitStore.set(identifier, rateData)

    if (testMode === 'safe' && rateData.count > RATE_LIMIT.maxRequests) {
      rateData.blocked = true
      rateLimitStore.set(identifier, rateData)
      
      return NextResponse.json({
        success: false,
        message: '🛑 Rate limit exceeded',
        rateLimitExceeded: true,
        limit: RATE_LIMIT.maxRequests,
        windowMs: RATE_LIMIT.windowMs,
        resetIn: Math.ceil((rateData.resetTime - now) / 1000),
        security: { rateLimitingEnabled: true }
      }, { status: 429 })
    }

    return NextResponse.json({
      success: true,
      message: 'Request processed',
      rateLimit: {
        remaining: Math.max(0, RATE_LIMIT.maxRequests - rateData.count),
        limit: RATE_LIMIT.maxRequests,
        resetIn: Math.ceil((rateData.resetTime - now) / 1000)
      }
    })

  } catch (error) {
    console.error('Rate limit test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function estimateCrackTime(password: string): string {
  const length = password.length
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^a-zA-Z0-9]/.test(password)
  
  let charsetSize = 0
  if (hasLower) charsetSize += 26
  if (hasUpper) charsetSize += 26
  if (hasNumber) charsetSize += 10
  if (hasSpecial) charsetSize += 32
  
  const combinations = Math.pow(charsetSize, length)
  const attemptsPerSecond = 1000 // Conservative estimate
  const seconds = combinations / attemptsPerSecond
  
  if (seconds < 60) return `${seconds.toFixed(0)} seconds`
  if (seconds < 3600) return `${(seconds / 60).toFixed(0)} minutes`
  if (seconds < 86400) return `${(seconds / 3600).toFixed(0)} hours`
  if (seconds < 31536000) return `${(seconds / 86400).toFixed(0)} days`
  return `${(seconds / 31536000).toFixed(0)} years`
}

export async function GET() {
  return NextResponse.json({
    message: 'Rate Limiting & Brute Force Protection API',
    endpoints: {
      'POST /api/rate-limiting': {
        description: 'Test rate limiting and brute force protection',
        parameters: {
          action: 'login | request',
          username: 'string (for login action)',
          password: 'string (for login action)',
          testMode: 'safe|vulnerable (default: safe)',
          clientIp: 'string (optional)'
        }
      }
    },
    configuration: RATE_LIMIT,
    warning: 'This API is for educational purposes only.'
  })
}
