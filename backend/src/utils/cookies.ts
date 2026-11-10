import { CookieOptions, Response } from 'express';
import { env } from '../config/env.js';

export const ACCESS_COOKIE_NAME = 'nexordive_access_token';
export const REFRESH_COOKIE_NAME = 'nexordive_refresh_token';

function buildCookieOptions(maxAgeMs: number): CookieOptions {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: maxAgeMs,
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
  };
}

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
  res.cookie(ACCESS_COOKIE_NAME, accessToken, buildCookieOptions(15 * 60 * 1000));
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, buildCookieOptions(7 * 24 * 60 * 60 * 1000));
}

export function clearAuthCookies(res: Response): void {
  const baseOptions: CookieOptions = {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    path: '/',
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
  };
  res.clearCookie(ACCESS_COOKIE_NAME, baseOptions);
  res.clearCookie(REFRESH_COOKIE_NAME, baseOptions);
}
