import { NextFunction, Request, Response } from 'express';
import { AdminUser, IAdminUser } from '../models/AdminUser.js';
import { ApiError } from '../utils/ApiError.js';
import { ACCESS_COOKIE_NAME } from '../utils/cookies.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { asyncHandler } from './asyncHandler.js';

declare global {
  namespace Express {
    interface Request {
      admin?: IAdminUser;
    }
  }
}

function extractAccessToken(req: Request): string | null {
  const cookieToken = req.cookies?.[ACCESS_COOKIE_NAME];
  if (typeof cookieToken === 'string' && cookieToken.trim()) {
    return cookieToken.trim();
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token) return token;
  }

  return null;
}

export const requireAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = extractAccessToken(req);
    if (!token) {
      throw ApiError.unauthorized('Authentication required. Please sign in.');
    }

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      throw ApiError.unauthorized('Invalid or expired access token.', 'INVALID_TOKEN');
    }

    const admin = await AdminUser.findById(payload.sub);
    if (!admin) {
      throw ApiError.unauthorized('Manager account no longer exists.', 'INVALID_TOKEN');
    }

    if (admin.tokenVersion !== payload.tokenVersion) {
      throw ApiError.unauthorized(
        'Session is no longer valid after a security update. Please sign in again.',
        'SESSION_REVOKED'
      );
    }

    req.admin = admin;
    next();
  }
);
