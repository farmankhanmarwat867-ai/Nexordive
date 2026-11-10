import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

function createLimiter(options: {
  windowMs: number;
  max: number;
  message: string;
  code: string;
}) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => env.isTest,
    handler: (_req, res) => {
      res.status(429).json({
        success: false,
        code: options.code,
        message: options.message,
      });
    },
  });
}

export const globalRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  code: 'RATE_LIMITED',
  message: 'Too many requests from this IP. Please try again later.',
});

export const authRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  code: 'AUTH_RATE_LIMITED',
  message: 'Too many authentication attempts. Please wait 15 minutes and try again.',
});

export const publicLeadRateLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 12,
  code: 'LEAD_RATE_LIMITED',
  message: 'Too many inquiries submitted recently. Please wait before submitting another request.',
});
