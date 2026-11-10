import { Request, Response } from 'express';
import { getDatabaseHealth } from '../config/database.js';
import { env } from '../config/env.js';
import { sendSuccess } from '../utils/ApiResponse.js';

export async function getHealth(_req: Request, res: Response): Promise<void> {
  const dbStatus = getDatabaseHealth();
  const isHealthy = dbStatus === 'connected';

  sendSuccess(
    res,
    isHealthy ? 200 : 503,
    isHealthy ? 'NexorDive API is healthy.' : 'NexorDive API is degraded (database unavailable).',
    {
      status: isHealthy ? 'ok' : 'degraded',
      environment: env.NODE_ENV,
      uptimeSeconds: Math.floor(process.uptime()),
      database: dbStatus,
      timestamp: new Date().toISOString(),
    }
  );
}
