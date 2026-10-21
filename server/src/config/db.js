import mongoose from 'mongoose';

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    if (!uri) {
      console.warn('[DB] No MONGODB_URI provided in environment. Starting in-memory MongoDB for local/test mode...');
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongoMemoryServer = await MongoMemoryServer.create();
        uri = mongoMemoryServer.getUri();
        console.log(`[DB] In-memory MongoDB started at: ${uri}`);
      } catch (memErr) {
        console.error('[DB] Failed to start MongoMemoryServer, falling back to local MongoDB:', memErr.message);
        uri = 'mongodb://127.0.0.1:27017/placement_portal';
      }
    }

    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`[DB] MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`[DB] Connection Error: ${error.message}`);
    // If it was an external URI attempt that failed during dev/test, fallback to in-memory
    if (process.env.NODE_ENV !== 'production' && !mongoMemoryServer) {
      try {
        console.warn('[DB] Attempting fallback to in-memory MongoDB...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongoMemoryServer = await MongoMemoryServer.create();
        const uri = mongoMemoryServer.getUri();
        const conn = await mongoose.connect(uri);
        console.log(`[DB] Fallback in-memory MongoDB Connected: ${conn.connection.host}`);
        return conn;
      } catch (fallbackErr) {
        console.error('[DB] Fallback failed:', fallbackErr.message);
        throw error;
      }
    }
    throw error;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
      mongoMemoryServer = null;
    }
    console.log('[DB] MongoDB connection closed');
  } catch (err) {
    console.error('[DB] Disconnect error:', err.message);
  }
};
