import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { seedDatabase } from './seed/seedRunner.js';
import User from './models/User.js';

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Check if DB has initial seed data; if empty, seed automatically
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Startup] Database appears empty. Running initial demo seed...');
      await seedDatabase();
    }

    // 3. Start Express HTTP Server
    server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(` Placement Preparation Portal REST API Server`);
      console.log(` Status      : Online`);
      console.log(` Port        : ${PORT}`);
      console.log(` Environment : ${process.env.NODE_ENV || 'development'}`);
      console.log(` Health Check: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('[Startup] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Rejection]', err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n[Shutdown] Received ${signal}. Closing server gracefully...`);
  if (server) {
    server.close(async () => {
      await disconnectDB();
      console.log('[Shutdown] All connections closed. Exiting process.');
      process.exit(0);
    });
  } else {
    await disconnectDB();
    process.exit(0);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
