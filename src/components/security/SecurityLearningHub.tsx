"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, Code, Terminal, Lock, Shield, Database, 
  Globe, FileText, CheckCircle, XCircle, Play, Trophy,
  Target, Zap, Brain, GraduationCap
} from 'lucide-react';

type DifficultyLevel = 'low' | 'medium' | 'high' | 'impossible';

interface Challenge {
  id: string;
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  description: string;
  points: number;
  completed: boolean;
  hint?: string;
}

export default function SecurityLearningHub() {
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel>('low');
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);

  const difficultyLevels = [
    { 
      level: 'low' as DifficultyLevel, 
      name: 'Beginner', 
      color: 'bg-green-500', 
      description: 'Basic vulnerabilities, easy to exploit',
      icon: <GraduationCap className="h-5 w-5" />
    },
    { 
      level: 'medium' as DifficultyLevel, 
      name: 'Intermediate', 
      color: 'bg-yellow-500', 
      description: 'Moderate security, requires some skills',
      icon: <Brain className="h-5 w-5" />
    },
    { 
      level: 'high' as DifficultyLevel, 
      name: 'Advanced', 
      color: 'bg-orange-500', 
      description: 'Strong security, advanced techniques needed',
      icon: <Zap className="h-5 w-5" />
    },
    { 
      level: 'impossible' as DifficultyLevel, 
      name: 'Expert', 
      color: 'bg-red-500', 
      description: 'Maximum security, nearly impossible to break',
      icon: <Trophy className="h-5 w-5" />
    },
  ];

  const challenges: Challenge[] = [
    // SQL Injection Challenges
    {
      id: 'sql-low',
      title: 'SQL Injection - Basic',
      category: 'SQL Injection',
      difficulty: 'low',
      description: 'Bypass login without password validation. Try: admin\' OR \'1\'=\'1',
      points: 100,
      completed: false,
      hint: "Try using SQL comments (--) or always-true conditions (OR '1'='1')"
    },
    {
      id: 'sql-medium',
      title: 'SQL Injection - Filtered',
      category: 'SQL Injection',
      difficulty: 'medium',
      description: 'Bypass login with basic input filtering. Some keywords are blocked.',
      points: 200,
      completed: false,
      hint: "Use alternative SQL syntax or encoding techniques"
    },
    {
      id: 'sql-high',
      title: 'SQL Injection - Advanced',
      category: 'SQL Injection',
      difficulty: 'high',
      description: 'Exploit with prepared statements incorrectly implemented.',
      points: 300,
      completed: false,
      hint: "Look for second-order SQL injection or time-based attacks"
    },
    {
      id: 'sql-impossible',
      title: 'SQL Injection - Impossible',
      category: 'SQL Injection',
      difficulty: 'impossible',
      description: 'Try to break properly implemented parameterized queries.',
      points: 500,
      completed: false,
      hint: "This should be impossible if implemented correctly"
    },

    // XSS Challenges
    {
      id: 'xss-low',
      title: 'XSS - Reflected',
      category: 'Cross-Site Scripting',
      difficulty: 'low',
      description: 'Inject JavaScript in search field. Try: <script>alert(1)</script>',
      points: 100,
      completed: false,
      hint: "Basic script tags work directly"
    },
    {
      id: 'xss-medium',
      title: 'XSS - Filtered Tags',
      category: 'Cross-Site Scripting',
      difficulty: 'medium',
      description: 'Bypass basic XSS filters. <script> tags are blocked.',
      points: 200,
      completed: false,
      hint: "Try using event handlers like onerror, onload, or different encoding"
    },
    {
      id: 'xss-high',
      title: 'XSS - CSP Bypass',
      category: 'Cross-Site Scripting',
      difficulty: 'high',
      description: 'Bypass Content Security Policy restrictions.',
      points: 300,
      completed: false,
      hint: "Look for CSP misconfigurations or whitelisted domains"
    },
    {
      id: 'xss-impossible',
      title: 'XSS - Impossible',
      category: 'Cross-Site Scripting',
      difficulty: 'impossible',
      description: 'Try to inject XSS with proper output encoding.',
      points: 500,
      completed: false,
      hint: "With proper encoding, this should be impossible"
    },

    // CSRF Challenges
    {
      id: 'csrf-low',
      title: 'CSRF - No Protection',
      category: 'CSRF',
      difficulty: 'low',
      description: 'Execute state-changing operations without CSRF tokens.',
      points: 100,
      completed: false,
      hint: "Simple form submission works"
    },
    {
      id: 'csrf-medium',
      title: 'CSRF - Referer Check',
      category: 'CSRF',
      difficulty: 'medium',
      description: 'Bypass referer header validation.',
      points: 200,
      completed: false,
      hint: "Referer can be manipulated or omitted"
    },
    {
      id: 'csrf-high',
      title: 'CSRF - Token Bypass',
      category: 'CSRF',
      difficulty: 'high',
      description: 'Bypass weak CSRF token implementation.',
      points: 300,
      completed: false,
      hint: "Look for token reuse or predictable patterns"
    },

    // Command Injection
    {
      id: 'cmd-low',
      title: 'Command Injection - Basic',
      category: 'Command Injection',
      difficulty: 'low',
      description: 'Execute system commands. Try: 127.0.0.1 && whoami',
      points: 150,
      completed: false,
      hint: "Use command separators like &&, ||, or ;"
    },
    {
      id: 'cmd-medium',
      title: 'Command Injection - Filtered',
      category: 'Command Injection',
      difficulty: 'medium',
      description: 'Bypass command filtering and execute arbitrary commands.',
      points: 250,
      completed: false,
      hint: "Try alternative command separators or encoding"
    },

    // File Upload
    {
      id: 'upload-low',
      title: 'File Upload - No Validation',
      category: 'File Upload',
      difficulty: 'low',
      description: 'Upload a malicious file with no restrictions.',
      points: 100,
      completed: false,
      hint: "Any file type is accepted"
    },
    {
      id: 'upload-medium',
      title: 'File Upload - Type Check',
      category: 'File Upload',
      difficulty: 'medium',
      description: 'Bypass client-side file type validation.',
      points: 200,
      completed: false,
      hint: "Client-side checks can be modified"
    },
    {
      id: 'upload-high',
      title: 'File Upload - Magic Bytes',
      category: 'File Upload',
      difficulty: 'high',
      description: 'Bypass server-side MIME type validation.',
      points: 300,
      completed: false,
      hint: "Modify file headers to match allowed types"
    },

    // Authentication
    {
      id: 'auth-low',
      title: 'Broken Authentication',
      category: 'Authentication',
      difficulty: 'low',
      description: 'Exploit weak password policies and session management.',
      points: 100,
      completed: false,
      hint: "Try common passwords or session hijacking"
    },
    {
      id: 'auth-medium',
      title: 'Session Fixation',
      category: 'Authentication',
      difficulty: 'medium',
      description: 'Exploit session fixation vulnerability.',
      points: 200,
      completed: false,
      hint: "Set session ID before user logs in"
    },

    // Access Control
    {
      id: 'access-low',
      title: 'Insecure Direct Object Reference',
      category: 'Access Control',
      difficulty: 'low',
      description: 'Access other users\' data by manipulating parameters.',
      points: 100,
      completed: false,
      hint: "Try changing ID parameters in URLs"
    },
    {
      id: 'access-medium',
      title: 'Privilege Escalation',
      category: 'Access Control',
      difficulty: 'medium',
      description: 'Escalate privileges from regular user to admin.',
      points: 250,
      completed: false,
      hint: "Look for role manipulation in requests"
    },
  ];

  const categories = Array.from(new Set(challenges.map(c => c.category)));

  const filteredChallenges = challenges.filter(c => c.difficulty === selectedLevel);

  const handleChallengeSelect = (challenge: Challenge) => {
    setActiveChallenge(challenge);
  };

  const handleChallengeComplete = (challengeId: string) => {
    if (!completedChallenges.includes(challengeId)) {
      setCompletedChallenges([...completedChallenges, challengeId]);
    }
  };

  const getTotalPoints = () => {
    return challenges
      .filter(c => completedChallenges.includes(c.id))
      .reduce((sum, c) => sum + c.points, 0);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">🎓 Security Learning Hub</h1>
        <p className="text-gray-600">Learn cybersecurity by practicing in a safe environment</p>
        <div className="flex justify-center items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span className="text-2xl font-bold">{getTotalPoints()}</span>
            <span className="text-gray-600">points</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <span className="text-2xl font-bold">{completedChallenges.length}</span>
            <span className="text-gray-600">/ {challenges.length} completed</span>
          </div>
        </div>
      </div>

      {/* Difficulty Level Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {difficultyLevels.map((level) => (
          <Card 
            key={level.level}
            className={`cursor-pointer transition-all ${
              selectedLevel === level.level ? 'ring-2 ring-blue-500 shadow-lg' : ''
            }`}
            onClick={() => setSelectedLevel(level.level)}
          >
            <CardContent className="p-4 text-center">
              <div className={`${level.color} text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2`}>
                {level.icon}
              </div>
              <h3 className="font-semibold">{level.name}</h3>
              <p className="text-xs text-gray-600 mt-1">{level.description}</p>
              <Badge variant="outline" className="mt-2">
                {challenges.filter(c => c.difficulty === level.level).length} challenges
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Challenges List */}
        <div className="md:col-span-1 space-y-3">
          <h2 className="text-xl font-bold">Challenges</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredChallenges.map((challenge) => (
              <Card 
                key={challenge.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  activeChallenge?.id === challenge.id ? 'ring-2 ring-blue-500' : ''
                } ${
                  completedChallenges.includes(challenge.id) ? 'bg-green-50' : ''
                }`}
                onClick={() => handleChallengeSelect(challenge)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {completedChallenges.includes(challenge.id) ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Target className="h-4 w-4 text-gray-400" />
                        )}
                        <h4 className="font-semibold text-sm">{challenge.title}</h4>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{challenge.category}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {challenge.points}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Challenge Details */}
        <div className="md:col-span-2">
          {activeChallenge ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{activeChallenge.title}</CardTitle>
                    <CardDescription>{activeChallenge.category}</CardDescription>
                  </div>
                  <Badge className="text-sm">
                    {activeChallenge.points} points
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Description */}
                <Alert>
                  <BookOpen className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Objective:</strong> {activeChallenge.description}
                  </AlertDescription>
                </Alert>

                {/* Hint */}
                {activeChallenge.hint && (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <AlertDescription>
                      <strong>Hint:</strong> {activeChallenge.hint}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Interactive Area */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3">Practice Area</h3>
                  
                  {/* Dynamic challenge interface based on category */}
                  {activeChallenge.category === 'SQL Injection' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Username</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border rounded mt-1"
                          placeholder="Enter username..."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Password</label>
                        <input 
                          type="password" 
                          className="w-full p-2 border rounded mt-1"
                          placeholder="Enter password..."
                        />
                      </div>
                      <Button className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        Login
                      </Button>
                    </div>
                  )}

                  {activeChallenge.category === 'Cross-Site Scripting' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Search</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border rounded mt-1"
                          placeholder="Enter search query..."
                        />
                      </div>
                      <Button className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        Search
                      </Button>
                      <div className="mt-3 p-3 border rounded bg-white">
                        <p className="text-sm text-gray-600">Results will appear here...</p>
                      </div>
                    </div>
                  )}

                  {activeChallenge.category === 'Command Injection' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Ping Address</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border rounded mt-1 font-mono"
                          placeholder="127.0.0.1"
                        />
                      </div>
                      <Button className="w-full">
                        <Terminal className="mr-2 h-4 w-4" />
                        Execute
                      </Button>
                      <div className="mt-3 p-3 border rounded bg-black text-green-400 font-mono text-sm">
                        <p>Output will appear here...</p>
                      </div>
                    </div>
                  )}

                  {activeChallenge.category === 'File Upload' && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Upload File</label>
                        <input 
                          type="file" 
                          className="w-full p-2 border rounded mt-1"
                        />
                      </div>
                      <Button className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                  )}

                  {!['SQL Injection', 'Cross-Site Scripting', 'Command Injection', 'File Upload'].includes(activeChallenge.category) && (
                    <div className="text-center py-8">
                      <Code className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">Interactive challenge coming soon</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => alert('Solution guide will be shown here')}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Show Solution
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => handleChallengeComplete(activeChallenge.id)}
                    disabled={completedChallenges.includes(activeChallenge.id)}
                  >
                    {completedChallenges.includes(activeChallenge.id) ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Trophy className="mr-2 h-4 w-4" />
                        Mark as Complete
                      </>
                    )}
                  </Button>
                </div>

                {/* Learning Resources */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">📚 Learning Resources</h4>
                  <div className="space-y-2">
                    <Button variant="link" className="p-0 h-auto">
                      → Read about {activeChallenge.category}
                    </Button>
                    <Button variant="link" className="p-0 h-auto">
                      → Watch video tutorial
                    </Button>
                    <Button variant="link" className="p-0 h-auto">
                      → View real-world examples
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Target className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Select a Challenge
                </h3>
                <p className="text-gray-500">
                  Choose a challenge from the list to begin learning
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
