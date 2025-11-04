import { NextRequest, NextResponse } from 'next/server';

// Simulated incident reports database
const incidents = [
  {
    id: '1',
    type: 'Ransomware Attack',
    severity: 'critical' as const,
    description: 'Files encrypted with .locked extension',
    timestamp: new Date('2024-11-04T10:30:00'),
    status: 'investigating' as const,
    affectedSystems: ['Server-01', 'Workstation-05'],
    reporter: 'admin@company.com'
  },
  {
    id: '2',
    type: 'Phishing Attempt',
    severity: 'high' as const,
    description: 'Suspicious emails sent to multiple employees',
    timestamp: new Date('2024-11-04T09:15:00'),
    status: 'resolved' as const,
    affectedSystems: ['Email System'],
    reporter: 'security@company.com'
  },
  {
    id: '3',
    type: 'Unauthorized Access',
    severity: 'medium' as const,
    description: 'Failed login attempts from unknown IP',
    timestamp: new Date('2024-11-04T08:00:00'),
    status: 'open' as const,
    affectedSystems: ['Admin Panel'],
    reporter: 'monitor@company.com'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const incident = incidents.find(i => i.id === id);
      if (!incident) {
        return NextResponse.json(
          { error: 'Incident not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ incident });
    }

    // Return all incidents
    return NextResponse.json({ 
      incidents,
      stats: {
        total: incidents.length,
        critical: incidents.filter(i => i.severity === 'critical').length,
        open: incidents.filter(i => i.status === 'open').length,
        resolved: incidents.filter(i => i.status === 'resolved').length
      }
    });
  } catch (error) {
    console.error('Incidents API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newIncident = {
      id: String(incidents.length + 1),
      type: body.type,
      severity: body.severity || 'medium',
      description: body.description,
      timestamp: new Date(),
      status: 'open' as const,
      affectedSystems: body.affectedSystems || [],
      reporter: body.reporter || 'anonymous'
    };

    incidents.push(newIncident);

    return NextResponse.json({ 
      success: true,
      incident: newIncident,
      message: 'Incident reported successfully'
    });
  } catch (error) {
    console.error('Incident report error:', error);
    return NextResponse.json(
      { error: 'Failed to report incident' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    const incidentIndex = incidents.findIndex(i => i.id === id);
    if (incidentIndex === -1) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }

    incidents[incidentIndex] = {
      ...incidents[incidentIndex],
      status: status || incidents[incidentIndex].status,
      ...(notes && { notes })
    };

    return NextResponse.json({ 
      success: true,
      incident: incidents[incidentIndex],
      message: 'Incident updated successfully'
    });
  } catch (error) {
    console.error('Incident update error:', error);
    return NextResponse.json(
      { error: 'Failed to update incident' },
      { status: 500 }
    );
  }
}
