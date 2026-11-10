import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase(): Promise<typeof mongoose> {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    if (!env.isTest) {
      console.info('[NexorDive DB] MongoDB connected');
    }
  });

  mongoose.connection.on('error', (err) => {
    console.error('[NexorDive DB] MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    if (!env.isTest) {
      console.warn('[NexorDive DB] MongoDB disconnected');
    }
  });

  return mongoose.connect(env.MONGODB_URI, {
    autoIndex: !env.isProduction,
    serverSelectionTimeoutMS: 10_000,
  });
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

export function getDatabaseHealth(): 'connected' | 'connecting' | 'disconnected' | 'disconnecting' {
  switch (mongoose.connection.readyState) {
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'disconnected';
  }
}
