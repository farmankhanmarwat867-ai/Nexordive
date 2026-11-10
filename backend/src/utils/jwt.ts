import crypto from 'node:crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AdminRole } from '../constants/index.js';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: AdminRole;
  tokenVersion: number;
  type: 'access';
}

export interface RefreshTokenPayload {
  sub: string;
  tokenVersion: number;
  type: 'refresh';
}

export function signAccessToken(payload: Omit<AccessTokenPayload, 'type'>): string {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
  };
  return jwt.sign({ ...payload, type: 'access' }, env.JWT_ACCESS_SECRET, options);
}

export function signRefreshToken(payload: Omit<RefreshTokenPayload, 'type'>): string {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  };
  return jwt.sign({ ...payload, type: 'refresh' }, env.JWT_REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
  if (!decoded || decoded.type !== 'access' || !decoded.sub) {
    throw new Error('Invalid access token');
  }
  return decoded;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  if (!decoded || decoded.type !== 'refresh' || !decoded.sub) {
    throw new Error('Invalid refresh token');
  }
  return decoded;
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
