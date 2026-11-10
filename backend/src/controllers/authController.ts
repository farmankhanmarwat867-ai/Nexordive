import { Request, Response } from 'express';
import * as authService from '../services/authService.js';
import { sendSecurityNotification } from '../services/mailService.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { clearAuthCookies, REFRESH_COOKIE_NAME, setAuthCookies } from '../utils/cookies.js';

export async function getStatus(_req: Request, res: Response): Promise<void> {
  const status = await authService.getAuthStatus();
  sendSuccess(res, 200, 'Authentication status retrieved.', status);
}

export async function setup(req: Request, res: Response): Promise<void> {
  const result = await authService.setupInitialAdmin(req.body);
  setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
  sendSuccess(res, 201, 'Manager account created and signed in.', {
    admin: result.admin,
    accessToken: result.tokens.accessToken,
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const result = await authService.loginAdmin(req.body);
  setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
  sendSuccess(res, 200, 'Signed in successfully.', {
    admin: result.admin,
    accessToken: result.tokens.accessToken,
  });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const rawRefreshToken =
    (typeof req.cookies?.[REFRESH_COOKIE_NAME] === 'string' && req.cookies[REFRESH_COOKIE_NAME]) ||
    (typeof req.body?.refreshToken === 'string' && req.body.refreshToken) ||
    '';

  if (!rawRefreshToken) {
    throw ApiError.unauthorized('Refresh token is missing.', 'MISSING_REFRESH_TOKEN');
  }

  const result = await authService.refreshAdminSession(rawRefreshToken);
  setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
  sendSuccess(res, 200, 'Session refreshed.', {
    admin: result.admin,
    accessToken: result.tokens.accessToken,
  });
}

export async function logout(req: Request, res: Response): Promise<void> {
  const rawRefreshToken =
    typeof req.cookies?.[REFRESH_COOKIE_NAME] === 'string'
      ? req.cookies[REFRESH_COOKIE_NAME]
      : undefined;

  if (req.admin) {
    await authService.logoutAdmin(String(req.admin._id), rawRefreshToken);
  }
  clearAuthCookies(res);
  sendSuccess(res, 200, 'Signed out successfully.', null);
}

export async function getMe(req: Request, res: Response): Promise<void> {
  if (!req.admin) {
    throw ApiError.unauthorized();
  }
  sendSuccess(res, 200, 'Manager profile retrieved.', { admin: req.admin.toJSON() });
}

export async function updateEmail(req: Request, res: Response): Promise<void> {
  if (!req.admin) {
    throw ApiError.unauthorized();
  }

  const previousEmail = req.admin.email;
  const result = await authService.updateAdminEmail(String(req.admin._id), req.body);
  setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);

  void sendSecurityNotification(
    previousEmail,
    '[NexorDive Security] Login email updated',
    `Your NexorDive manager login email was updated from ${previousEmail} to ${result.admin.email}.`
  );

  sendSuccess(res, 200, 'Manager login email updated successfully.', {
    admin: result.admin,
    accessToken: result.tokens.accessToken,
  });
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  if (!req.admin) {
    throw ApiError.unauthorized();
  }

  const result = await authService.changeAdminPassword(String(req.admin._id), req.body);
  setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);

  void sendSecurityNotification(
    req.admin.email,
    '[NexorDive Security] Manager password changed',
    'Your NexorDive manager password was just changed. Previous sessions have been signed out.'
  );

  sendSuccess(res, 200, 'Password updated and previous sessions invalidated.', {
    admin: result.admin,
    accessToken: result.tokens.accessToken,
  });
}
