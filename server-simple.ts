// Simple server without Socket.IO for testing
import { createServer } from 'http';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const currentPort = 3000;
const hostname = 'localhost';

async function start() {
  try {
    console.log('Starting Next.js...');
    
    const nextApp = next({ dev });
    await nextApp.prepare();
    
    console.log('Next.js prepared');
    
    const handle = nextApp.getRequestHandler();
    const server = createServer((req, res) => {
      handle(req, res);
    });

    server.listen(currentPort, hostname, () => {
      console.log(`✓ Server ready on http://${hostname}:${currentPort}`);
    });

    // Handle server errors
    server.on('error', (err) => {
      console.error('Server error:', err);
    });

    // Keep process alive
    process.on('SIGINT', () => {
      console.log('\nShutting down gracefully...');
      server.close(() => {
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

start();
