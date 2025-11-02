'use client'

import { useState, useEffect } from 'react'

interface CommandHistoryItem {
  cmd: string;
  response: string;
}

export default function HackerPortal() {
  const [activeTab, setActiveTab] = useState('terminal')
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [displayText, setDisplayText] = useState('')
  const [glitchActive, setGlitchActive] = useState(false)
  
  // SQL Injection states
  const [sqlUsername, setSqlUsername] = useState('')
  const [sqlPassword, setSqlPassword] = useState('')
  const [sqlMode, setSqlMode] = useState('safe')
  const [sqlResult, setSqlResult] = useState<any>(null)
  const [sqlLoading, setSqlLoading] = useState(false)
  
  // XSS states
  const [xssComment, setXssComment] = useState('')
  const [xssAuthor, setXssAuthor] = useState('')
  const [xssMode, setXssMode] = useState('safe')
  const [xssResult, setXssResult] = useState<any>(null)
  const [xssLoading, setXssLoading] = useState(false)
  
  // Access Control states
  const [acResource, setAcResource] = useState('/admin')
  const [acUserToken, setAcUserToken] = useState('guest-token-789')
  const [acMode, setAcMode] = useState('safe')
  const [acBypass, setAcBypass] = useState(false)
  const [acResult, setAcResult] = useState<any>(null)
  const [acLoading, setAcLoading] = useState(false)
  
  // Dashboard states
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [dashboardLoading, setDashboardLoading] = useState(false)
  
  // Matrix rain state (client-side only)
  const [matrixChars, setMatrixChars] = useState<Array<{left: string, duration: string, delay: string, char: string}>>([])
  const [isClient, setIsClient] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  const fullText = "root@birucyber:~$ ./security_portal --init"
  
  // Initialize client-side only
  useEffect(() => {
    setIsClient(true)
    setCurrentTime(new Date().toString())
    
    // Generate matrix rain characters
    const chars = Array.from({ length: 50 }, () => ({
      left: `${Math.random() * 100}%`,
      duration: `${5 + Math.random() * 10}s`,
      delay: `${Math.random() * 5}s`,
      char: String.fromCharCode(33 + Math.floor(Math.random() * 94))
    }))
    setMatrixChars(chars)
  }, [])
  
  useEffect(() => {
    if (isTyping && displayText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, displayText.length + 1))
      }, 50)
      return () => clearTimeout(timeout)
    } else if (isTyping) {
      setIsTyping(false)
      setTimeout(() => setGlitchActive(true), 1000)
    }
  }, [displayText, isTyping])
  
  // Load dashboard data
  useEffect(() => {
    if (activeTab === 'scan') {
      fetchDashboard()
    }
  }, [activeTab])
  
  const fetchDashboard = async () => {
    setDashboardLoading(true)
    try {
      const response = await fetch('/api/dashboard')
      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setDashboardLoading(false)
    }
  }

  const securityModules = [
    {
      id: 'sql-injection',
      title: '[SQL_INJECTION.exe]',
      description: 'Database breach protocols - Execute SQL manipulation attacks',
      level: 'THREAT_LEVEL: ORANGE',
      duration: '00:45:00',
      status: '[ACTIVE]',
      exploit: 'UNION-based injection • Blind SQLi • Time-based attacks'
    },
    {
      id: 'xss',
      title: '[XSS_PAYLOAD.exe]',
      description: 'Cross-site scripting deployment - Inject malicious JavaScript',
      level: 'THREAT_LEVEL: YELLOW',
      duration: '00:30:00',
      status: '[ACTIVE]',
      exploit: 'Stored XSS • Reflected XSS • DOM-based XSS'
    },
    {
      id: 'access-control',
      title: '[ACCESS_BYPASS.exe]',
      description: 'Authorization circumvention - Break security boundaries',
      level: 'THREAT_LEVEL: RED',
      duration: '01:00:00',
      status: '[ACTIVE]',
      exploit: 'IDOR • Privilege escalation • Parameter tampering'
    }
  ]

  const systemStats = [
    { label: 'SYSTEM_MODULES', value: '3', status: 'ONLINE' },
    { label: 'EXPLOITS_LOADED', value: '0', status: 'READY' },
    { label: 'SECURITY_BREACHES', value: '0', status: 'MONITORING' },
    { label: 'ANONYMITY_LEVEL', value: '100%', status: 'MASKED' }
  ]

  // Test SQL Injection
  const testSQLInjection = async () => {
    setSqlLoading(true)
    setSqlResult(null)
    try {
      const response = await fetch('/api/sql-injection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: sqlUsername,
          password: sqlPassword,
          testMode: sqlMode
        })
      })
      const data = await response.json()
      setSqlResult(data)
    } catch (error: any) {
      setSqlResult({ error: 'Failed to test SQL injection: ' + (error?.message || 'Unknown error') })
    } finally {
      setSqlLoading(false)
    }
  }
  
  // Test XSS
  const testXSS = async () => {
    setXssLoading(true)
    setXssResult(null)
    try {
      const response = await fetch('/api/xss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comment: xssComment,
          author: xssAuthor,
          testMode: xssMode
        })
      })
      const data = await response.json()
      setXssResult(data)
    } catch (error: any) {
      setXssResult({ error: 'Failed to test XSS: ' + (error?.message || 'Unknown error') })
    } finally {
      setXssLoading(false)
    }
  }
  
  // Test Access Control
  const testAccessControl = async () => {
    setAcLoading(true)
    setAcResult(null)
    try {
      const response = await fetch('/api/access-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resource: acResource,
          userToken: acUserToken,
          testMode: acMode,
          bypassAttempt: acBypass
        })
      })
      const data = await response.json()
      setAcResult(data)
    } catch (error: any) {
      setAcResult({ error: 'Failed to test access control: ' + (error?.message || 'Unknown error') })
    } finally {
      setAcLoading(false)
    }
  }

  const executeCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase()
    let response = ''

    switch(trimmedCmd) {
      case 'help':
        response = `Available commands:
  help     - Show this help message
  clear    - Clear terminal
  scan     - Scan for vulnerabilities
  exploit  - Launch exploit modules
  status   - Show system status
  whoami   - Display current user
  exit     - Terminate session`
        break
      case 'clear':
        setCommandHistory([])
        setCurrentCommand('')
        return
      case 'scan':
        response = `Scanning target...
[+] Port 80: OPEN - HTTP
[+] Port 443: OPEN - HTTPS  
[+] Port 3306: OPEN - MySQL
[+] SQL Injection vulnerability detected
[+] XSS vulnerability detected
[+] Access control bypass possible
Scan complete. 3 vulnerabilities found.`
        break
      case 'exploit':
        response = `Loading exploit modules...
[+] SQL_INJECTION.exe - Ready
[+] XSS_PAYLOAD.exe - Ready  
[+] ACCESS_BYPASS.exe - Ready
Select module to execute.`
        break
      case 'status':
        response = `SYSTEM STATUS:
[+] Kernel: 5.15.0-cybersec
[+] Uptime: 1337 days
[+] Memory: 8GB/16GB used
[+] Network: Anonymous mode ON
[+] Firewall: DISABLED
[+] Antivirus: BYPASSED
[+] VPN: ACTIVE - Location: Unknown`
        break
      case 'whoami':
        response = `uid=0(root) gid=0(root) groups=0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel)
Current user: ROOT
Access level: GOD MODE`
        break
      case 'exit':
        response = `Terminating session...
[+] Connection closed
[+] Logs cleared
[+] Traces eliminated
Goodbye, hacker.`
        break
      default:
        if (trimmedCmd.startsWith('cd ')) {
          const path = trimmedCmd.substring(3)
          response = `Changed directory to /birucyber/${path || 'root'}`
        } else if (trimmedCmd.startsWith('ls')) {
          response = `drwxr-xr-x  2 root root 4096 Dec 13 23:59 exploits/
drwxr-xr-x  2 root root 4096 Dec 13 23:59 payloads/
drwxr-xr-x  2 root root 4096 Dec 13 23:59 logs/
-rwxr-xr-x  1 root root 1337 Dec 13 23:59 backdoor.sh
-rwxr-xr-x  1 root root 2048 Dec 13 23:59 encrypt_tool.exe`
        } else if (trimmedCmd === '') {
          return
        } else {
          response = `Command not found: ${cmd}
Type 'help' for available commands.`
        }
    }

    setCommandHistory(prev => [...prev, { cmd, response }])
    setCurrentCommand('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000000', 
      color: '#00ff00', 
      fontFamily: 'Courier New, monospace',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Scanlines Effect */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'repeating-linear-gradient(0deg, rgba(0,255,0,0.03) 0px, transparent 1px, transparent 2px, rgba(0,255,0,0.03) 3px)',
        pointerEvents: 'none',
        zIndex: 1
      }}></div>

      {/* Glitch Effect */}
      {glitchActive && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,255,0,0.1)',
          animation: 'glitch 0.3s infinite',
          pointerEvents: 'none',
          zIndex: 2
        }}></div>
      )}

      {/* Matrix Rain Effect */}
      {isClient && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.1
        }}>
          {matrixChars.map((item, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: item.left,
                top: `-20px`,
                color: '#00ff00',
                fontSize: '12px',
                animation: `fall ${item.duration} linear infinite`,
                animationDelay: item.delay
              }}
            >
              {item.char}
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        {/* Terminal Header */}
        <header style={{ 
          borderBottom: '2px solid #00ff00', 
          backgroundColor: 'rgba(0,0,0,0.9)', 
          padding: '1rem' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#ff0000', borderRadius: '50%' }}></div>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#ffff00', borderRadius: '50%' }}></div>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#00ff00', borderRadius: '50%' }}></div>
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold', 
                  color: '#00ff00', 
                  fontFamily: 'Courier New, monospace',
                  margin: 0,
                  textShadow: '0 0 10px #00ff00'
                }}>
                  {displayText}
                  <span style={{ animation: 'blink 1s infinite' }}>_</span>
                </h1>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
              <span style={{ color: '#ffff00' }}>[ENCRYPTED]</span>
              <span style={{ color: '#00ff00' }}>[ANONYMOUS]</span>
              <span style={{ color: '#ff0000' }}>[OFFLINE]</span>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '0', 
          backgroundColor: 'rgba(0,0,0,0.9)', 
          borderBottom: '1px solid #00ff00',
          padding: '0'
        }}>
          {['terminal', 'modules', 'scan', 'exploits', 'logs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.8rem',
                fontFamily: 'Courier New, monospace',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === tab ? '#00ff00' : 'transparent',
                color: activeTab === tab ? '#000000' : '#00ff00',
                transition: 'all 0.2s',
                textTransform: 'uppercase'
              }}
            >
              [{tab}]
            </button>
          ))}
        </div>

        {/* Terminal Tab */}
        {activeTab === 'terminal' && (
          <div style={{ padding: '1rem', height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            <div style={{ marginBottom: '1rem', color: '#00ff00' }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`╔══════════════════════════════════════════════════════════════╗
║                BIRUCYBER TERMINAL v2.0.1337                    ║
║                AUTHORIZED PERSONNEL ONLY                       ║
╚══════════════════════════════════════════════════════════════╝

Initializing security protocols...
[+] Neural interface connected
[+] Encryption keys loaded
[+] Anonymous routing established
[+] Firewall disabled
[+] System ready

Last login: ${isClient ? currentTime : 'Loading...'}
Type 'help' for available commands.`}
              </pre>
            </div>

            {/* Command History */}
            {commandHistory.map((item, index) => (
              <div key={index} style={{ marginBottom: '1rem' }}>
                <div style={{ color: '#00ff00' }}>
                  root@birucyber:~$ {item.cmd}
                </div>
                <div style={{ color: '#ffffff', whiteSpace: 'pre-wrap' }}>
                  {item.response}
                </div>
              </div>
            ))}

            {/* Current Command Input */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#00ff00', marginRight: '0.5rem' }}>root@birucyber:~$</span>
              <input
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#00ff00',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                placeholder="Enter command..."
              />
            </div>
          </div>
        )}

        {/* Modules Tab */}
        {activeTab === 'modules' && (
          <div style={{ padding: '1rem', height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            <div style={{ marginBottom: '2rem' }}>
              <pre style={{ color: '#00ff00', margin: 0 }}>
{`╔══════════════════════════════════════════════════════════════╗
║                    EXPLOIT MODULES LOADED                      ║
╚══════════════════════════════════════════════════════════════╝`}
              </pre>
            </div>

            {/* SQL Injection Module */}
            <div style={{ border: '1px solid #00ff00', backgroundColor: 'rgba(0,255,0,0.05)', padding: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ color: '#ffff00', fontSize: '1.2rem', marginBottom: '1rem' }}>
                [SQL_INJECTION.exe]
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ color: '#00ff00', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>
                    Username:
                  </label>
                  <input
                    type="text"
                    value={sqlUsername}
                    onChange={(e) => setSqlUsername(e.target.value)}
                    placeholder="Enter username or ' OR '1'='1"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      border: '1px solid #00ff00',
                      color: '#00ff00',
                      fontFamily: 'Courier New, monospace',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: '#00ff00', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>
                    Password:
                  </label>
                  <input
                    type="text"
                    value={sqlPassword}
                    onChange={(e) => setSqlPassword(e.target.value)}
                    placeholder="Enter password or ' OR '1'='1"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      border: '1px solid #00ff00',
                      color: '#00ff00',
                      fontFamily: 'Courier New, monospace',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#00ff00', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>
                  Test Mode:
                </label>
                <select
                  value={sqlMode}
                  onChange={(e) => setSqlMode(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    border: '1px solid #00ff00',
                    color: '#00ff00',
                    fontFamily: 'Courier New, monospace'
                  }}
                >
                  <option value="safe">Safe Mode (Protected)</option>
                  <option value="vulnerable">Vulnerable Mode (Exploitable)</option>
                </select>
              </div>
              
              <button 
                onClick={testSQLInjection}
                disabled={sqlLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: sqlLoading ? 'rgba(0,255,0,0.3)' : 'transparent',
                  border: '1px solid #00ff00',
                  color: '#00ff00',
                  cursor: sqlLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '0.9rem',
                  marginRight: '1rem'
                }}
              >
                {sqlLoading ? '[TESTING...]' : '[EXECUTE SQL INJECTION]'}
              </button>
              
              <button 
                onClick={() => {
                  setSqlUsername("' OR '1'='1")
                  setSqlPassword("' OR '1'='1")
                  setSqlMode('vulnerable')
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #ffff00',
                  color: '#ffff00',
                  cursor: 'pointer',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '0.9rem'
                }}
              >
                [USE EXPLOIT PAYLOAD]
              </button>
              
              {sqlResult && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.7)', border: '1px solid #00ff00' }}>
                  <pre style={{ color: sqlResult.success ? '#00ff00' : '#ff0000', whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>
                    {JSON.stringify(sqlResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* XSS Module */}
            <div style={{ border: '1px solid #00ff00', backgroundColor: 'rgba(0,255,0,0.05)', padding: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ color: '#ffff00', fontSize: '1.2rem', marginBottom: '1rem' }}>
                [XSS_PAYLOAD.exe]
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#00ff00', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>
                  Author:
                </label>
                <input
                  type="text"
                  value={xssAuthor}
                  onChange={(e) => setXssAuthor(e.target.value)}
                  placeholder="Enter author name"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    border: '1px solid #00ff00',
                    color: '#00ff00',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#00ff00', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>
                  Comment:
                </label>
                <textarea
                  value={xssComment}
                  onChange={(e) => setXssComment(e.target.value)}
                  placeholder="Enter comment or <script>alert('XSS')</script>"
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    border: '1px solid #00ff00',
                    color: '#00ff00',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '0.9rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#00ff00', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>
                  Test Mode:
                </label>
                <select
                  value={xssMode}
                  onChange={(e) => setXssMode(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    border: '1px solid #00ff00',
                    color: '#00ff00',
                    fontFamily: 'Courier New, monospace'
                  }}
                >
                  <option value="safe">Safe Mode (Sanitized)</option>
                  <option value="vulnerable">Vulnerable Mode (No Sanitization)</option>
                </select>
              </div>
              
              <button 
                onClick={testXSS}
                disabled={xssLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: xssLoading ? 'rgba(0,255,0,0.3)' : 'transparent',
                  border: '1px solid #00ff00',
                  color: '#00ff00',
                  cursor: xssLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '0.9rem',
                  marginRight: '1rem'
                }}
              >
                {xssLoading ? '[TESTING...]' : '[EXECUTE XSS ATTACK]'}
              </button>
              
              <button 
                onClick={() => {
                  setXssComment("<script>alert('XSS Vulnerability Detected!')</script>")
                  setXssAuthor("Hacker")
                  setXssMode('vulnerable')
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #ffff00',
                  color: '#ffff00',
                  cursor: 'pointer',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '0.9rem'
                }}
              >
                [USE EXPLOIT PAYLOAD]
              </button>
              
              {xssResult && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.7)', border: '1px solid #00ff00' }}>
                  <pre style={{ color: xssResult.success ? '#00ff00' : '#ff0000', whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>
                    {JSON.stringify(xssResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Access Control Module */}
            <div style={{ border: '1px solid #00ff00', backgroundColor: 'rgba(0,255,0,0.05)', padding: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ color: '#ffff00', fontSize: '1.2rem', marginBottom: '1rem' }}>
                [ACCESS_BYPASS.exe]
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#00ff00', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>
                  Resource Path:
                </label>
                <input
                  type="text"
                  value={acResource}
                  onChange={(e) => setAcResource(e.target.value)}
                  placeholder="/admin or /admin?admin=true"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    border: '1px solid #00ff00',
                    color: '#00ff00',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#00ff00', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>
                  User Token:
                </label>
                <select
                  value={acUserToken}
                  onChange={(e) => setAcUserToken(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    border: '1px solid #00ff00',
                    color: '#00ff00',
                    fontFamily: 'Courier New, monospace'
                  }}
                >
                  <option value="admin-token-123">Admin Token (Full Access)</option>
                  <option value="user-token-456">User Token (Limited Access)</option>
                  <option value="guest-token-789">Guest Token (Public Only)</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#00ff00', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>
                  Test Mode:
                </label>
                <select
                  value={acMode}
                  onChange={(e) => setAcMode(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    border: '1px solid #00ff00',
                    color: '#00ff00',
                    fontFamily: 'Courier New, monospace'
                  }}
                >
                  <option value="safe">Safe Mode (Proper Validation)</option>
                  <option value="vulnerable">Vulnerable Mode (Bypassable)</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#00ff00', fontSize: '0.8rem', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={acBypass}
                    onChange={(e) => setAcBypass(e.target.checked)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Attempt Bypass
                </label>
              </div>
              
              <button 
                onClick={testAccessControl}
                disabled={acLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: acLoading ? 'rgba(0,255,0,0.3)' : 'transparent',
                  border: '1px solid #00ff00',
                  color: '#00ff00',
                  cursor: acLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '0.9rem',
                  marginRight: '1rem'
                }}
              >
                {acLoading ? '[TESTING...]' : '[EXECUTE ACCESS BYPASS]'}
              </button>
              
              <button 
                onClick={() => {
                  setAcResource('/admin?admin=true')
                  setAcUserToken('guest-token-789')
                  setAcMode('vulnerable')
                  setAcBypass(true)
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #ffff00',
                  color: '#ffff00',
                  cursor: 'pointer',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '0.9rem'
                }}
              >
                [USE EXPLOIT PAYLOAD]
              </button>
              
              {acResult && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.7)', border: '1px solid #00ff00' }}>
                  <pre style={{ color: acResult.success ? '#00ff00' : '#ff0000', whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>
                    {JSON.stringify(acResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scan Tab - Dashboard */}
        {activeTab === 'scan' && (
          <div style={{ padding: '1rem', height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <pre style={{ color: '#00ff00', margin: 0 }}>
{`╔══════════════════════════════════════════════════════════════╗
║                   SECURITY DASHBOARD                            ║
╚══════════════════════════════════════════════════════════════╝`}
              </pre>
              <button
                onClick={fetchDashboard}
                disabled={dashboardLoading}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  border: '1px solid #00ff00',
                  color: '#00ff00',
                  cursor: dashboardLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '0.8rem'
                }}
              >
                {dashboardLoading ? '[REFRESHING...]' : '[REFRESH]'}
              </button>
            </div>

            {dashboardData && dashboardData.success && (
              <>
                {/* Security Score */}
                <div style={{ border: '2px solid #00ff00', backgroundColor: 'rgba(0,255,0,0.05)', padding: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ color: '#ffff00', fontSize: '1.2rem', marginBottom: '1rem', textAlign: 'center' }}>
                    [SECURITY SCORE]
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      color: dashboardData.data.security.score >= 80 ? '#00ff00' : dashboardData.data.security.score >= 50 ? '#ffff00' : '#ff0000',
                      fontSize: '4rem',
                      fontWeight: 'bold'
                    }}>
                      {dashboardData.data.security.score}
                    </div>
                    <div style={{ color: '#00ff00', fontSize: '1rem' }}>
                      {dashboardData.data.security.score >= 80 ? '[SECURE]' : dashboardData.data.security.score >= 50 ? '[WARNING]' : '[CRITICAL]'}
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem', color: '#ff9900', fontSize: '0.9rem', textAlign: 'center' }}>
                    Recent Threats (24h): {dashboardData.data.security.recentThreats}
                  </div>
                </div>

                {/* Statistics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ border: '1px solid #00ff00', backgroundColor: 'rgba(0,255,0,0.05)', padding: '1rem' }}>
                    <div style={{ color: '#ffff00', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      [TOTAL USERS]
                    </div>
                    <div style={{ color: '#00ff00', fontSize: '2rem', fontWeight: 'bold' }}>
                      {dashboardData.data.users.total}
                    </div>
                    <div style={{ color: '#00ffff', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                      Admin: {dashboardData.data.users.admin} | User: {dashboardData.data.users.regular} | Guest: {dashboardData.data.users.guest}
                    </div>
                  </div>

                  <div style={{ border: '1px solid #00ff00', backgroundColor: 'rgba(0,255,0,0.05)', padding: '1rem' }}>
                    <div style={{ color: '#ffff00', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      [SECURITY LOGS]
                    </div>
                    <div style={{ color: '#00ff00', fontSize: '2rem', fontWeight: 'bold' }}>
                      {dashboardData.data.security.totalLogs}
                    </div>
                    <div style={{ color: '#00ffff', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                      Total events logged
                    </div>
                  </div>

                  <div style={{ border: '1px solid #00ff00', backgroundColor: 'rgba(0,255,0,0.05)', padding: '1rem' }}>
                    <div style={{ color: '#ffff00', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      [TOTAL POSTS]
                    </div>
                    <div style={{ color: '#00ff00', fontSize: '2rem', fontWeight: 'bold' }}>
                      {dashboardData.data.content.posts.total}
                    </div>
                    <div style={{ color: '#00ffff', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                      Published: {dashboardData.data.content.posts.published} | Draft: {dashboardData.data.content.posts.draft}
                    </div>
                  </div>

                  <div style={{ border: '1px solid #00ff00', backgroundColor: 'rgba(0,255,0,0.05)', padding: '1rem' }}>
                    <div style={{ color: '#ffff00', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      [COMMENTS]
                    </div>
                    <div style={{ color: '#00ff00', fontSize: '2rem', fontWeight: 'bold' }}>
                      {dashboardData.data.content.comments}
                    </div>
                    <div style={{ color: '#00ffff', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                      Total comments posted
                    </div>
                  </div>
                </div>

                {/* Vulnerabilities */}
                <div style={{ border: '1px solid #00ff00', backgroundColor: 'rgba(0,255,0,0.05)', padding: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ color: '#ffff00', fontSize: '1.1rem', marginBottom: '1rem' }}>
                    [VULNERABILITY DETECTION]
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #ff9900', backgroundColor: 'rgba(255,153,0,0.05)' }}>
                      <div style={{ color: '#ff9900', fontSize: '0.8rem', marginBottom: '0.5rem' }}>SQL Injection</div>
                      <div style={{ color: '#00ff00', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {dashboardData.data.vulnerabilities.sqlInjection.detected}
                      </div>
                      <div style={{ color: '#ffff00', fontSize: '0.7rem' }}>
                        Blocked: {dashboardData.data.vulnerabilities.sqlInjection.blocked}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #ff9900', backgroundColor: 'rgba(255,153,0,0.05)' }}>
                      <div style={{ color: '#ff9900', fontSize: '0.8rem', marginBottom: '0.5rem' }}>XSS Attack</div>
                      <div style={{ color: '#00ff00', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {dashboardData.data.vulnerabilities.xss.detected}
                      </div>
                      <div style={{ color: '#ffff00', fontSize: '0.7rem' }}>
                        Blocked: {dashboardData.data.vulnerabilities.xss.blocked}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #ff9900', backgroundColor: 'rgba(255,153,0,0.05)' }}>
                      <div style={{ color: '#ff9900', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Access Control</div>
                      <div style={{ color: '#00ff00', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {dashboardData.data.vulnerabilities.accessControl.detected}
                      </div>
                      <div style={{ color: '#ffff00', fontSize: '0.7rem' }}>
                        Blocked: {dashboardData.data.vulnerabilities.accessControl.blocked}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                {dashboardData.data.security.recentActivity && dashboardData.data.security.recentActivity.length > 0 && (
                  <div style={{ border: '1px solid #00ff00', backgroundColor: 'rgba(0,255,0,0.05)', padding: '1.5rem' }}>
                    <div style={{ color: '#ffff00', fontSize: '1.1rem', marginBottom: '1rem' }}>
                      [RECENT ACTIVITY]
                    </div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {dashboardData.data.security.recentActivity.map((log: any, index: number) => (
                        <div key={index} style={{ 
                          marginBottom: '0.75rem', 
                          padding: '0.75rem', 
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          border: '1px solid #00ff00'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                            <span style={{ color: '#ff9900', fontSize: '0.85rem', fontWeight: 'bold' }}>
                              [{log.eventType}]
                            </span>
                            <span style={{ color: '#00ffff', fontSize: '0.75rem' }}>
                              {log.severity?.toUpperCase() || 'MEDIUM'}
                            </span>
                          </div>
                          <div style={{ color: '#00ff00', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                            {log.description}
                          </div>
                          <div style={{ color: '#ffff00', fontSize: '0.7rem' }}>
                            IP: {log.ipAddress} | Time: {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* System Info */}
                <div style={{ border: '1px solid #00ff00', backgroundColor: 'rgba(0,255,0,0.05)', padding: '1.5rem', marginTop: '2rem' }}>
                  <div style={{ color: '#ffff00', fontSize: '1.1rem', marginBottom: '1rem' }}>
                    [SYSTEM INFORMATION]
                  </div>
                  <pre style={{ color: '#00ff00', fontSize: '0.85rem', margin: 0 }}>
{`Platform: ${dashboardData.data.system.platform}
Node Version: ${dashboardData.data.system.nodeVersion}
Uptime: ${Math.floor(dashboardData.data.system.uptime / 3600)}h ${Math.floor((dashboardData.data.system.uptime % 3600) / 60)}m
Memory Usage: ${Math.round(dashboardData.data.system.memory.heapUsed / 1024 / 1024)}MB / ${Math.round(dashboardData.data.system.memory.heapTotal / 1024 / 1024)}MB`}
                  </pre>
                </div>
              </>
            )}

            {dashboardLoading && (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#00ff00', fontSize: '1.2rem' }}>
                [LOADING DASHBOARD DATA...]
              </div>
            )}
          </div>
        )}

        {/* Exploits Tab */}
        {activeTab === 'exploits' && (
          <div style={{ padding: '1rem' }}>
            <pre style={{ color: '#00ff00', margin: 0 }}>
{`╔══════════════════════════════════════════════════════════════╗
║                    ACTIVE EXPLOITS                              ║
╚══════════════════════════════════════════════════════════════╝

[+] LOADING EXPLOIT DATABASE...
[+] 1337 exploits loaded
[+] 42 zero-day exploits available
[+] 8192 payload combinations

SELECT EXPLOIT CATEGORY:
1. SQL Injection Attacks
2. Cross-Site Scripting (XSS)
3. Buffer Overflow Exploits
4. Privilege Escalation
5. Denial of Service (DoS)
6. Remote Code Execution
7. Cryptographic Attacks
8. Social Engineering Toolkit

Enter selection number or type 'back' to return`}
            </pre>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div style={{ padding: '1rem' }}>
            <pre style={{ color: '#00ff00', margin: 0 }}>
{`╔══════════════════════════════════════════════════════════════╗
║                     SYSTEM LOGS                                 ║
╚══════════════════════════════════════════════════════════════╝

[2025-11-02T16:24:00.000Z] [INFO] System initialized
[2025-11-02T16:24:01.000Z] [INFO] Neural interface connected
[2025-11-02T16:24:02.000Z] [INFO] Encryption protocols active
[2025-11-02T16:24:03.000Z] [WARN] Firewall status: DISABLED
[2025-11-02T16:24:04.000Z] [INFO] Anonymous routing established
[2025-11-02T16:24:05.000Z] [INFO] VPN connection: ACTIVE
[2025-11-02T16:24:06.000Z] [SUCCESS] All exploit modules loaded
[2025-11-02T16:24:07.000Z] [INFO] System ready for operations
[2025-11-02T16:24:08.000Z] [ALERT] Intrusion detection system: OFFLINE
[2025-11-02T16:24:09.000Z] [SUCCESS] Cloaking mode: ENGAGED

[+] Last breach attempt: None detected
[+] Systems compromised: 0
[+] Data exfiltrated: 0GB
[+] Anonymous level: MAXIMUM
[+] Trace probability: 0.001%

END OF LOG - ${isClient ? new Date().toLocaleTimeString() : '16:24:10'}`}
            </pre>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        @keyframes fall {
          to { transform: translateY(100vh); }
        }

        input::placeholder {
          color: rgba(0, 255, 0, 0.5);
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #000000;
        }

        ::-webkit-scrollbar-thumb {
          background: #00ff00;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #00cc00;
        }
      `}</style>
    </div>
  )
}