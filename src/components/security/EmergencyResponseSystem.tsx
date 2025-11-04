"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, AlertTriangle, CheckCircle, Clock, XCircle,
  Phone, Mail, MessageSquare, Download, FileText,
  Lock, Key, RefreshCw, Users, Server, Database
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  completed: boolean;
  automated: boolean;
  timeEstimate: string;
}

interface EmergencyContact {
  name: string;
  role: string;
  phone: string;
  email: string;
  available247: boolean;
}

export default function EmergencyResponseSystem() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: '1',
      title: 'Disconnect from Network',
      description: 'Immediately disconnect the compromised system from the network to prevent further spread',
      priority: 'critical',
      completed: false,
      automated: true,
      timeEstimate: '1 min'
    },
    {
      id: '2',
      title: 'Document Current State',
      description: 'Take screenshots and notes of any error messages or suspicious activity',
      priority: 'critical',
      completed: false,
      automated: false,
      timeEstimate: '5 min'
    },
    {
      id: '3',
      title: 'Identify Compromised Accounts',
      description: 'Check which user accounts may have been accessed or compromised',
      priority: 'critical',
      completed: false,
      automated: true,
      timeEstimate: '3 min'
    },
    {
      id: '4',
      title: 'Change All Passwords',
      description: 'Change passwords for all accounts, starting with admin and critical systems',
      priority: 'critical',
      completed: false,
      automated: false,
      timeEstimate: '10 min'
    },
    {
      id: '5',
      title: 'Enable Multi-Factor Authentication',
      description: 'Enable 2FA/MFA on all accounts that support it',
      priority: 'high',
      completed: false,
      automated: false,
      timeEstimate: '15 min'
    },
    {
      id: '6',
      title: 'Revoke Active Sessions',
      description: 'Force logout all active sessions across all platforms',
      priority: 'high',
      completed: false,
      automated: true,
      timeEstimate: '2 min'
    },
    {
      id: '7',
      title: 'Scan for Malware',
      description: 'Run comprehensive malware and rootkit scan',
      priority: 'high',
      completed: false,
      automated: true,
      timeEstimate: '20 min'
    },
    {
      id: '8',
      title: 'Check for Backdoors',
      description: 'Scan for unauthorized remote access tools or backdoors',
      priority: 'high',
      completed: false,
      automated: true,
      timeEstimate: '15 min'
    },
    {
      id: '9',
      title: 'Review System Logs',
      description: 'Analyze logs for suspicious activities and unauthorized access',
      priority: 'high',
      completed: false,
      automated: true,
      timeEstimate: '10 min'
    },
    {
      id: '10',
      title: 'Backup Critical Data',
      description: 'Create backup of important files before cleanup',
      priority: 'medium',
      completed: false,
      automated: true,
      timeEstimate: '30 min'
    },
    {
      id: '11',
      title: 'Update All Software',
      description: 'Update operating system and all applications to latest versions',
      priority: 'medium',
      completed: false,
      automated: true,
      timeEstimate: '45 min'
    },
    {
      id: '12',
      title: 'Check Financial Accounts',
      description: 'Review bank and credit card statements for unauthorized transactions',
      priority: 'high',
      completed: false,
      automated: false,
      timeEstimate: '20 min'
    },
    {
      id: '13',
      title: 'Notify Relevant Parties',
      description: 'Inform affected users, customers, or authorities as required',
      priority: 'medium',
      completed: false,
      automated: false,
      timeEstimate: '30 min'
    },
    {
      id: '14',
      title: 'Enable Security Monitoring',
      description: 'Set up continuous monitoring and alerting systems',
      priority: 'medium',
      completed: false,
      automated: true,
      timeEstimate: '15 min'
    },
    {
      id: '15',
      title: 'Configure Firewall',
      description: 'Review and strengthen firewall rules',
      priority: 'medium',
      completed: false,
      automated: true,
      timeEstimate: '20 min'
    },
    {
      id: '16',
      title: 'Create Incident Report',
      description: 'Document all findings and actions taken',
      priority: 'low',
      completed: false,
      automated: false,
      timeEstimate: '30 min'
    }
  ]);

  const emergencyContacts: EmergencyContact[] = [
    {
      name: 'Security Operations Center',
      role: 'Primary Emergency Contact',
      phone: '+1-800-SEC-HELP',
      email: 'soc@security.com',
      available247: true
    },
    {
      name: 'Incident Response Team',
      role: 'Cyber Incident Handler',
      phone: '+1-800-INC-RESP',
      email: 'incident@security.com',
      available247: true
    },
    {
      name: 'IT Security Manager',
      role: 'Security Lead',
      phone: '+1-555-0123',
      email: 'security.manager@company.com',
      available247: false
    },
    {
      name: 'Legal Department',
      role: 'Legal Compliance',
      phone: '+1-555-0456',
      email: 'legal@company.com',
      available247: false
    },
    {
      name: 'Law Enforcement',
      role: 'Cyber Crime Unit',
      phone: '911 or local police',
      email: 'cybercrime@police.gov',
      available247: true
    }
  ];

  const handleToggleComplete = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleAutomatedAction = (item: ChecklistItem) => {
    if (item.automated) {
      alert(`Executing automated action: ${item.title}`);
      // Simulate execution
      setTimeout(() => {
        handleToggleComplete(item.id);
      }, 1000);
    }
  };

  const handleCompleteAll = () => {
    const automatedItems = checklist.filter(item => item.automated && !item.completed);
    automatedItems.forEach((item, index) => {
      setTimeout(() => {
        handleAutomatedAction(item);
      }, index * 2000);
    });
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-blue-500'
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const criticalPending = checklist.filter(item => item.priority === 'critical' && !item.completed).length;

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Emergency Banner */}
      <Alert className="border-red-500 bg-red-50">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <AlertDescription className="ml-2">
          <strong>EMERGENCY MODE ACTIVATED</strong> - Follow the checklist below step by step
        </AlertDescription>
      </Alert>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">🚨 Emergency Response System</h1>
        <p className="text-gray-600">Immediate actions for security incidents</p>
      </div>

      {/* Progress Overview */}
      <Card className="border-2 border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Response Progress</span>
            <Badge variant={criticalPending > 0 ? 'destructive' : 'default'} className="text-lg">
              {completedCount} / {totalCount}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span className="font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {criticalPending > 0 && (
            <Alert className="border-red-300 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription>
                <strong>{criticalPending} critical actions</strong> still pending!
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button onClick={handleCompleteAll} className="flex-1" size="lg">
              <RefreshCw className="mr-2 h-5 w-5" />
              Auto-Complete All Automated Tasks
            </Button>
            <Button variant="outline" className="flex-1" size="lg">
              <Download className="mr-2 h-5 w-5" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Response Checklist</CardTitle>
          <CardDescription>Complete these actions in order of priority</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Critical Items */}
          <div>
            <h3 className="font-semibold text-red-600 mb-2 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Critical Priority
            </h3>
            {checklist.filter(item => item.priority === 'critical').map((item) => (
              <div 
                key={item.id}
                className={`p-4 border rounded-lg mb-2 transition-all ${
                  item.completed 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-red-50 border-red-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => handleToggleComplete(item.id)}
                    className="mt-1"
                  >
                    {item.completed ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-400" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-semibold ${item.completed ? 'line-through text-gray-500' : ''}`}>
                        {item.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {item.timeEstimate}
                        </Badge>
                      </div>
                    </div>
                    <p className={`text-sm ${item.completed ? 'text-gray-500' : 'text-gray-700'}`}>
                      {item.description}
                    </p>
                    {item.automated && !item.completed && (
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => handleAutomatedAction(item)}
                      >
                        <RefreshCw className="mr-2 h-3 w-3" />
                        Auto Execute
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* High Priority Items */}
          <div>
            <h3 className="font-semibold text-orange-600 mb-2 mt-4 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              High Priority
            </h3>
            {checklist.filter(item => item.priority === 'high').map((item) => (
              <div 
                key={item.id}
                className={`p-4 border rounded-lg mb-2 transition-all ${
                  item.completed 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-orange-50 border-orange-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => handleToggleComplete(item.id)}
                    className="mt-1"
                  >
                    {item.completed ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-orange-400" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-semibold ${item.completed ? 'line-through text-gray-500' : ''}`}>
                        {item.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {item.timeEstimate}
                        </Badge>
                      </div>
                    </div>
                    <p className={`text-sm ${item.completed ? 'text-gray-500' : 'text-gray-700'}`}>
                      {item.description}
                    </p>
                    {item.automated && !item.completed && (
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => handleAutomatedAction(item)}
                      >
                        <RefreshCw className="mr-2 h-3 w-3" />
                        Auto Execute
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Medium and Low Priority */}
          <details className="border rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              Show Medium & Low Priority Tasks ({checklist.filter(item => item.priority === 'medium' || item.priority === 'low').length})
            </summary>
            <div className="mt-3 space-y-2">
              {checklist.filter(item => item.priority === 'medium' || item.priority === 'low').map((item) => (
                <div 
                  key={item.id}
                  className={`p-3 border rounded-lg transition-all ${
                    item.completed 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => handleToggleComplete(item.id)}
                      className="mt-1"
                    >
                      {item.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm font-semibold ${item.completed ? 'line-through text-gray-500' : ''}`}>
                          {item.title}
                        </h4>
                        <Badge className={getPriorityColor(item.priority)} variant="outline">
                          {item.priority}
                        </Badge>
                      </div>
                      <p className={`text-xs ${item.completed ? 'text-gray-500' : 'text-gray-600'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="mr-2 h-5 w-5" />
            Emergency Contacts
          </CardTitle>
          <CardDescription>
            Contact these resources for immediate assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {emergencyContacts.map((contact, idx) => (
              <div key={idx} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{contact.name}</h4>
                    <p className="text-sm text-gray-600">{contact.role}</p>
                  </div>
                  {contact.available247 && (
                    <Badge className="bg-green-500">24/7</Badge>
                  )}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                      {contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                      {contact.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-sm flex items-center text-red-700">
              <Lock className="mr-2 h-4 w-4" />
              Lock Down
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" size="sm" className="w-full">
              Emergency Lockdown
            </Button>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-sm flex items-center text-yellow-700">
              <MessageSquare className="mr-2 h-4 w-4" />
              Get Help
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full">
              Chat with Expert
            </Button>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-sm flex items-center text-green-700">
              <FileText className="mr-2 h-4 w-4" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full">
              View Guide
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
