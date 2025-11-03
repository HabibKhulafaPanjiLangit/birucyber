// server.ts - Next.js Standalone + Socket.IO
import { setupSocket } from './src/lib/socket';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const currentPort = parseInt(process.env.PORT || '3000', 10);
const hostname = dev ? 'localhost' : '0.0.0.0';

// Custom server with Socket.IO integration
async function createCustomServer() {
  try {
    console.log(`> Starting server in ${dev ? 'development' : 'production'} mode...`);
    
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
      // Skip socket.io requests from Next.js handler
      if (req.url?.startsWith('/api/socketio')) {
        return;
      }
      handle(req, res);
    });

    // Setup Socket.IO
    console.log('> Setting up Socket.IO server...');
    const io = new Server(server, {
      path: '/api/socketio',
      cors: {
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling'],
      allowEIO3: true
    });

    setupSocket(io);
    console.log('> Socket.IO server configured');

    // Start the server
    server.listen(currentPort, hostname, () => {
      console.log(`> Server started successfully!`);
      console.log(`> Environment: ${process.env.NODE_ENV}`);
      console.log(`> Ready on http://${hostname}:${currentPort}`);
      console.log(`> Socket.IO server running at ws://${hostname}:${currentPort}/api/socketio`);
      console.log(`> Health check available at: http://${hostname}:${currentPort}/api/health`);
    });

    // Error handling for server
    server.on('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
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

  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
}

// Start the server
createCustomServer();
