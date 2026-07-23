import mongoose from 'mongoose';
import { env } from './environment';
import logger from './logger';

// ─────────────────────────────────────────────────────────────────────────────
// MongoDB Connection Manager
// ─────────────────────────────────────────────────────────────────────────────

const MONGO_OPTIONS: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 10_000, // 10s timeout to find primary
  socketTimeoutMS: 45_000,          // close sockets after 45s idle
  maxPoolSize: 10,                  // maintain up to 10 socket connections
};

export async function connectDatabase(): Promise<void> {
  try {
    logger.info('Connecting to MongoDB…', { uri: env.MONGODB_URI.replace(/\/\/[^@]+@/, '//***@') });

    await mongoose.connect(env.MONGODB_URI, MONGO_OPTIONS);

    logger.info('✅  MongoDB connected successfully', {
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    });
  } catch (error) {
    logger.error('❌  MongoDB connection failed', { error });
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection', { error });
  }
}

// ── Connection lifecycle events ───────────────────────────────────────────────
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected — attempting to reconnect…');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error', { error: err.message });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

export default mongoose;
