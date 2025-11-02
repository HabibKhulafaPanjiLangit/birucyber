import { NextRequest, NextResponse } from 'next/server'

const modules = [
  {
    id: 'sql-injection',
    title: 'SQL Injection Mastery',
    description: 'Comprehensive guide to SQL Injection vulnerabilities and prevention',
    level: 'Intermediate',
    duration: '45 minutes',
    difficulty: 7,
    prerequisites: ['Basic SQL knowledge', 'Understanding of web applications'],
    objectives: [
      'Identify SQL Injection vulnerabilities',
      'Understand different SQLi techniques',
      'Learn prevention methods',
      'Practice safe coding'
    ],
    sections: [
      {
        id: 'intro',
        title: 'Introduction to SQL Injection',
        duration: '10 minutes',
        type: 'theory',
        content: {
          overview: 'SQL Injection is one of the most critical web security vulnerabilities...',
          keyPoints: [
            'SQL Injection allows attackers to interfere with database queries',
            'Can lead to data theft, modification, or deletion',
            'Often found in login forms, search boxes, and API endpoints'
          ],
          examples: [
            "SELECT * FROM users WHERE username = '" + "userInput" + "'",
            "SELECT * FROM products WHERE category = '" + "category" + "'"
          ]
        }
      },
      {
        id: 'types',
        title: 'Types of SQL Injection',
        duration: '15 minutes',
        type: 'theory',
        content: {
          types: [
            {
              name: 'In-band SQLi',
              description: 'Attacker uses the same communication channel to launch attacks and gather results',
              examples: ['Error-based SQLi', 'Union-based SQLi']
            },
            {
              name: 'Blind SQLi',
              description: 'Attacker cannot get the response from the database directly',
              examples: ['Boolean-based SQLi', 'Time-based SQLi']
            },
            {
              name: 'Out-of-band SQLi',
              description: 'Attacker uses different channels to launch attacks and gather results',
              examples: ['DNS exfiltration', 'HTTP requests']
            }
          ]
        }
      },
      {
        id: 'practical',
        title: 'Practical Testing',
        duration: '20 minutes',
        type: 'practical',
        content: {
          exercises: [
            {
              title: 'Basic Authentication Bypass',
              description: 'Try to bypass login using SQL Injection',
              hints: ['Try OR conditions', 'Use comments to bypass validation'],
              solution: "' OR '1'='1' --"
            },
            {
              title: 'Union Attack',
              description: 'Extract data from other tables using UNION',
              hints: ['Match column count', 'Use NULL placeholders'],
              solution: "' UNION SELECT username, password FROM users --"
            }
          ]
        }
      }
    ],
    resources: [
      {
        title: 'OWASP SQL Injection Guide',
        type: 'documentation',
        url: 'https://owasp.org/www-community/attacks/SQL_Injection'
      },
      {
        title: 'SQL Injection Cheat Sheet',
        type: 'reference',
        url: '#'
      }
    ],
    quiz: [
      {
        question: 'What is the primary cause of SQL Injection?',
        options: [
          'Weak passwords',
          'Unsanitized user input',
          'Outdated software',
          'Network vulnerabilities'
        ],
        correct: 1,
        explanation: 'SQL Injection occurs when user input is not properly sanitized before being included in SQL queries.'
      }
    ]
  },
  {
    id: 'xss',
    title: 'Cross Site Scripting (XSS)',
    description: 'Understanding and preventing XSS vulnerabilities in web applications',
    level: 'Beginner',
    duration: '30 minutes',
    difficulty: 4,
    prerequisites: ['Basic HTML/JavaScript knowledge', 'Understanding of web browsers'],
    objectives: [
      'Identify XSS vulnerabilities',
      'Understand XSS impact and consequences',
      'Learn XSS prevention techniques',
      'Implement secure coding practices'
    ],
    sections: [
      {
        id: 'intro',
        title: 'Introduction to XSS',
        duration: '8 minutes',
        type: 'theory',
        content: {
          overview: 'Cross Site Scripting (XSS) allows attackers to inject malicious scripts into web pages...',
          keyPoints: [
            'XSS attacks execute malicious code in victims browsers',
            'Can steal cookies, session tokens, and sensitive data',
            'Often found in comment sections, search results, and user profiles'
          ],
          impact: [
            'Session hijacking',
            'Data theft',
            'Website defacement',
            'Malware distribution'
          ]
        }
      },
      {
        id: 'types',
        title: 'Types of XSS',
        duration: '12 minutes',
        type: 'theory',
        content: {
          types: [
            {
              name: 'Stored XSS',
              description: 'Malicious script is permanently stored on the target server',
              examples: ['Comment sections', 'User profiles', 'Forum posts']
            },
            {
              name: 'Reflected XSS',
              description: 'Malicious script is reflected off the web server to the victim',
              examples: ['Search results', 'Error messages', 'URL parameters']
            },
            {
              name: 'DOM XSS',
              description: 'Vulnerability exists in client-side code rather than server-side',
              examples: ['Client-side routing', 'Dynamic content rendering']
            }
          ]
        }
      },
      {
        id: 'practical',
        title: 'XSS Testing Lab',
        duration: '10 minutes',
        type: 'practical',
        content: {
          exercises: [
            {
              title: 'Basic Script Injection',
              description: 'Inject a simple alert script',
              hints: ['Use script tags', 'Try different event handlers'],
              solution: '<script>alert("XSS")</script>'
            },
            {
              title: 'Attribute Injection',
              description: 'Inject script through HTML attributes',
              hints: ['Use onload event', 'Try img tag'],
              solution: '<img src="x" onerror="alert(1)">'
            }
          ]
        }
      }
    ],
    resources: [
      {
        title: 'OWASP XSS Prevention Cheat Sheet',
        type: 'documentation',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html'
      }
    ],
    quiz: [
      {
        question: 'Which is the most effective XSS prevention method?',
        options: [
          'Input validation only',
          'Output encoding only',
          'Both input validation and output encoding',
          'Using HTTPS only'
        ],
        correct: 2,
        explanation: 'Effective XSS prevention requires both input validation and proper output encoding.'
      }
    ]
  },
  {
    id: 'access-control',
    title: 'Access Control Vulnerabilities',
    description: 'Master the art of testing and securing access control mechanisms',
    level: 'Advanced',
    duration: '60 minutes',
    difficulty: 9,
    prerequisites: ['HTTP protocol knowledge', 'Authentication concepts', 'Web application architecture'],
    objectives: [
      'Identify access control flaws',
      'Test authorization mechanisms',
      'Understand privilege escalation',
      'Implement secure access control'
    ],
    sections: [
      {
        id: 'intro',
        title: 'Access Control Fundamentals',
        duration: '15 minutes',
        type: 'theory',
        content: {
          overview: 'Access control ensures users can only access resources they are authorized to use...',
          keyPoints: [
            'Access control is a critical security mechanism',
            'Broken access control is #1 in OWASP Top 10',
            'Can lead to unauthorized data access and privilege escalation'
          ],
          principles: [
            'Principle of least privilege',
            'Defense in depth',
            'Never trust user input',
            'Validate every request'
          ]
        }
      },
      {
        id: 'vulnerabilities',
        title: 'Common Access Control Vulnerabilities',
        duration: '20 minutes',
        type: 'theory',
        content: {
          vulnerabilities: [
            {
              name: 'IDOR (Insecure Direct Object Reference)',
              description: 'Accessing resources by manipulating object identifiers',
              examples: ['/api/users/123 → /api/users/124']
            },
            {
              name: 'Privilege Escalation',
              description: 'Gaining higher privileges than intended',
              examples: ['User accessing admin functions', 'Role parameter manipulation']
            },
            {
              name: 'Missing Authorization',
              description: 'No proper authorization checks implemented',
              examples: ['Direct API access', 'Unprotected endpoints']
            }
          ]
        }
      },
      {
        id: 'testing',
        title: 'Access Control Testing',
        duration: '25 minutes',
        type: 'practical',
        content: {
          exercises: [
            {
              title: 'Parameter Manipulation',
              description: 'Test access control by manipulating parameters',
              hints: ['Change user IDs', 'Modify role parameters', 'Test different HTTP methods'],
              solution: 'Manipulate request parameters to access unauthorized resources'
            },
            {
              title: 'Bypass Techniques',
              description: 'Try various bypass techniques',
              hints: ['HTTP method override', 'URL encoding', 'Race conditions'],
              solution: 'Use various techniques to bypass access controls'
            }
          ]
        }
      }
    ],
    resources: [
      {
        title: 'OWASP Access Control Cheat Sheet',
        type: 'documentation',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html'
      }
    ],
    quiz: [
      {
        question: 'What is the most common access control vulnerability?',
        options: [
          'Weak passwords',
          'Missing authorization checks',
          'Outdated software',
          'Network misconfiguration'
        ],
        correct: 1,
        explanation: 'Missing or improper authorization checks are the most common access control vulnerabilities.'
      }
    ]
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const moduleId = searchParams.get('id')

    if (moduleId) {
      const moduleData = modules.find(m => m.id === moduleId)
      if (!moduleData) {
        return NextResponse.json(
          { error: 'Module not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true, data: moduleData })
    }

    return NextResponse.json({
      success: true,
      data: modules
    })

  } catch (error) {
    console.error('Modules API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { moduleId, progress, completed } = await request.json()

    // Here you would typically save progress to database
    // For now, we'll just return success
    
    return NextResponse.json({
      success: true,
      message: 'Progress saved',
      data: {
        moduleId,
        progress,
        completed,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Progress save error:', error)
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    )
  }
}