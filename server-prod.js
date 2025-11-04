// server-prod.js - Production server (JavaScript version)
const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = false; // Always production
const currentPort = parseInt(process.env.PORT || '3000', 10);
const hostname = '0.0.0.0';

// Create Next.js app
const app = next({ dev, hostname, port: currentPort });
const handle = app.getRequestHandler();

async function startServer() {
  try {
    console.log('> Preparing Next.js...');
    await app.prepare();
    
    console.log('> Creating HTTP server...');
    const server = createServer((req, res) => {
      handle(req, res);
    });
    
    console.log('> Configuring Socket.IO...');
    const io = new Server(server, {
      path: '/api/socketio',
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
    
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      socket.on('scan:start', (data) => {
        console.log('Scan started:', data);
        socket.emit('scan:progress', { progress: 0 });
      });
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
    
    server.listen(currentPort, hostname, () => {
      console.log(`> Ready on http://${hostname}:${currentPort}`);
      console.log(`> Socket.IO on ws://${hostname}:${currentPort}/api/socketio`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

startServer();
