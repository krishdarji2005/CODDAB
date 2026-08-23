// Minimal bootstrap for the backend
import 'dotenv/config'; // load .env variables automatically
import app from './src/app.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initializeSocket } from './src/sockets/index.js';
import { connectDB } from './src/config/db.js';

// Create HTTP server and attach Express app
const httpServer = createServer(app);

// Instantiate Socket.io – cors settings match the original
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    // Register all socket handlers (room & collaboration)
    initializeSocket(io);
    // Start listening
    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Server startup aborted due to DB connection error');
    process.exit(1);
  }
};

startServer();
