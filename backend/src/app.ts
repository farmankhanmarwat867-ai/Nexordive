import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware.js';
import { globalRateLimiter } from './middlewares/rateLimiter.js';
import { sanitizeInput } from './middlewares/sanitizeInput.js';
import { UPLOADS_DIR } from './middlewares/uploadMiddleware.js';
import apiV1Routes from './routes/index.js';
import { ApiError } from './utils/ApiError.js';

export function createApp(): Express {
  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) {
          callback(null, true);
          return;
        }
        if (env.corsOriginsList.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(ApiError.forbidden(`CORS origin "${origin}" is not allowed.`, 'CORS_FORBIDDEN'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  if (!env.isTest) {
    app.use(morgan(env.isProduction ? 'combined' : 'dev'));
  }

  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(cookieParser());
  app.use(sanitizeInput);

  app.use('/uploads', express.static(UPLOADS_DIR));

  app.get('/', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'NexorDive Backend API',
      data: {
        version: 'v1',
        health: '/api/v1/health',
      },
    });
  });

  app.use('/api', globalRateLimiter);
  app.use('/api/v1', apiV1Routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
