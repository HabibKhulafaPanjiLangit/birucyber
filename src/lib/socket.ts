import { Server } from 'socket.io';

// Store connected clients for attack monitoring
const attackMonitorClients = new Set<string>();

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);
    
    // Handle messages
    socket.on('message', (msg: { text: string; senderId: string }) => {
      // Echo: broadcast message only the client who send the message
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // ===== REAL-TIME ATTACK MONITORING =====
    
    // Subscribe to attack monitoring
    socket.on('subscribe_attacks', (data: { severity?: string }) => {
      attackMonitorClients.add(socket.id);
      console.log('🔔 Client subscribed to attack monitoring:', socket.id);
      
      socket.emit('subscription_confirmed', {
        success: true,
        clientId: socket.id,
        message: 'Subscribed to real-time attack monitoring',
        filters: data,
        timestamp: new Date().toISOString()
      });
    });

    // Unsubscribe from attack monitoring
    socket.on('unsubscribe_attacks', () => {
      attackMonitorClients.delete(socket.id);
      console.log('🔕 Client unsubscribed from attack monitoring:', socket.id);
      
      socket.emit('unsubscription_confirmed', {
        success: true,
        message: 'Unsubscribed from attack monitoring',
        timestamp: new Date().toISOString()
      });
    });

    // Request current statistics
    socket.on('request_stats', async () => {
      try {
        // In production, fetch from database
        const stats = {
          activeClients: attackMonitorClients.size,
          totalAttacks: 0,
          attacksLast24h: 0,
          criticalAlerts: 0,
          timestamp: new Date().toISOString()
        };
        
        socket.emit('stats_update', stats);
      } catch (error) {
        console.error('Stats error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      attackMonitorClients.delete(socket.id);
      console.log('❌ Client disconnected:', socket.id);
    });

    // Send welcome message
    socket.emit('connected', {
      text: '🔥 Connected to BiruCyber Security Platform',
      clientId: socket.id,
      features: [
        'Real-time Attack Monitoring',
        'Live Security Alerts',
        'Attack Statistics',
        'Threat Intelligence'
      ],
      timestamp: new Date().toISOString(),
    });
  });
};

// Broadcast attack to all subscribed clients
export const broadcastAttack = (io: Server, attack: {
  id: string;
  type: string;
  severity: string;
  attackType?: string;
  target?: string;
  ipAddress?: string;
  timestamp: Date;
}) => {
  if (attackMonitorClients.size > 0) {
    io.emit('attack_detected', {
      ...attack,
      timestamp: attack.timestamp.toISOString(),
      icon: getAttackIcon(attack.type),
      alertLevel: getAlertLevel(attack.severity)
    });

    console.log(`🚨 Broadcasting attack to ${attackMonitorClients.size} clients:`, attack.type);
  }
};

// Broadcast critical alert
export const broadcastCriticalAlert = (io: Server, alert: {
  message: string;
  severity: string;
  details: any;
}) => {
  io.emit('critical_alert', {
    ...alert,
    timestamp: new Date().toISOString(),
    requiresAction: true
  });

  console.log('🔴 CRITICAL ALERT BROADCAST:', alert.message);
};

// Broadcast statistics update
export const broadcastStats = (io: Server, stats: any) => {
  io.emit('stats_update', {
    ...stats,
    timestamp: new Date().toISOString()
  });
};

// Helper functions
function getAttackIcon(type: string): string {
  const icons: Record<string, string> = {
    'SQL Injection': '💉',
    'XSS': '⚡',
    'CSRF': '🎭',
    'Access Control': '🔓',
    'Brute Force': '🔨',
    'Security Headers': '🛡️'
  };
  return icons[type] || '⚠️';
}

function getAlertLevel(severity: string): string {
  const levels: Record<string, string> = {
    critical: '🔴 CRITICAL',
    high: '🟠 HIGH',
    medium: '🟡 MEDIUM',
    low: '🟢 LOW'
  };
  return levels[severity] || '⚪ INFO';
}

// Export client count for monitoring
export const getActiveClients = () => attackMonitorClients.size;