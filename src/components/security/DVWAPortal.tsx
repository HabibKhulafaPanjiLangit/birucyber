"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import IncidentResponsePortal from '@/components/security/IncidentResponsePortal';
import SecurityLearningHub from '@/components/security/SecurityLearningHub';
import VulnerabilityPlayground from '@/components/security/VulnerabilityPlayground';
import EmergencyResponseSystem from '@/components/security/EmergencyResponseSystem';
import AdvancedPayloadLibrary from '@/components/security/AdvancedPayloadLibrary';
import IntelligenceTracker from '@/components/security/IntelligenceTracker';
import AdvancedExploitationLab from '@/components/security/AdvancedExploitationLab';
import { 
  Shield, BookOpen, Search, AlertTriangle, Target, 
  GraduationCap, Code, Terminal, Lock, Unlock,
  Activity, TrendingUp, Users, FileText, Zap,
  CheckCircle, XCircle, Award, Trophy, Star, Skull,
  Phone, Mail, Globe, Database
} from 'lucide-react';

type PortalView = 'home' | 'emergency' | 'learning' | 'playground' | 'incident' | 'payloads' | 'tracker' | 'exploitation';

export default function DVWAPortal() {
  const [activeView, setActiveView] = useState<PortalView>('home');

  const features = [
    {
      id: 'emergency',
      title: 'Emergency Response',
      description: 'Immediate help if you\'ve been hacked',
      icon: <AlertTriangle className="h-8 w-8" />,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      textColor: 'text-red-700',
      stats: { priority: 'CRITICAL', available: '24/7' }
    },
    {
      id: 'tracker',
      title: 'Intelligence Tracker',
      description: 'Track phone, email, IP & social media',
      icon: <Phone className="h-8 w-8" />,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-300',
      textColor: 'text-cyan-700',
      stats: { tracked: '1000+', accuracy: '95%' }
    },
    {
      id: 'incident',
      title: 'Incident Response Portal',
      description: 'Report and track security incidents',
      icon: <Shield className="h-8 w-8" />,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
      textColor: 'text-orange-700',
      stats: { active: '3 incidents', resolved: '127' }
    },
    {
      id: 'learning',
      title: 'Security Learning Hub',
      description: 'Learn cybersecurity with hands-on challenges',
      icon: <GraduationCap className="h-8 w-8" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-700',
      stats: { challenges: '24', levels: '4' }
    },
    {
      id: 'playground',
      title: 'Vulnerability Playground',
      description: 'Practice security analysis and forensics',
      icon: <Target className="h-8 w-8" />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-700',
      stats: { tools: '15+', modes: 'Safe' }
    },
    {
      id: 'payloads',
      title: 'Advanced Payload Library',
      description: 'Professional exploitation payloads',
      icon: <Zap className="h-8 w-8" />,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-700',
      stats: { payloads: '8192+', categories: '15' }
    },
    {
      id: 'exploitation',
      title: 'Advanced Exploitation Lab',
      description: 'Remote code execution & DoS attacks',
      icon: <Skull className="h-8 w-8" />,
      color: 'from-red-600 to-red-800',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-400',
      textColor: 'text-red-800',
      stats: { exploits: 'LIVE', danger: 'EXTREME' }
    }
  ];

  const stats = [
    { label: 'Total Users', value: '1,234', icon: <Users className="h-5 w-5" />, trend: '+12%' },
    { label: 'Challenges Completed', value: '5,678', icon: <CheckCircle className="h-5 w-5" />, trend: '+23%' },
    { label: 'Security Scans', value: '890', icon: <Search className="h-5 w-5" />, trend: '+8%' },
    { label: 'Incidents Resolved', value: '127', icon: <Shield className="h-5 w-5" />, trend: '100%' }
  ];

  const recentActivities = [
    { user: 'Admin', action: 'Completed SQL Injection - High', time: '2 min ago', type: 'success' },
    { user: 'Security Team', action: 'New vulnerability detected', time: '15 min ago', type: 'warning' },
    { user: 'User123', action: 'Started XSS Challenge', time: '30 min ago', type: 'info' },
    { user: 'Forensics', action: 'Incident report generated', time: '1 hour ago', type: 'info' }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'emergency':
        return <EmergencyResponseSystem />;
      case 'tracker':
        return <IntelligenceTracker />;
      case 'incident':
        return <IncidentResponsePortal />;
      case 'learning':
        return <SecurityLearningHub />;
      case 'playground':
        return <VulnerabilityPlayground />;
      case 'payloads':
        return <AdvancedPayloadLibrary />;
      case 'exploitation':
        return <AdvancedExploitationLab />;
      default:
        return (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white p-8">
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">Security Portal DVWA</h1>
                    <p className="text-xl opacity-90 mb-4">
                      Complete cybersecurity platform for learning and incident response
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-white text-purple-600">Free</Badge>
                      <Badge className="bg-white text-purple-600">Safe Environment</Badge>
                      <Badge className="bg-white text-purple-600">24/7 Support</Badge>
                      <Badge className="bg-white text-purple-600">Professional Tools</Badge>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <Shield className="h-32 w-32 opacity-20" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-black opacity-10"></div>
            </div>

            {/* Emergency Alert */}
            <Alert className="border-2 border-red-500 bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <AlertDescription className="ml-2">
                <strong>Been Hacked?</strong> Click the Emergency Response button above for immediate assistance!
              </AlertDescription>
            </Alert>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-blue-600">{stat.icon}</div>
                      <Badge variant="outline" className="text-green-600">
                        {stat.trend}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card 
                  key={feature.id}
                  className={`${feature.borderColor} border-2 ${feature.bgColor} cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                  onClick={() => setActiveView(feature.id as PortalView)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white`}>
                        {feature.icon}
                      </div>
                      {feature.id === 'emergency' && (
                        <Badge variant="destructive" className="animate-pulse">
                          URGENT
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className={`mb-2 ${feature.textColor}`}>
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-gray-700 mb-4">
                      {feature.description}
                    </CardDescription>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        {Object.entries(feature.stats).map(([key, value]) => (
                          <Badge key={key} variant="outline">
                            {key}: {value}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" className={`bg-gradient-to-r ${feature.color}`}>
                        Open →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {activity.type === 'success' ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : activity.type === 'warning' ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <Activity className="h-5 w-5 text-blue-500" />
                          )}
                          <div>
                            <p className="font-semibold text-sm">{activity.user}</p>
                            <p className="text-xs text-gray-600">{activity.action}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveView('learning')}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Start Learning
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveView('playground')}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Run Security Scan
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveView('incident')}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Reports
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start"
                    onClick={() => setActiveView('emergency')}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Emergency Help
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Security Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                  Security Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <Lock className="h-8 w-8 text-blue-600 mb-2" />
                    <h4 className="font-semibold mb-1">Use Strong Passwords</h4>
                    <p className="text-sm text-gray-600">
                      Always use complex passwords with 12+ characters
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg bg-green-50">
                    <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                    <h4 className="font-semibold mb-1">Enable 2FA</h4>
                    <p className="text-sm text-gray-600">
                      Two-factor authentication adds extra security layer
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg bg-purple-50">
                    <Shield className="h-8 w-8 text-purple-600 mb-2" />
                    <h4 className="font-semibold mb-1">Regular Updates</h4>
                    <p className="text-sm text-gray-600">
                      Keep your systems and software up to date
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                  Top Security Learners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: 'CyberNinja', points: 2450, badge: '🥇' },
                    { name: 'SecurityPro', points: 2100, badge: '🥈' },
                    { name: 'HackMaster', points: 1890, badge: '🥉' },
                    { name: 'CodeWarrior', points: 1650, badge: '🏆' },
                    { name: 'NetDefender', points: 1420, badge: '⭐' }
                  ].map((user, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{user.badge}</span>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-xs text-gray-600">{user.points} points</p>
                        </div>
                      </div>
                      <Badge>{idx + 1}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Security Portal DVWA</h1>
                <p className="text-xs text-gray-600">Comprehensive Security Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={activeView === 'home' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('home')}
              >
                <Activity className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={activeView === 'emergency' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setActiveView('emergency')}
                className="animate-pulse"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Emergency
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t bg-white">
        <div className="container mx-auto p-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-sm text-gray-600">
                Professional security platform inspired by DVWA for learning and incident response.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Resources</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Documentation</li>
                <li>Tutorials</li>
                <li>API Reference</li>
                <li>Community</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Support</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Emergency: 24/7</li>
                <li>Email Support</li>
                <li>Live Chat</li>
                <li>Forum</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Legal</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>License</li>
                <li>Disclaimer</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t text-center text-sm text-gray-600">
            © 2024 Security Portal DVWA. All rights reserved. | Made with ❤️ for cybersecurity education
          </div>
        </div>
      </footer>
    </div>
  );
}
