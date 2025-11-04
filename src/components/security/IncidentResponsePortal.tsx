"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, Shield, FileSearch, Lock, RefreshCw, 
  CheckCircle, XCircle, AlertCircle, Download, Upload,
  Eye, Server, Database, Network, Key, Bell
} from 'lucide-react';

interface IncidentReport {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  timestamp: Date;
  status: 'open' | 'investigating' | 'resolved';
}

export default function IncidentResponsePortal() {
  const [activeStep, setActiveStep] = useState(1);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [scanResults, setScanResults] = useState<any>(null);

  const incidentTypes = [
    { id: 'malware', name: 'Malware/Virus', icon: AlertTriangle, color: 'text-red-500' },
    { id: 'phishing', name: 'Phishing Attack', icon: Shield, color: 'text-orange-500' },
    { id: 'data-breach', name: 'Data Breach', icon: Database, color: 'text-purple-500' },
    { id: 'ransomware', name: 'Ransomware', icon: Lock, color: 'text-red-600' },
    { id: 'ddos', name: 'DDoS Attack', icon: Network, color: 'text-blue-500' },
    { id: 'unauthorized', name: 'Unauthorized Access', icon: Key, color: 'text-yellow-500' },
  ];

  const emergencySteps = [
    {
      step: 1,
      title: '🚨 Immediate Response',
      actions: [
        { action: 'Disconnect from network', critical: true, automated: true },
        { action: 'Change all passwords', critical: true, automated: false },
        { action: 'Enable 2FA on all accounts', critical: true, automated: false },
        { action: 'Backup important data', critical: false, automated: true },
      ]
    },
    {
      step: 2,
      title: '🔍 Investigation',
      actions: [
        { action: 'Run malware scan', critical: true, automated: true },
        { action: 'Check system logs', critical: true, automated: true },
        { action: 'Identify compromised accounts', critical: true, automated: false },
        { action: 'Document all findings', critical: false, automated: false },
      ]
    },
    {
      step: 3,
      title: '🔧 Recovery',
      actions: [
        { action: 'Remove malicious files', critical: true, automated: true },
        { action: 'Restore from clean backup', critical: true, automated: false },
        { action: 'Update all software', critical: true, automated: true },
        { action: 'Implement security patches', critical: true, automated: true },
      ]
    },
    {
      step: 4,
      title: '🛡️ Prevention',
      actions: [
        { action: 'Install security software', critical: true, automated: true },
        { action: 'Setup firewall rules', critical: true, automated: true },
        { action: 'Enable monitoring', critical: true, automated: true },
        { action: 'Schedule security audits', critical: false, automated: false },
      ]
    }
  ];

  const handleQuickScan = async () => {
    setScanResults({ scanning: true });
    
    // Simulate comprehensive scan
    setTimeout(() => {
      setScanResults({
        scanning: false,
        threats: [
          { type: 'Suspicious process', severity: 'high', name: 'Unknown.exe', path: 'C:\\Temp\\' },
          { type: 'Modified system file', severity: 'critical', name: 'kernel32.dll', path: 'C:\\Windows\\System32\\' },
          { type: 'Unusual network activity', severity: 'medium', name: 'Port 4444', path: 'Network' },
        ],
        vulnerabilities: [
          { cve: 'CVE-2024-1234', severity: 'high', description: 'SQL Injection in login form' },
          { cve: 'CVE-2024-5678', severity: 'medium', description: 'XSS in search function' },
        ],
        systemHealth: {
          cpu: 'Normal',
          memory: 'High usage detected',
          disk: 'Normal',
          network: 'Unusual outbound traffic'
        }
      });
    }, 3000);
  };

  const handleAutomatedAction = (action: string) => {
    alert(`Executing automated action: ${action}`);
    // In production, this would trigger actual security actions
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Emergency Banner */}
      <Alert className="border-red-500 bg-red-50">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <AlertDescription className="ml-2">
          <strong>Emergency Response Portal</strong> - Jika Anda yakin telah diretas, ikuti langkah-langkah di bawah ini dengan hati-hati.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="wizard" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="wizard">🧙 Wizard</TabsTrigger>
          <TabsTrigger value="scan">🔍 Quick Scan</TabsTrigger>
          <TabsTrigger value="forensic">🔬 Forensic</TabsTrigger>
          <TabsTrigger value="recovery">🔧 Recovery</TabsTrigger>
          <TabsTrigger value="reports">📊 Reports</TabsTrigger>
        </TabsList>

        {/* Wizard Tab */}
        <TabsContent value="wizard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Response Wizard</CardTitle>
              <CardDescription>Step {activeStep} of 4 - Follow these steps carefully</CardDescription>
            </CardHeader>
            <CardContent>
              {emergencySteps.map((stepData) => (
                activeStep === stepData.step && (
                  <div key={stepData.step} className="space-y-4">
                    <h3 className="text-2xl font-bold">{stepData.title}</h3>
                    <div className="space-y-2">
                      {stepData.actions.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {item.critical ? (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            ) : (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                            <span className={item.critical ? 'font-semibold' : ''}>
                              {item.action}
                            </span>
                            {item.critical && (
                              <Badge variant="destructive">Critical</Badge>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            {item.automated ? (
                              <Button 
                                size="sm" 
                                onClick={() => handleAutomatedAction(item.action)}
                              >
                                Auto Execute
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline">
                                Manual Guide
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-6">
                      <Button
                        variant="outline"
                        disabled={activeStep === 1}
                        onClick={() => setActiveStep(activeStep - 1)}
                      >
                        Previous
                      </Button>
                      <Button
                        disabled={activeStep === 4}
                        onClick={() => setActiveStep(activeStep + 1)}
                      >
                        Next Step
                      </Button>
                    </div>
                  </div>
                )
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Scan Tab */}
        <TabsContent value="scan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Security Scan</CardTitle>
              <CardDescription>Scan sistem Anda untuk ancaman keamanan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleQuickScan} className="w-full" size="lg">
                <FileSearch className="mr-2 h-5 w-5" />
                Start Comprehensive Scan
              </Button>

              {scanResults?.scanning && (
                <div className="text-center py-8">
                  <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
                  <p className="text-lg">Scanning your system...</p>
                </div>
              )}

              {scanResults && !scanResults.scanning && (
                <div className="space-y-4">
                  {/* Threats Found */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                      Threats Detected ({scanResults.threats.length})
                    </h3>
                    <div className="space-y-2">
                      {scanResults.threats.map((threat: any, idx: number) => (
                        <div key={idx} className="p-3 border border-red-200 rounded-lg bg-red-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-red-700">{threat.name}</p>
                              <p className="text-sm text-gray-600">{threat.path}</p>
                              <Badge variant="destructive" className="mt-1">
                                {threat.severity}
                              </Badge>
                            </div>
                            <Button size="sm" variant="destructive">
                              Quarantine
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vulnerabilities */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-yellow-500" />
                      Vulnerabilities ({scanResults.vulnerabilities.length})
                    </h3>
                    <div className="space-y-2">
                      {scanResults.vulnerabilities.map((vuln: any, idx: number) => (
                        <div key={idx} className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{vuln.cve}</p>
                              <p className="text-sm text-gray-600">{vuln.description}</p>
                            </div>
                            <Button size="sm" variant="outline">
                              Fix Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Health */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Server className="mr-2 h-5 w-5 text-blue-500" />
                      System Health
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(scanResults.systemHealth).map(([key, value]: any) => (
                        <div key={key} className="p-3 border rounded-lg">
                          <p className="text-sm text-gray-600 capitalize">{key}</p>
                          <p className="font-semibold">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forensic Tab */}
        <TabsContent value="forensic" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileSearch className="mr-2 h-5 w-5" />
                  Log Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="mr-2 h-4 w-4" />
                  Analyze System Logs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="mr-2 h-4 w-4" />
                  Check Access Logs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="mr-2 h-4 w-4" />
                  Network Traffic Analysis
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="mr-2 h-4 w-4" />
                  Failed Login Attempts
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  File Integrity Check
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify System Files
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Check Database Integrity
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Scan for Rootkits
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Hidden Files Detection
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recovery Tab */}
        <TabsContent value="recovery" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Download className="mr-2 h-4 w-4" />
                  Backup & Restore
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button size="sm" variant="outline" className="w-full">
                  Create Backup
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  Restore from Backup
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  View Backups
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  System Recovery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button size="sm" variant="outline" className="w-full">
                  Reset Passwords
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  Revoke Sessions
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  Clean Temp Files
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Shield className="mr-2 h-4 w-4" />
                  Security Hardening
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button size="sm" variant="outline" className="w-full">
                  Update Software
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  Apply Patches
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  Configure Firewall
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Incident Reports</CardTitle>
              <CardDescription>History of security incidents and responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {incidents.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No incidents reported yet</p>
                ) : (
                  incidents.map((incident, idx) => (
                    <div key={idx} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{incident.type}</h4>
                          <p className="text-sm text-gray-600">{incident.description}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {incident.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <Badge>{incident.status}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Action Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Emergency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full">
              Lock All Accounts Now
            </Button>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-700 flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Get Help
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Contact Security Expert
            </Button>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Prevention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Setup Security Monitoring
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
