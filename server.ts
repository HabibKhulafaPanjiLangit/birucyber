// server.ts - Next.js Standalone + Socket.IO
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const currentPort = parseInt(process.env.PORT || '3000', 10);
const hostname = '0.0.0.0';

// Custom server with Socket.IO integration
async function createCustomServer() {
  try {
    console.log(`> Starting server in ${dev ? 'development' : 'production'} mode...`);
    console.log(`> Port: ${currentPort}`);
    console.log(`> Hostname: ${hostname}`);
    
    // Create Next.js app
    const nextApp = next({ 
      dev,
      dir: process.cwd(),
      hostname,
      port: currentPort
    });

    console.log('> Preparing Next.js app...');
    await nextApp.prepare();
    console.log('> Next.js app prepared successfully');
    
    const handle = nextApp.getRequestHandler();

    // Create HTTP server that will handle both Next.js and Socket.IO
    const server = createServer((req, res) => {
      // Enable CORS for all requests
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }
      
      // Skip socket.io requests from Next.js handler
      if (req.url?.startsWith('/api/socketio')) {
        return;
      }
      
      handle(req, res).catch((err) => {
        console.error('Error handling request:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      });
    });

    // Setup Socket.IO with error handling
    console.log('> Setting up Socket.IO server...');
    const io = new Server(server, {
      path: '/api/socketio',
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling'],
      allowEIO3: true,
      pingTimeout: 60000,
      pingInterval: 25000
    });

    // Socket.IO connection handler
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
      
      socket.on('error', (err) => {
        console.error('Socket error:', err);
      });
    });

    console.log('> Socket.IO server configured');

    // Start the server with error handling
    await new Promise<void>((resolve, reject) => {
      server.listen(currentPort, hostname, () => {
        console.log(`> Server started successfully!`);
        console.log(`> Environment: ${process.env.NODE_ENV}`);
        console.log(`> Ready on http://${hostname}:${currentPort}`);
        console.log(`> Socket.IO: ws://${hostname}:${currentPort}/api/socketio`);
        console.log(`> Health check: http://${hostname}:${currentPort}/api/health`);
        resolve();
      });

      server.on('error', (err) => {
        console.error('Server error:', err);
        reject(err);
      });
    });

    // Graceful shutdown
    const shutdown = () => {
      console.log('Shutdown signal received, closing server...');
      
      io.close(() => {
        console.log('Socket.IO closed');
      });
      
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
      
      // Force shutdown after 10s
      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    process.on('uncaughtException', (err) => {
      console.error('Uncaught exception:', err);
      shutdown();
    });
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled rejection at:', promise, 'reason:', reason);
    });

  } catch (err) {
    console.error('Server startup error:', err);
    console.error('Stack trace:', err instanceof Error ? err.stack : 'No stack trace');
    process.exit(1);
  }
}

// Start the server
console.log('> Initializing server...');
createCustomServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
