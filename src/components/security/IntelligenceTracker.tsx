"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Phone, Mail, Globe, MapPin, Search, Shield, AlertTriangle,
  User, Clock, Activity, Database, Lock, Eye, Download,
  Wifi, Smartphone, Server, Network, Copy, CheckCircle
} from 'lucide-react';

interface TrackingResult {
  type: string;
  input: string;
  data: any;
  timestamp: string;
  status: 'success' | 'partial' | 'failed';
}

export default function IntelligenceTracker() {
  const [activeTab, setActiveTab] = useState('phone');
  const [tracking, setTracking] = useState(false);
  const [results, setResults] = useState<TrackingResult | null>(null);
  const [progress, setProgress] = useState(0);

  // Phone Number Tracking
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Email Tracking
  const [emailAddress, setEmailAddress] = useState('');
  
  // IP Address Tracking
  const [ipAddress, setIpAddress] = useState('');
  
  // Social Media Tracking
  const [username, setUsername] = useState('');

  const trackPhoneNumber = async () => {
    setTracking(true);
    setProgress(0);
    
    // Simulate progressive tracking
    const steps = [
      { percent: 20, message: 'Validating phone number...' },
      { percent: 40, message: 'Checking carrier information...' },
      { percent: 60, message: 'Looking up location data...' },
      { percent: 80, message: 'Analyzing metadata...' },
      { percent: 100, message: 'Complete!' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(step.percent);
    }

    // Simulated comprehensive phone data
    setResults({
      type: 'phone',
      input: phoneNumber,
      timestamp: new Date().toISOString(),
      status: 'success',
      data: {
        number: phoneNumber,
        formatted: {
          international: '+1 ' + phoneNumber.slice(0, 3) + ' ' + phoneNumber.slice(3, 6) + '-' + phoneNumber.slice(6),
          national: '(' + phoneNumber.slice(0, 3) + ') ' + phoneNumber.slice(3, 6) + '-' + phoneNumber.slice(6),
          e164: '+1' + phoneNumber
        },
        carrier: {
          name: 'Verizon Wireless',
          type: 'Mobile',
          mcc: '310',
          mnc: '012'
        },
        location: {
          country: 'United States',
          countryCode: 'US',
          state: 'California',
          city: 'Los Angeles',
          timezone: 'America/Los_Angeles',
          coordinates: {
            latitude: 34.0522,
            longitude: -118.2437
          }
        },
        validity: {
          valid: true,
          possible: true,
          type: 'MOBILE',
          activeStatus: 'Active'
        },
        socialMedia: {
          whatsapp: 'Found',
          telegram: 'Found',
          signal: 'Not Found',
          viber: 'Found'
        },
        recentActivity: [
          { time: '2 hours ago', activity: 'SMS sent', location: 'Los Angeles, CA' },
          { time: '5 hours ago', activity: 'Call made', location: 'Los Angeles, CA' },
          { time: '1 day ago', activity: 'Data usage', location: 'Santa Monica, CA' }
        ],
        dataBreaches: [
          { date: '2023-08-15', source: 'LinkedIn', severity: 'Medium' },
          { date: '2024-01-10', source: 'Adobe', severity: 'Low' }
        ],
        riskScore: 35
      }
    });

    setTracking(false);
  };

  const trackEmail = async () => {
    setTracking(true);
    setProgress(0);
    
    const steps = [
      { percent: 15, message: 'Validating email format...' },
      { percent: 30, message: 'Checking domain records...' },
      { percent: 50, message: 'Scanning data breach databases...' },
      { percent: 70, message: 'Analyzing social media presence...' },
      { percent: 90, message: 'Gathering metadata...' },
      { percent: 100, message: 'Analysis complete!' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 700));
      setProgress(step.percent);
    }

    setResults({
      type: 'email',
      input: emailAddress,
      timestamp: new Date().toISOString(),
      status: 'success',
      data: {
        email: emailAddress,
        validation: {
          valid: true,
          disposable: false,
          roleAccount: false,
          freeProvider: emailAddress.includes('@gmail.com') || emailAddress.includes('@yahoo.com'),
          smtpValid: true,
          mxRecords: true
        },
        domain: {
          name: emailAddress.split('@')[1],
          age: '15 years',
          registrar: 'MarkMonitor Inc.',
          nameservers: ['ns1.google.com', 'ns2.google.com'],
          ssl: true,
          reputation: 'Excellent'
        },
        breaches: [
          {
            name: 'LinkedIn',
            date: '2012-05-05',
            compromisedData: ['Email', 'Password'],
            verified: true,
            severity: 'High'
          },
          {
            name: 'Adobe',
            date: '2013-10-04',
            compromisedData: ['Email', 'Password', 'Password Hint'],
            verified: true,
            severity: 'Medium'
          },
          {
            name: 'Dropbox',
            date: '2012-07-01',
            compromisedData: ['Email', 'Password'],
            verified: true,
            severity: 'High'
          }
        ],
        socialMedia: {
          found: [
            { platform: 'LinkedIn', url: 'linkedin.com/in/...', verified: true },
            { platform: 'Twitter', url: 'twitter.com/...', verified: false },
            { platform: 'GitHub', url: 'github.com/...', verified: true },
            { platform: 'Facebook', url: 'facebook.com/...', verified: false }
          ],
          notFound: ['Instagram', 'TikTok', 'Pinterest']
        },
        metadata: {
          firstSeen: '2010-03-15',
          lastSeen: '2024-11-03',
          totalBreaches: 3,
          exposedPasswords: 3,
          darkWebMentions: 5
        },
        riskAssessment: {
          score: 72,
          level: 'High',
          recommendations: [
            'Change passwords immediately',
            'Enable 2FA on all accounts',
            'Monitor credit reports',
            'Use unique passwords per service'
          ]
        }
      }
    });

    setTracking(false);
  };

  const trackIP = async () => {
    setTracking(true);
    setProgress(0);
    
    const steps = [
      { percent: 25, message: 'Geolocating IP address...' },
      { percent: 50, message: 'Checking ISP information...' },
      { percent: 75, message: 'Analyzing threat intelligence...' },
      { percent: 100, message: 'Complete!' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setProgress(step.percent);
    }

    setResults({
      type: 'ip',
      input: ipAddress,
      timestamp: new Date().toISOString(),
      status: 'success',
      data: {
        ip: ipAddress,
        type: 'IPv4',
        geolocation: {
          country: 'United States',
          countryCode: 'US',
          region: 'California',
          city: 'San Francisco',
          zipCode: '94103',
          latitude: 37.7749,
          longitude: -122.4194,
          timezone: 'America/Los_Angeles',
          accuracyRadius: 10
        },
        network: {
          isp: 'Comcast Cable Communications',
          organization: 'Comcast',
          asn: 'AS7922',
          domain: 'comcast.net',
          type: 'Cable/DSL'
        },
        security: {
          vpn: false,
          proxy: false,
          tor: false,
          hosting: false,
          cloud: false,
          threatLevel: 'Low',
          blacklisted: false,
          abuseScore: 0
        },
        threats: {
          spam: false,
          malware: false,
          botnet: false,
          ransomware: false,
          phishing: false,
          lastReported: 'Never'
        },
        ports: {
          open: ['80', '443', '8080'],
          filtered: ['21', '22', '3389'],
          services: [
            { port: 80, service: 'HTTP', version: 'nginx 1.18.0' },
            { port: 443, service: 'HTTPS', version: 'OpenSSL 1.1.1' }
          ]
        },
        history: {
          firstSeen: '2020-01-15',
          lastSeen: '2024-11-04',
          countries: ['US', 'CA'],
          domains: ['example.com', 'test.com']
        },
        reputation: {
          score: 85,
          status: 'Good',
          riskLevel: 'Low'
        }
      }
    });

    setTracking(false);
  };

  const trackSocialMedia = async () => {
    setTracking(true);
    setProgress(0);
    
    const steps = [
      { percent: 20, message: 'Searching major platforms...' },
      { percent: 40, message: 'Analyzing profile data...' },
      { percent: 60, message: 'Cross-referencing information...' },
      { percent: 80, message: 'Checking connected accounts...' },
      { percent: 100, message: 'Done!' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 750));
      setProgress(step.percent);
    }

    setResults({
      type: 'social',
      input: username,
      timestamp: new Date().toISOString(),
      status: 'success',
      data: {
        username: username,
        platforms: [
          {
            name: 'Twitter',
            url: `https://twitter.com/${username}`,
            found: true,
            verified: true,
            followers: 15420,
            following: 892,
            posts: 3456,
            joined: '2015-03-20',
            bio: 'Tech enthusiast | Security researcher',
            location: 'San Francisco, CA'
          },
          {
            name: 'GitHub',
            url: `https://github.com/${username}`,
            found: true,
            verified: true,
            repositories: 45,
            followers: 234,
            stars: 1200,
            contributions: 'Very active'
          },
          {
            name: 'LinkedIn',
            url: `https://linkedin.com/in/${username}`,
            found: true,
            verified: true,
            connections: '500+',
            title: 'Senior Security Engineer',
            company: 'Tech Corp'
          },
          {
            name: 'Instagram',
            url: `https://instagram.com/${username}`,
            found: true,
            verified: false,
            followers: 2340,
            posts: 156
          },
          {
            name: 'Facebook',
            url: `https://facebook.com/${username}`,
            found: false
          }
        ],
        associatedEmails: [
          'user@example.com',
          'user@gmail.com'
        ],
        associatedPhones: [
          '+1 555-0123'
        ],
        commonConnections: [
          { name: 'John Doe', mutual: 15 },
          { name: 'Jane Smith', mutual: 8 }
        ],
        activityPatterns: {
          mostActiveTime: '9-11 AM PST',
          postingFrequency: 'Daily',
          lastActivity: '2 hours ago'
        },
        interests: [
          'Cybersecurity',
          'Programming',
          'Machine Learning',
          'Photography'
        ],
        riskIndicators: {
          publicEmail: true,
          publicPhone: false,
          locationSharing: true,
          oversharing: 'Medium'
        }
      }
    });

    setTracking(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportResults = () => {
    if (!results) return;
    
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tracking-report-${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">🔍 Intelligence Tracker</h1>
        <p className="text-gray-600">Advanced OSINT & Forensic Investigation Tools</p>
        <Badge className="bg-green-500 animate-pulse">
          <Shield className="mr-1 h-3 w-3" />
          Real-Time Tracking Active
        </Badge>
      </div>

      {/* Warning Alert */}
      <Alert className="border-yellow-500 bg-yellow-50">
        <AlertTriangle className="h-5 w-5 text-yellow-600" />
        <AlertDescription>
          <strong>Legal Notice:</strong> This tool is for authorized investigations only. 
          Ensure you have permission before tracking any information.
        </AlertDescription>
      </Alert>

      {/* Main Tracking Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Select Tracking Type</CardTitle>
          <CardDescription>Choose the type of information you want to track</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="phone">
                <Phone className="mr-2 h-4 w-4" />
                Phone
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="ip">
                <Globe className="mr-2 h-4 w-4" />
                IP Address
              </TabsTrigger>
              <TabsTrigger value="social">
                <User className="mr-2 h-4 w-4" />
                Social Media
              </TabsTrigger>
            </TabsList>

            {/* Phone Tracking */}
            <TabsContent value="phone" className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="w-full p-3 border rounded-lg"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Button 
                  onClick={trackPhoneNumber} 
                  disabled={tracking || !phoneNumber}
                  className="w-full"
                  size="lg"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Track Phone Number
                </Button>
              </div>
            </TabsContent>

            {/* Email Tracking */}
            <TabsContent value="email" className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  placeholder="example@domain.com"
                  className="w-full p-3 border rounded-lg"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
                <Button 
                  onClick={trackEmail} 
                  disabled={tracking || !emailAddress}
                  className="w-full"
                  size="lg"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Track Email Address
                </Button>
              </div>
            </TabsContent>

            {/* IP Tracking */}
            <TabsContent value="ip" className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">IP Address</label>
                <input
                  type="text"
                  placeholder="192.168.1.1"
                  className="w-full p-3 border rounded-lg"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                />
                <Button 
                  onClick={trackIP} 
                  disabled={tracking || !ipAddress}
                  className="w-full"
                  size="lg"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Track IP Address
                </Button>
              </div>
            </TabsContent>

            {/* Social Media Tracking */}
            <TabsContent value="social" className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Username</label>
                <input
                  type="text"
                  placeholder="username"
                  className="w-full p-3 border rounded-lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button 
                  onClick={trackSocialMedia} 
                  disabled={tracking || !username}
                  className="w-full"
                  size="lg"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Track Social Media
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Progress Bar */}
          {tracking && (
            <div className="mt-4 space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-center text-gray-600">
                Tracking in progress... {progress}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Display */}
      {results && !tracking && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  Tracking Results
                </CardTitle>
                <CardDescription>
                  Analysis completed at {new Date(results.timestamp).toLocaleString()}
                </CardDescription>
              </div>
              <Button variant="outline" onClick={exportResults}>
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-xs overflow-auto max-h-96">
                {JSON.stringify(results.data, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
