import http from 'node:http';
import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';

let server: http.Server | null = null;

async function bootstrap(): Promise<void> {
  if (!env.MONGODB_URI || !env.JWT_ACCESS_SECRET || !env.JWT_REFRESH_SECRET) {
    throw new Error(
      'Missing required environment variables. Copy backend/.env.example to backend/.env and configure MONGODB_URI, JWT_ACCESS_SECRET, and JWT_REFRESH_SECRET.'
    );
  }

  await connectDatabase();

  const app = createApp();
  server = app.listen(env.PORT, () => {
    console.info(
      `[NexorDive API] Listening on http://localhost:${env.PORT} (${env.NODE_ENV})`
    );
  });
}

async function shutdown(signal: string): Promise<void> {
  console.info(`[NexorDive API] Received ${signal}. Shutting down gracefully...`);

  if (server) {
    await new Promise<void>((resolve) => {
      server?.close(() => resolve());
    });
  }

  await disconnectDatabase();
  process.exit(0);
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  console.error('[NexorDive API] Unhandled Rejection:', reason);
  void shutdown('unhandledRejection');
});

bootstrap().catch((err) => {
  console.error('[NexorDive API] Startup failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
