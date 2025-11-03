'use client'

import { useState, useEffect } from 'react'
import UserRegistrationForm from '@/components/UserRegistrationForm'

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
  
  // User Management states
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserName, setNewUserName] = useState('')
  const [newUserRole, setNewUserRole] = useState('USER')
  const [userManagementResult, setUserManagementResult] = useState<any>(null)
  const [userManagementLoading, setUserManagementLoading] = useState(false)
  const [allUsers, setAllUsers] = useState<any[]>([])
  
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

  // User Management Functions
  const fetchAllUsers = async () => {
    setUserManagementLoading(true)
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      if (data.success) {
        setAllUsers(data.users)
      }
    } catch (error: any) {
      console.error('Failed to fetch users:', error)
    } finally {
      setUserManagementLoading(false)
    }
  }

  const createUser = async () => {
    setUserManagementLoading(true)
    setUserManagementResult(null)
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUserEmail,
          name: newUserName,
          role: newUserRole
        })
      })
      const data = await response.json()
      setUserManagementResult(data)
      
      if (data.success) {
        // Clear form
        setNewUserEmail('')
        setNewUserName('')
        setNewUserRole('USER')
        // Refresh user list
        fetchAllUsers()
      }
    } catch (error: any) {
      setUserManagementResult({ 
        success: false, 
        error: 'Failed to create user: ' + (error?.message || 'Unknown error') 
      })
    } finally {
      setUserManagementLoading(false)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        fetchAllUsers()
        setUserManagementResult(data)
      }
    } catch (error: any) {
      setUserManagementResult({ 
        success: false, 
        error: 'Failed to delete user: ' + (error?.message || 'Unknown error') 
      })
    }
  }

  // Load users when switching to user management tab
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAllUsers()
    }
  }, [activeTab])

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
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1f 25%, #0a1a2f 50%, #0f0a1a 75%, #0a0a0a 100%)',
      color: '#00ff00', 
      fontFamily: 'Courier New, monospace',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Gradient Background - Simplified */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.08) 0%, transparent 60%)',
        zIndex: 0,
      }} />
      
      {/* Grid Pattern Overlay - Simplified */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.02) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        zIndex: 0,
      }} />
      
      {/* Scanlines Effect - Simplified and Static */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'repeating-linear-gradient(0deg, rgba(0,255,0,0.02) 0px, transparent 2px)',
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
          borderBottom: '3px solid',
          borderImage: 'linear-gradient(90deg, #00ff00, #00ffff, #ff00ff, #00ff00) 1',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(10,10,30,0.90) 100%)',
          boxShadow: '0 4px 20px rgba(0, 255, 255, 0.2)',
          backdropFilter: 'blur(5px)', 
          padding: '1rem' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ 
                  width: '14px', 
                  height: '14px', 
                  backgroundColor: '#ff0000', 
                  borderRadius: '50%',
                  boxShadow: '0 0 8px #ff0000',
                  animation: 'pulse 3s ease-in-out infinite'
                }}></div>
                <div style={{ 
                  width: '14px', 
                  height: '14px', 
                  backgroundColor: '#ffff00', 
                  borderRadius: '50%',
                  boxShadow: '0 0 8px #ffff00',
                  animation: 'pulse 3s ease-in-out infinite 0.5s'
                }}></div>
                <div style={{ 
                  width: '14px', 
                  height: '14px', 
                  backgroundColor: '#00ff00', 
                  borderRadius: '50%',
                  boxShadow: '0 0 8px #00ff00',
                  animation: 'pulse 2s ease-in-out infinite 0.6s'
                }}></div>
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  background: 'linear-gradient(90deg, #00ff00, #00ffff, #00ff00)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'Courier New, monospace',
                  margin: 0,
                  filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.5))',
                  letterSpacing: '2px'
                }}>
                  {displayText}
                  <span style={{ 
                    animation: 'blink 1s infinite',
                    color: '#00ffff',
                    textShadow: '0 0 10px #00ffff'
                  }}>▮</span>
                </h1>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', alignItems: 'center' }}>
              <span style={{ 
                color: '#ffff00',
                textShadow: '0 0 10px #ffff00, 0 0 20px #ffff00, 0 0 30px #ff9900',
                padding: '6px 16px',
                border: '2px solid transparent',
                borderImage: 'linear-gradient(135deg, #ffff00, #ff9900) 1',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, rgba(255, 255, 0, 0.2), rgba(255, 153, 0, 0.1))',
                boxShadow: '0 0 20px rgba(255, 255, 0, 0.4), inset 0 0 20px rgba(255, 255, 0, 0.1)',
                animation: 'flicker 4s ease-in-out infinite',
                fontWeight: 'bold',
                letterSpacing: '1px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <span style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  animation: 'slideGlow 3s ease-in-out infinite'
                }}></span>
                🔐 ENCRYPTED
              </span>
              <span style={{ 
                color: '#00ff00',
                textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00',
                padding: '6px 16px',
                border: '2px solid transparent',
                borderImage: 'linear-gradient(135deg, #00ff00, #00ffff) 1',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, rgba(0, 255, 0, 0.2), rgba(0, 255, 255, 0.1))',
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.4), inset 0 0 20px rgba(0, 255, 0, 0.1)',
                animation: 'flicker 3s ease-in-out infinite',
                fontWeight: 'bold',
                letterSpacing: '1px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <span style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  animation: 'slideGlow 2.5s ease-in-out infinite'
                }}></span>
                👤 ANONYMOUS
              </span>
              <span style={{ 
                color: '#00ffff',
                textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #ff00ff',
                padding: '6px 16px',
                border: '2px solid transparent',
                borderImage: 'linear-gradient(135deg, #00ffff, #ff00ff) 1',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.1))',
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(0, 255, 255, 0.1)',
                animation: 'electricArc 3s ease-in-out infinite',
                fontWeight: 'bold',
                letterSpacing: '1px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <span style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                  animation: 'slideGlow 2s ease-in-out infinite'
                }}></span>
                ⚡ ONLINE
              </span>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '2px', 
          background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(10,10,30,0.90) 100%)',
          borderBottom: '2px solid',
          borderImage: 'linear-gradient(90deg, #00ff00, #00ffff, #ff00ff, #00ff00) 1',
          padding: '0.5rem',
          backdropFilter: 'blur(10px)'
        }}>
          {[
            { id: 'terminal', icon: '💻', label: 'TERMINAL' },
            { id: 'modules', icon: '🔧', label: 'MODULES' },
            { id: 'scan', icon: '🔍', label: 'SCANNER' },
            { id: 'exploits', icon: '⚔️', label: 'EXPLOITS' },
            { id: 'logs', icon: '�', label: 'USER MGMT' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem 2rem',
                fontSize: '0.9rem',
                fontFamily: 'Courier New, monospace',
                fontWeight: 'bold',
                letterSpacing: '1px',
                border: activeTab === tab.id ? '2px solid' : '2px solid transparent',
                borderImage: activeTab === tab.id ? 'linear-gradient(135deg, #00ff00, #00ffff) 1' : 'none',
                cursor: 'pointer',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, rgba(0, 255, 0, 0.2), rgba(0, 255, 255, 0.2))' 
                  : 'rgba(0, 0, 0, 0.5)',
                color: activeTab === tab.id ? '#00ffff' : '#00ff00',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                boxShadow: activeTab === tab.id 
                  ? '0 0 20px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(0, 255, 255, 0.1)' 
                  : 'none',
                textShadow: activeTab === tab.id ? '0 0 10px #00ffff' : 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'rgba(0, 255, 0, 0.1)'
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.3)'
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span>
              {tab.label}
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
            <div style={{ 
              border: '3px solid transparent',
              borderImage: 'linear-gradient(135deg, #00ff00, #00ffff, #00ff00) 1',
              background: 'linear-gradient(135deg, rgba(0,255,0,0.08), rgba(0,255,255,0.05))',
              padding: '2rem', 
              marginBottom: '2rem',
              borderRadius: '12px',
              boxShadow: '0 0 40px rgba(0, 255, 0, 0.3), inset 0 0 40px rgba(0, 0, 0, 0.4)',
              position: 'relative',
              overflow: 'hidden',
              animation: 'borderGlow 4s ease-in-out infinite'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'conic-gradient(from 0deg, transparent, rgba(0, 255, 0, 0.1), transparent 30%)',
                animation: 'rotate3d 8s linear infinite',
                pointerEvents: 'none'
              }} />
              <div style={{ 
                color: '#00ff00', 
                fontSize: '1.8rem', 
                marginBottom: '1.5rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '4px',
                textShadow: '0 0 20px rgba(0, 255, 0, 1), 0 0 40px rgba(0, 255, 0, 0.6), 0 0 60px rgba(0, 255, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                position: 'relative',
                zIndex: 1,
                animation: 'neonPulse 3s ease-in-out infinite'
              }}>
                <span style={{ fontSize: '2rem' }}>💉</span>
                [SQL_INJECTION.exe]
                <span style={{ fontSize: '2rem' }}>💉</span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ 
                    color: '#00ffff', 
                    fontSize: '0.9rem', 
                    fontWeight: 'bold',
                    display: 'block', 
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
                  }}>
                    🔐 Username:
                  </label>
                  <input
                    type="text"
                    value={sqlUsername}
                    onChange={(e) => setSqlUsername(e.target.value)}
                    placeholder="Enter username or ' OR '1'='1"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(10,10,30,0.9))',
                      border: '2px solid transparent',
                      borderImage: 'linear-gradient(135deg, #00ff00, #00ffff) 1',
                      color: '#00ffff',
                      fontFamily: 'Courier New, monospace',
                      fontSize: '1rem',
                      borderRadius: '4px',
                      boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 255, 255, 0.4)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 255, 255, 0.2)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  />
                </div>
                <div>
                  <label style={{ 
                    color: '#00ffff', 
                    fontSize: '0.9rem', 
                    fontWeight: 'bold',
                    display: 'block', 
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
                  }}>
                    🔑 Password:
                  </label>
                  <input
                    type="text"
                    value={sqlPassword}
                    onChange={(e) => setSqlPassword(e.target.value)}
                    placeholder="Enter password or ' OR '1'='1"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(10,10,30,0.9))',
                      border: '2px solid transparent',
                      borderImage: 'linear-gradient(135deg, #00ff00, #00ffff) 1',
                      color: '#00ffff',
                      fontFamily: 'Courier New, monospace',
                      fontSize: '1rem',
                      borderRadius: '4px',
                      boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 255, 255, 0.4)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 255, 255, 0.2)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  color: '#00ffff', 
                  fontSize: '0.9rem', 
                  fontWeight: 'bold',
                  display: 'block', 
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
                }}>
                  ⚙️ Test Mode:
                </label>
                <select
                  value={sqlMode}
                  onChange={(e) => setSqlMode(e.target.value)}
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(10,10,30,0.9))',
                    border: '2px solid transparent',
                    borderImage: 'linear-gradient(135deg, #ff00ff, #00ffff) 1',
                    color: '#00ffff',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '1rem',
                    borderRadius: '4px',
                    boxShadow: '0 0 15px rgba(255, 0, 255, 0.3)',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 0, 255, 0.5)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 0, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
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
                  padding: '1rem 2rem',
                  background: sqlLoading 
                    ? 'linear-gradient(135deg, rgba(0,255,0,0.3), rgba(0,255,255,0.3))'
                    : 'linear-gradient(135deg, rgba(0,255,0,0.1), rgba(0,255,255,0.1))',
                  border: '2px solid',
                  borderImage: 'linear-gradient(135deg, #00ff00, #00ffff) 1',
                  color: sqlLoading ? '#ffff00' : '#00ffff',
                  cursor: sqlLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  marginRight: '1rem',
                  textShadow: sqlLoading ? '0 0 10px #ffff00' : '0 0 10px #00ffff',
                  boxShadow: sqlLoading 
                    ? '0 0 20px rgba(255, 255, 0, 0.5), inset 0 0 20px rgba(255, 255, 0, 0.1)'
                    : '0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.05)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  letterSpacing: '1px'
                }}
                onMouseEnter={(e) => {
                  if (!sqlLoading) {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.6), inset 0 0 30px rgba(0, 255, 255, 0.1)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!sqlLoading) {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.05)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }
                }}
              >
                {sqlLoading ? '⚡ TESTING...' : '🚀 EXECUTE SQL INJECTION'}
              </button>
              
              <button 
                onClick={() => {
                  setSqlUsername("' OR '1'='1")
                  setSqlPassword("' OR '1'='1")
                  setSqlMode('vulnerable')
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, rgba(255,255,0,0.1), rgba(255,150,0,0.1))',
                  border: '2px solid transparent',
                  borderImage: 'linear-gradient(135deg, #ffff00, #ff9900) 1',
                  color: '#ffff00',
                  cursor: 'pointer',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  boxShadow: '0 0 15px rgba(255, 255, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  textShadow: '0 0 10px rgba(255, 255, 0, 0.5)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 255, 0, 0.6)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 255, 0, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                💥 [USE EXPLOIT PAYLOAD]
              </button>
              
              {sqlResult && (
                <div style={{ 
                  marginTop: '2rem', 
                  padding: '1.5rem', 
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(10,30,10,0.9))',
                  border: '2px solid transparent',
                  borderImage: `linear-gradient(135deg, ${sqlResult.success ? '#00ff00' : '#ff0000'}, ${sqlResult.success ? '#00ffff' : '#ff6600'}) 1`,
                  borderRadius: '8px',
                  boxShadow: `0 0 30px ${sqlResult.success ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)'}, inset 0 0 30px rgba(0, 0, 0, 0.5)`,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, transparent, ${sqlResult.success ? '#00ff00' : '#ff0000'}, transparent)`,
                    animation: 'shimmer 2s infinite'
                  }} />
                  <div style={{
                    color: '#00ffff',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {sqlResult.success ? '✅ ATTACK SUCCESSFUL' : '❌ ATTACK BLOCKED'}
                  </div>
                  <pre style={{ 
                    color: sqlResult.success ? '#00ff00' : '#ff6600', 
                    whiteSpace: 'pre-wrap', 
                    fontSize: '0.9rem',
                    fontFamily: 'Courier New, monospace',
                    lineHeight: '1.6',
                    textShadow: `0 0 5px ${sqlResult.success ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 102, 0, 0.3)'}`,
                    margin: 0
                  }}>
                    {JSON.stringify(sqlResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* XSS Module */}
            <div style={{ 
              border: '3px solid transparent',
              borderImage: 'linear-gradient(135deg, #ff00ff, #00ffff, #ff00ff) 1',
              background: 'linear-gradient(135deg, rgba(255,0,255,0.08), rgba(0,255,255,0.05))',
              padding: '2rem', 
              marginBottom: '2rem',
              borderRadius: '12px',
              boxShadow: '0 0 40px rgba(255, 0, 255, 0.3), inset 0 0 40px rgba(0, 0, 0, 0.4)',
              position: 'relative',
              overflow: 'hidden',
              animation: 'electricArc 4s ease-in-out infinite'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background: 'conic-gradient(from 180deg, transparent, rgba(255, 0, 255, 0.1), transparent 30%)',
                animation: 'rotate3d 10s linear infinite reverse',
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #ff00ff, #00ffff, #ff00ff, transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s infinite'
              }} />
              <div style={{ 
                color: '#ff00ff', 
                fontSize: '1.8rem', 
                marginBottom: '1.5rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '4px',
                textShadow: '0 0 20px rgba(255, 0, 255, 1), 0 0 40px rgba(255, 0, 255, 0.6), 0 0 60px rgba(255, 0, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                position: 'relative',
                zIndex: 1,
                animation: 'neonPulse 2.5s ease-in-out infinite'
              }}>
                <span style={{ fontSize: '2rem' }}>⚡</span>
                [XSS_PAYLOAD.exe]
                <span style={{ fontSize: '2rem' }}>⚡</span>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  color: '#ff00ff', 
                  fontSize: '0.9rem', 
                  fontWeight: 'bold',
                  display: 'block', 
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  textShadow: '0 0 10px rgba(255, 0, 255, 0.5)'
                }}>
                  👤 Author:
                </label>
                <input
                  type="text"
                  value={xssAuthor}
                  onChange={(e) => setXssAuthor(e.target.value)}
                  placeholder="Enter author name"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(30,10,30,0.9))',
                    border: '2px solid transparent',
                    borderImage: 'linear-gradient(135deg, #ff00ff, #00ffff) 1',
                    color: '#ff00ff',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '1rem',
                    borderRadius: '4px',
                    boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 0, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 0 25px rgba(255, 0, 255, 0.4)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 0, 255, 0.2)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  color: '#ff00ff', 
                  fontSize: '0.9rem', 
                  fontWeight: 'bold',
                  display: 'block', 
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  textShadow: '0 0 10px rgba(255, 0, 255, 0.5)'
                }}>
                  💬 Comment:
                </label>
                <textarea
                  value={xssComment}
                  onChange={(e) => setXssComment(e.target.value)}
                  placeholder="Enter comment or <script>alert('XSS')</script>"
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(30,10,30,0.9))',
                    border: '2px solid transparent',
                    borderImage: 'linear-gradient(135deg, #ff00ff, #00ffff) 1',
                    color: '#ff00ff',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '1rem',
                    resize: 'vertical',
                    borderRadius: '4px',
                    boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 0, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    lineHeight: '1.6'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 0 25px rgba(255, 0, 255, 0.4)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 0, 255, 0.2)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  color: '#ff00ff', 
                  fontSize: '0.9rem', 
                  fontWeight: 'bold',
                  display: 'block', 
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  textShadow: '0 0 10px rgba(255, 0, 255, 0.5)'
                }}>
                  ⚙️ Test Mode:
                </label>
                <select
                  value={xssMode}
                  onChange={(e) => setXssMode(e.target.value)}
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(30,10,30,0.9))',
                    border: '2px solid transparent',
                    borderImage: 'linear-gradient(135deg, #ff00ff, #00ffff) 1',
                    color: '#ff00ff',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '1rem',
                    borderRadius: '4px',
                    boxShadow: '0 0 15px rgba(255, 0, 255, 0.3)',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 0, 255, 0.5)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 0, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
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
                  padding: '1rem 2rem',
                  background: xssLoading 
                    ? 'linear-gradient(135deg, rgba(255,0,255,0.3), rgba(0,255,255,0.3))'
                    : 'linear-gradient(135deg, rgba(255,0,255,0.1), rgba(0,255,255,0.1))',
                  border: '2px solid',
                  borderImage: 'linear-gradient(135deg, #ff00ff, #00ffff) 1',
                  color: xssLoading ? '#ffff00' : '#ff00ff',
                  cursor: xssLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  marginRight: '1rem',
                  textShadow: xssLoading ? '0 0 10px #ffff00' : '0 0 10px #ff00ff',
                  boxShadow: xssLoading 
                    ? '0 0 20px rgba(255, 255, 0, 0.5), inset 0 0 20px rgba(255, 255, 0, 0.1)'
                    : '0 0 20px rgba(255, 0, 255, 0.3), inset 0 0 20px rgba(255, 0, 255, 0.05)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  letterSpacing: '1px'
                }}
                onMouseEnter={(e) => {
                  if (!xssLoading) {
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 0, 255, 0.6), inset 0 0 30px rgba(255, 0, 255, 0.1)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!xssLoading) {
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 255, 0.3), inset 0 0 20px rgba(255, 0, 255, 0.05)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }
                }}
              >
                {xssLoading ? '⚡ TESTING...' : '🚀 EXECUTE XSS ATTACK'}
              </button>
              
              <button 
                onClick={() => {
                  setXssComment("<script>alert('XSS Vulnerability Detected!')</script>")
                  setXssAuthor("Hacker")
                  setXssMode('vulnerable')
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, rgba(255,255,0,0.1), rgba(255,150,0,0.1))',
                  border: '2px solid transparent',
                  borderImage: 'linear-gradient(135deg, #ffff00, #ff9900) 1',
                  color: '#ffff00',
                  cursor: 'pointer',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  boxShadow: '0 0 15px rgba(255, 255, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  textShadow: '0 0 10px rgba(255, 255, 0, 0.5)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 255, 0, 0.6)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 255, 0, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                💥 [USE EXPLOIT PAYLOAD]
              </button>
              
              {xssResult && (
                <div style={{ 
                  marginTop: '2rem', 
                  padding: '1.5rem', 
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(30,10,30,0.9))',
                  border: '2px solid transparent',
                  borderImage: `linear-gradient(135deg, ${xssResult.success ? '#ff00ff' : '#ff0000'}, ${xssResult.success ? '#00ffff' : '#ff6600'}) 1`,
                  borderRadius: '8px',
                  boxShadow: `0 0 30px ${xssResult.success ? 'rgba(255, 0, 255, 0.3)' : 'rgba(255, 0, 0, 0.3)'}, inset 0 0 30px rgba(0, 0, 0, 0.5)`,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, transparent, ${xssResult.success ? '#ff00ff' : '#ff0000'}, transparent)`,
                    animation: 'shimmer 2s infinite'
                  }} />
                  <div style={{
                    color: '#ff00ff',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    textShadow: '0 0 10px rgba(255, 0, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {xssResult.success ? '✅ ATTACK SUCCESSFUL' : '❌ ATTACK BLOCKED'}
                  </div>
                  <pre style={{ 
                    color: xssResult.success ? '#ff00ff' : '#ff6600', 
                    whiteSpace: 'pre-wrap', 
                    fontSize: '0.9rem',
                    fontFamily: 'Courier New, monospace',
                    lineHeight: '1.6',
                    textShadow: `0 0 5px ${xssResult.success ? 'rgba(255, 0, 255, 0.3)' : 'rgba(255, 102, 0, 0.3)'}`,
                    margin: 0
                  }}>
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
          <div style={{ padding: '1.5rem', height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            <pre style={{ color: '#00ff00', margin: '0 0 2rem 0', fontSize: '0.85rem' }}>
{`╔══════════════════════════════════════════════════════════════╗
║                    ACTIVE EXPLOITS                              ║
╚══════════════════════════════════════════════════════════════╝

[+] LOADING EXPLOIT DATABASE...
[+] 1337 exploits loaded
[+] 42 zero-day exploits available
[+] 8192 payload combinations`}
            </pre>

            {/* Exploit Categories Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {/* SQL Injection */}
              <div 
                onClick={() => setActiveTab('modules')}
                style={{
                  border: '2px solid #00ff00',
                  background: 'linear-gradient(135deg, rgba(0,255,0,0.1), rgba(0,0,0,0.8))',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.5)';
                  e.currentTarget.style.borderColor = '#00ffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.3)';
                  e.currentTarget.style.borderColor = '#00ff00';
                }}
              >
                <div style={{
                  color: '#00ff00',
                  fontSize: '2.5rem',
                  marginBottom: '1rem',
                  textAlign: 'center',
                  textShadow: '0 0 15px rgba(0, 255, 0, 0.8)'
                }}>
                  💉
                </div>
                <div style={{
                  color: '#00ffff',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  textAlign: 'center',
                  textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
                }}>
                  SQL INJECTION
                </div>
                <div style={{
                  color: '#00ff00',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  lineHeight: '1.5',
                  opacity: 0.8
                }}>
                  Exploit database queries & authentication bypass
                </div>
                <div style={{
                  marginTop: '1rem',
                  padding: '0.5rem',
                  background: 'rgba(0, 255, 0, 0.1)',
                  border: '1px solid rgba(0, 255, 0, 0.3)',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: '#ffff00',
                  textAlign: 'center'
                }}>
                  ⚡ 347 Payloads Available
                </div>
              </div>

              {/* XSS */}
              <div 
                onClick={() => setActiveTab('modules')}
                style={{
                  border: '2px solid #ff00ff',
                  background: 'linear-gradient(135deg, rgba(255,0,255,0.1), rgba(0,0,0,0.8))',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(255, 0, 255, 0.3)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 0, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 255, 0.3)';
                }}
              >
                <div style={{
                  color: '#ff00ff',
                  fontSize: '2.5rem',
                  marginBottom: '1rem',
                  textAlign: 'center',
                  textShadow: '0 0 15px rgba(255, 0, 255, 0.8)'
                }}>
                  ⚡
                </div>
                <div style={{
                  color: '#ff00ff',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  textAlign: 'center',
                  textShadow: '0 0 10px rgba(255, 0, 255, 0.5)'
                }}>
                  CROSS-SITE SCRIPTING
                </div>
                <div style={{
                  color: '#ff00ff',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  lineHeight: '1.5',
                  opacity: 0.8
                }}>
                  Inject malicious scripts into web pages
                </div>
                <div style={{
                  marginTop: '1rem',
                  padding: '0.5rem',
                  background: 'rgba(255, 0, 255, 0.1)',
                  border: '1px solid rgba(255, 0, 255, 0.3)',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: '#ffff00',
                  textAlign: 'center'
                }}>
                  ⚡ 523 Payloads Available
                </div>
              </div>

              {/* Access Control */}
              <div 
                onClick={() => setActiveTab('modules')}
                style={{
                  border: '2px solid #ffff00',
                  background: 'linear-gradient(135deg, rgba(255,255,0,0.1), rgba(0,0,0,0.8))',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(255, 255, 0, 0.3)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 255, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 255, 0, 0.3)';
                }}
              >
                <div style={{
                  color: '#ffff00',
                  fontSize: '2.5rem',
                  marginBottom: '1rem',
                  textAlign: 'center',
                  textShadow: '0 0 15px rgba(255, 255, 0, 0.8)'
                }}>
                  🔓
                </div>
                <div style={{
                  color: '#ffff00',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  textAlign: 'center',
                  textShadow: '0 0 10px rgba(255, 255, 0, 0.5)'
                }}>
                  ACCESS CONTROL BYPASS
                </div>
                <div style={{
                  color: '#ffff00',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  lineHeight: '1.5',
                  opacity: 0.8
                }}>
                  Privilege escalation & authorization bypass
                </div>
                <div style={{
                  marginTop: '1rem',
                  padding: '0.5rem',
                  background: 'rgba(255, 255, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 0, 0.3)',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: '#00ff00',
                  textAlign: 'center'
                }}>
                  ⚡ 156 Payloads Available
                </div>
              </div>

              {/* CSRF */}
              <div 
                style={{
                  border: '2px solid #ff6600',
                  background: 'linear-gradient(135deg, rgba(255,102,0,0.1), rgba(0,0,0,0.8))',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(255, 102, 0, 0.3)',
                  position: 'relative',
                  opacity: 0.6
                }}
              >
                <div style={{
                  color: '#ff6600',
                  fontSize: '2.5rem',
                  marginBottom: '1rem',
                  textAlign: 'center',
                  textShadow: '0 0 15px rgba(255, 102, 0, 0.8)'
                }}>
                  🎭
                </div>
                <div style={{
                  color: '#ff6600',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  textAlign: 'center',
                  textShadow: '0 0 10px rgba(255, 102, 0, 0.5)'
                }}>
                  CSRF ATTACKS
                </div>
                <div style={{
                  color: '#ff6600',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  lineHeight: '1.5',
                  opacity: 0.8
                }}>
                  Cross-site request forgery exploitation
                </div>
                <div style={{
                  marginTop: '1rem',
                  padding: '0.5rem',
                  background: 'rgba(255, 102, 0, 0.1)',
                  border: '1px solid rgba(255, 102, 0, 0.3)',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: '#999',
                  textAlign: 'center'
                }}>
                  🔒 Coming Soon
                </div>
              </div>

              {/* Remote Code Execution */}
              <div 
                style={{
                  border: '2px solid #ff0000',
                  background: 'linear-gradient(135deg, rgba(255,0,0,0.1), rgba(0,0,0,0.8))',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(255, 0, 0, 0.3)',
                  position: 'relative',
                  opacity: 0.6
                }}
              >
                <div style={{
                  color: '#ff0000',
                  fontSize: '2.5rem',
                  marginBottom: '1rem',
                  textAlign: 'center',
                  textShadow: '0 0 15px rgba(255, 0, 0, 0.8)'
                }}>
                  💀
                </div>
                <div style={{
                  color: '#ff0000',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  textAlign: 'center',
                  textShadow: '0 0 10px rgba(255, 0, 0, 0.5)'
                }}>
                  REMOTE CODE EXECUTION
                </div>
                <div style={{
                  color: '#ff0000',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  lineHeight: '1.5',
                  opacity: 0.8
                }}>
                  Execute arbitrary code on target systems
                </div>
                <div style={{
                  marginTop: '1rem',
                  padding: '0.5rem',
                  background: 'rgba(255, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 0, 0, 0.3)',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: '#999',
                  textAlign: 'center'
                }}>
                  🔒 Coming Soon
                </div>
              </div>

              {/* DoS Attacks */}
              <div 
                style={{
                  border: '2px solid #00ffff',
                  background: 'linear-gradient(135deg, rgba(0,255,255,0.1), rgba(0,0,0,0.8))',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
                  position: 'relative',
                  opacity: 0.6
                }}
              >
                <div style={{
                  color: '#00ffff',
                  fontSize: '2.5rem',
                  marginBottom: '1rem',
                  textAlign: 'center',
                  textShadow: '0 0 15px rgba(0, 255, 255, 0.8)'
                }}>
                  ⚠️
                </div>
                <div style={{
                  color: '#00ffff',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  textAlign: 'center',
                  textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
                }}>
                  DENIAL OF SERVICE
                </div>
                <div style={{
                  color: '#00ffff',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  lineHeight: '1.5',
                  opacity: 0.8
                }}>
                  Overwhelm services & system resources
                </div>
                <div style={{
                  marginTop: '1rem',
                  padding: '0.5rem',
                  background: 'rgba(0, 255, 255, 0.1)',
                  border: '1px solid rgba(0, 255, 255, 0.3)',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: '#999',
                  textAlign: 'center'
                }}>
                  🔒 Coming Soon
                </div>
              </div>
            </div>

            {/* Active Exploits Info */}
            <div style={{
              border: '2px solid #00ff00',
              background: 'rgba(0, 255, 0, 0.05)',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 0 20px rgba(0, 255, 0, 0.2)'
            }}>
              <div style={{
                color: '#00ffff',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
              }}>
                💡 QUICK ACCESS
              </div>
              <div style={{
                color: '#00ff00',
                fontSize: '0.9rem',
                lineHeight: '1.8',
                fontFamily: 'Courier New, monospace'
              }}>
                • Click on <span style={{color: '#00ffff', fontWeight: 'bold'}}>SQL INJECTION</span>, <span style={{color: '#ff00ff', fontWeight: 'bold'}}>XSS</span>, or <span style={{color: '#ffff00', fontWeight: 'bold'}}>ACCESS CONTROL</span> to access the MODULES tab<br/>
                • All active exploits are available in the MODULES section<br/>
                • Test in <span style={{color: '#ffff00'}}>Safe Mode</span> or <span style={{color: '#ff0000'}}>Vulnerable Mode</span><br/>
                • Use pre-loaded exploit payloads for quick testing<br/>
                • Monitor attack results in real-time
              </div>
            </div>

            {/* Stats Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginTop: '2rem'
            }}>
              <div style={{
                border: '1px solid #00ff00',
                background: 'rgba(0, 0, 0, 0.5)',
                padding: '1rem',
                textAlign: 'center',
                borderRadius: '4px'
              }}>
                <div style={{color: '#00ff00', fontSize: '2rem', fontWeight: 'bold'}}>1337</div>
                <div style={{color: '#00ffff', fontSize: '0.8rem'}}>Total Exploits</div>
              </div>
              <div style={{
                border: '1px solid #ff00ff',
                background: 'rgba(0, 0, 0, 0.5)',
                padding: '1rem',
                textAlign: 'center',
                borderRadius: '4px'
              }}>
                <div style={{color: '#ff00ff', fontSize: '2rem', fontWeight: 'bold'}}>42</div>
                <div style={{color: '#ff00ff', fontSize: '0.8rem'}}>Zero-Day Exploits</div>
              </div>
              <div style={{
                border: '1px solid #ffff00',
                background: 'rgba(0, 0, 0, 0.5)',
                padding: '1rem',
                textAlign: 'center',
                borderRadius: '4px'
              }}>
                <div style={{color: '#ffff00', fontSize: '2rem', fontWeight: 'bold'}}>8192</div>
                <div style={{color: '#ffff00', fontSize: '0.8rem'}}>Payload Combinations</div>
              </div>
              <div style={{
                border: '1px solid #00ffff',
                background: 'rgba(0, 0, 0, 0.5)',
                padding: '1rem',
                textAlign: 'center',
                borderRadius: '4px'
              }}>
                <div style={{color: '#00ffff', fontSize: '2rem', fontWeight: 'bold'}}>3</div>
                <div style={{color: '#00ffff', fontSize: '0.8rem'}}>Active Modules</div>
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'logs' && (
          <div style={{ padding: '2rem' }}>
            {/* Header */}
            <div style={{
              marginBottom: '2rem',
              borderBottom: '2px solid',
              borderImage: 'linear-gradient(90deg, #00ff00, #00ffff) 1',
              paddingBottom: '1rem'
            }}>
              <h2 style={{
                color: '#00ffff',
                fontSize: '2rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                textShadow: '0 0 20px rgba(0, 255, 255, 0.8)',
                margin: 0
              }}>
                👥 USER REGISTRATION & MANAGEMENT
              </h2>
              <p style={{
                color: '#00ff00',
                fontSize: '0.9rem',
                marginTop: '0.5rem',
                textShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
              }}>
                Complete user registration with XSS Testing & Access Control Testing fields
              </p>
            </div>

            {/* New User Registration Form */}
            <UserRegistrationForm />

            {/* Spacer */}
            <div style={{ height: '2rem' }} />

            {/* Old Add User Form - REMOVED, replaced with UserRegistrationForm above */}
            {/* Add User Form */}
            <div style={{
              border: '2px solid transparent',
              borderImage: 'linear-gradient(135deg, #00ff00, #00ffff) 1',
              background: 'linear-gradient(135deg, rgba(0,255,0,0.05), rgba(0,255,255,0.05))',
              padding: '2rem',
              marginBottom: '2rem',
              borderRadius: '8px',
              boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)'
            }}>
              <h3 style={{
                color: '#00ff00',
                fontSize: '1.3rem',
                marginBottom: '1.5rem',
                textShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
              }}>
                ➕ CREATE NEW USER
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{
                    color: '#00ffff',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    display: 'block',
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
                  }}>
                    📧 Email:
                  </label>
                  <input
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="user@example.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(10,10,30,0.9))',
                      border: '2px solid transparent',
                      borderImage: 'linear-gradient(135deg, #00ff00, #00ffff) 1',
                      color: '#00ffff',
                      fontFamily: 'Courier New, monospace',
                      fontSize: '1rem',
                      borderRadius: '4px',
                      boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 255, 255, 0.2)',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    color: '#00ffff',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    display: 'block',
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
                  }}>
                    👤 Name:
                  </label>
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Full Name"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(10,10,30,0.9))',
                      border: '2px solid transparent',
                      borderImage: 'linear-gradient(135deg, #00ff00, #00ffff) 1',
                      color: '#00ffff',
                      fontFamily: 'Courier New, monospace',
                      fontSize: '1rem',
                      borderRadius: '4px',
                      boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 255, 255, 0.2)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  color: '#00ffff',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  display: 'block',
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
                }}>
                  🔐 Role:
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(10,10,30,0.9))',
                    border: '2px solid transparent',
                    borderImage: 'linear-gradient(135deg, #ff00ff, #00ffff) 1',
                    color: '#00ffff',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '1rem',
                    borderRadius: '4px',
                    boxShadow: '0 0 15px rgba(255, 0, 255, 0.3)',
                    outline: 'none',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  <option value="USER">USER - Standard User</option>
                  <option value="ADMIN">ADMIN - Administrator</option>
                  <option value="GUEST">GUEST - Guest Access</option>
                </select>
              </div>

              <button
                onClick={createUser}
                disabled={userManagementLoading}
                style={{
                  padding: '1rem 2rem',
                  background: userManagementLoading
                    ? 'linear-gradient(135deg, rgba(0,255,0,0.3), rgba(0,255,255,0.3))'
                    : 'linear-gradient(135deg, rgba(0,255,0,0.1), rgba(0,255,255,0.1))',
                  border: '2px solid',
                  borderImage: 'linear-gradient(135deg, #00ff00, #00ffff) 1',
                  color: userManagementLoading ? '#ffff00' : '#00ffff',
                  cursor: userManagementLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Courier New, monospace',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  textShadow: userManagementLoading ? '0 0 10px #ffff00' : '0 0 10px #00ffff',
                  boxShadow: userManagementLoading
                    ? '0 0 20px rgba(255, 255, 0, 0.5)'
                    : '0 0 20px rgba(0, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  letterSpacing: '1px',
                  width: '100%'
                }}
              >
                {userManagementLoading ? '⚡ CREATING...' : '🚀 CREATE USER'}
              </button>

              {/* Result Message */}
              {userManagementResult && (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: userManagementResult.success
                    ? 'linear-gradient(135deg, rgba(0,255,0,0.1), rgba(0,255,255,0.1))'
                    : 'linear-gradient(135deg, rgba(255,0,0,0.1), rgba(255,102,0,0.1))',
                  border: '2px solid',
                  borderImage: userManagementResult.success
                    ? 'linear-gradient(135deg, #00ff00, #00ffff) 1'
                    : 'linear-gradient(135deg, #ff0000, #ff6600) 1',
                  borderRadius: '4px',
                  boxShadow: userManagementResult.success
                    ? '0 0 20px rgba(0, 255, 0, 0.3)'
                    : '0 0 20px rgba(255, 0, 0, 0.3)'
                }}>
                  <pre style={{
                    color: userManagementResult.success ? '#00ff00' : '#ff6600',
                    margin: 0,
                    fontFamily: 'Courier New, monospace',
                    fontSize: '0.9rem',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {JSON.stringify(userManagementResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Users List */}
            <div style={{
              border: '2px solid transparent',
              borderImage: 'linear-gradient(135deg, #ff00ff, #00ffff) 1',
              background: 'linear-gradient(135deg, rgba(255,0,255,0.05), rgba(0,255,255,0.05))',
              padding: '2rem',
              borderRadius: '8px',
              boxShadow: '0 0 30px rgba(255, 0, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{
                  color: '#ff00ff',
                  fontSize: '1.3rem',
                  margin: 0,
                  textShadow: '0 0 10px rgba(255, 0, 255, 0.5)'
                }}>
                  📋 ALL USERS ({allUsers.length})
                </h3>
                <button
                  onClick={fetchAllUsers}
                  disabled={userManagementLoading}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'linear-gradient(135deg, rgba(0,255,255,0.1), rgba(0,255,0,0.1))',
                    border: '2px solid #00ffff',
                    color: '#00ffff',
                    cursor: 'pointer',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '0.9rem',
                    borderRadius: '4px',
                    boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
                  }}
                >
                  🔄 REFRESH
                </button>
              </div>

              {userManagementLoading ? (
                <div style={{ color: '#ffff00', textAlign: 'center', padding: '2rem' }}>
                  ⚡ Loading users...
                </div>
              ) : allUsers.length === 0 ? (
                <div style={{ color: '#ff6600', textAlign: 'center', padding: '2rem' }}>
                  No users found
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {allUsers.map((user) => (
                    <div
                      key={user.id}
                      style={{
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.9), rgba(10,10,30,0.9))',
                        border: '1px solid rgba(0, 255, 255, 0.3)',
                        borderRadius: '4px',
                        padding: '1rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: '1rem',
                        alignItems: 'center',
                        boxShadow: '0 0 10px rgba(0, 255, 255, 0.1)'
                      }}
                    >
                      <div>
                        <div style={{ color: '#00ffff', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                          {user.name}
                        </div>
                        <div style={{ color: '#00ff00', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                          📧 {user.email}
                        </div>
                        <div style={{ color: '#ffff00', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                          👤 Username: {user.username}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                          <span style={{ color: user.role === 'ADMIN' ? '#ff00ff' : user.role === 'USER' ? '#00ffff' : '#ff9900' }}>
                            🔐 {user.role}
                          </span>
                          <span style={{ color: '#888' }}>
                            🕒 {new Date(user.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteUser(user.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'linear-gradient(135deg, rgba(255,0,0,0.1), rgba(255,102,0,0.1))',
                          border: '2px solid #ff0000',
                          color: '#ff0000',
                          cursor: 'pointer',
                          fontFamily: 'Courier New, monospace',
                          fontSize: '0.9rem',
                          borderRadius: '4px',
                          boxShadow: '0 0 10px rgba(255, 0, 0, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.6)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.3)'
                        }}
                      >
                        🗑️ DELETE
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes pulse {
          0%, 100% { 
            opacity: 1;
          }
          50% { 
            opacity: 0.8;
          }
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
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
          to { transform: translateY(110vh); opacity: 0; }
        }

        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
          }
          50% { 
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
          }
        }

        @keyframes borderGlow {
          0%, 100% { 
            opacity: 0.8;
          }
          50% { 
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes neonPulse {
          0%, 100% { 
            opacity: 0.8;
          }
          50% { 
            opacity: 1;
          }
        }

        @keyframes holographic {
          0% { 
            background-position: 0% 50%;
          }
          100% { 
            background-position: 100% 50%;
          }
        }

        @keyframes dataStream {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          41%, 43% { opacity: 0.7; }
          44% { opacity: 1; }
          61% { opacity: 0.8; }
          62% { opacity: 1; }
        }

        @keyframes rotate3d {
          0% { transform: perspective(1000px) rotateY(0deg); }
          100% { transform: perspective(1000px) rotateY(360deg); }
        }

        @keyframes slideGlow {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        @keyframes electricArc {
          0%, 100% { 
            box-shadow: 
              0 0 10px rgba(0, 255, 255, 0.5),
              0 0 20px rgba(0, 255, 255, 0.3),
              0 0 30px rgba(255, 0, 255, 0.2);
          }
          25% { 
            box-shadow: 
              0 0 20px rgba(255, 0, 255, 0.6),
              0 0 40px rgba(255, 0, 255, 0.4),
              0 0 60px rgba(0, 255, 255, 0.3);
          }
          50% { 
            box-shadow: 
              0 0 30px rgba(0, 255, 0, 0.7),
              0 0 50px rgba(0, 255, 0, 0.5),
              0 0 70px rgba(0, 255, 255, 0.4);
          }
          75% { 
            box-shadow: 
              0 0 20px rgba(0, 255, 255, 0.6),
              0 0 40px rgba(0, 255, 255, 0.4),
              0 0 60px rgba(255, 0, 255, 0.3);
          }
        }

        @keyframes matrixRain {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        input::placeholder {
          color: rgba(0, 255, 255, 0.6);
        }

        input:focus {
          outline: none;
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.5), inset 0 0 10px rgba(0, 255, 255, 0.1);
          border-color: #00ffff;
        }

        button:active {
          transform: scale(0.98);
        }

        /* Custom Scrollbar - Premium Style */
        ::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }

        ::-webkit-scrollbar-track {
          background: linear-gradient(90deg, rgba(0, 0, 0, 0.9), rgba(10, 10, 30, 0.9));
          border-left: 1px solid rgba(0, 255, 255, 0.2);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00ff00, #00ffff);
          border-radius: 6px;
          border: 2px solid rgba(0, 0, 0, 0.5);
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #00ffff, #00ff00);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
        }

        ::-webkit-scrollbar-corner {
          background: #000000;
        }

        /* Selection Style */
        ::selection {
          background: rgba(0, 255, 255, 0.3);
          color: #00ffff;
          text-shadow: 0 0 10px #00ffff;
        }

        ::-moz-selection {
          background: rgba(0, 255, 255, 0.3);
          color: #00ffff;
        }
      `}</style>
    </div>
  )
}