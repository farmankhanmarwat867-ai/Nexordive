import bcrypt from 'bcryptjs';
import { AUTH_LIMITS } from '../constants/index.js';
import { AdminUser, IAdminUser } from '../models/AdminUser.js';
import { ApiError } from '../utils/ApiError.js';
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';

export interface AuthTokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSessionResult {
  admin: Record<string, unknown>;
  tokens: AuthTokenPair;
}

function issueTokenPair(admin: IAdminUser): AuthTokenPair {
  const accessToken = signAccessToken({
    sub: String(admin._id),
    email: admin.email,
    role: admin.role,
    tokenVersion: admin.tokenVersion,
  });

  const refreshToken = signRefreshToken({
    sub: String(admin._id),
    tokenVersion: admin.tokenVersion,
  });

  return { accessToken, refreshToken };
}

function appendRefreshTokenHash(existing: string[], rawRefreshToken: string): string[] {
  const next = [...existing, hashToken(rawRefreshToken)];
  return next.slice(-AUTH_LIMITS.MAX_ACTIVE_REFRESH_TOKENS);
}

export async function getAuthStatus(): Promise<{ configured: boolean }> {
  const count = await AdminUser.countDocuments();
  return { configured: count > 0 };
}

export async function setupInitialAdmin(input: {
  name?: string;
  email: string;
  password: string;
}): Promise<AuthSessionResult> {
  const existingCount = await AdminUser.countDocuments();
  if (existingCount > 0) {
    throw ApiError.forbidden(
      'Manager account is already initialized. Please sign in instead.',
      'ALREADY_CONFIGURED'
    );
  }

  const passwordHash = await bcrypt.hash(input.password, AUTH_LIMITS.BCRYPT_ROUNDS);
  const admin = new AdminUser({
    name: input.name || 'Website Manager',
    email: input.email.trim().toLowerCase(),
    passwordHash,
    role: 'superadmin',
    lastLoginAt: new Date(),
  });

  const tokens = issueTokenPair(admin);
  admin.refreshTokenHashes = [hashToken(tokens.refreshToken)];
  await admin.save();

  return {
    admin: admin.toJSON(),
    tokens,
  };
}

export async function loginAdmin(input: {
  email: string;
  password: string;
}): Promise<AuthSessionResult> {
  const cleanEmail = input.email.trim().toLowerCase();
  const admin = await AdminUser.findOne({ email: cleanEmail }).select(
    '+passwordHash +refreshTokenHashes'
  );

  if (!admin) {
    throw ApiError.unauthorized('Invalid email or password.', 'INVALID_CREDENTIALS');
  }

  if (admin.isLocked()) {
    const minutesLeft = Math.max(
      1,
      Math.ceil(((admin.lockUntil?.getTime() || Date.now()) - Date.now()) / 60_000)
    );
    throw ApiError.locked(
      `Account temporarily locked due to multiple failed sign-in attempts. Try again in ${minutesLeft} minute(s).`
    );
  }

  const matches = await bcrypt.compare(input.password, admin.passwordHash);
  if (!matches) {
    admin.failedLoginAttempts += 1;
    if (admin.failedLoginAttempts >= AUTH_LIMITS.MAX_FAILED_LOGIN_ATTEMPTS) {
      admin.lockUntil = new Date(Date.now() + AUTH_LIMITS.LOCK_DURATION_MINUTES * 60_000);
    }
    await admin.save();
    throw ApiError.unauthorized('Invalid email or password.', 'INVALID_CREDENTIALS');
  }

  admin.failedLoginAttempts = 0;
  admin.lockUntil = null;
  admin.lastLoginAt = new Date();

  const tokens = issueTokenPair(admin);
  admin.refreshTokenHashes = appendRefreshTokenHash(
    admin.refreshTokenHashes || [],
    tokens.refreshToken
  );
  await admin.save();

  return {
    admin: admin.toJSON(),
    tokens,
  };
}

export async function refreshAdminSession(rawRefreshToken: string): Promise<AuthSessionResult> {
  let payload;
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token.', 'INVALID_REFRESH_TOKEN');
  }

  const admin = await AdminUser.findById(payload.sub).select('+refreshTokenHashes');
  if (!admin || admin.tokenVersion !== payload.tokenVersion) {
    throw ApiError.unauthorized('Session is no longer valid. Please sign in again.', 'INVALID_REFRESH_TOKEN');
  }

  const incomingHash = hashToken(rawRefreshToken);
  const existingHashes = admin.refreshTokenHashes || [];
  if (!existingHashes.includes(incomingHash)) {
    // Possible refresh token reuse — revoke all stored refresh tokens
    admin.refreshTokenHashes = [];
    admin.tokenVersion += 1;
    await admin.save();
    throw ApiError.unauthorized('Refresh token reuse detected. Please sign in again.', 'TOKEN_REVOKED');
  }

  const tokens = issueTokenPair(admin);
  const filtered = existingHashes.filter((h) => h !== incomingHash);
  admin.refreshTokenHashes = appendRefreshTokenHash(filtered, tokens.refreshToken);
  await admin.save();

  return {
    admin: admin.toJSON(),
    tokens,
  };
}

export async function logoutAdmin(adminId: string, rawRefreshToken?: string): Promise<void> {
  const admin = await AdminUser.findById(adminId).select('+refreshTokenHashes');
  if (!admin) return;

  if (rawRefreshToken) {
    const targetHash = hashToken(rawRefreshToken);
    admin.refreshTokenHashes = (admin.refreshTokenHashes || []).filter((h) => h !== targetHash);
  } else {
    admin.refreshTokenHashes = [];
  }
  await admin.save();
}

export async function updateAdminEmail(
  adminId: string,
  input: { newEmail: string; currentPassword: string }
): Promise<AuthSessionResult> {
  const admin = await AdminUser.findById(adminId).select('+passwordHash +refreshTokenHashes');
  if (!admin) {
    throw ApiError.notFound('Manager account not found.');
  }

  const passwordValid = await bcrypt.compare(input.currentPassword, admin.passwordHash);
  if (!passwordValid) {
    throw ApiError.unauthorized('Current password is incorrect.', 'INVALID_PASSWORD');
  }

  const cleanNewEmail = input.newEmail.trim().toLowerCase();
  if (cleanNewEmail === admin.email) {
    throw ApiError.badRequest('New login email matches your current login email.');
  }

  const duplicate = await AdminUser.findOne({ email: cleanNewEmail, _id: { $ne: admin._id } });
  if (duplicate) {
    throw ApiError.conflict('Another manager account already uses this email address.');
  }

  admin.email = cleanNewEmail;
  const tokens = issueTokenPair(admin);
  admin.refreshTokenHashes = appendRefreshTokenHash(
    admin.refreshTokenHashes || [],
    tokens.refreshToken
  );
  await admin.save();

  return {
    admin: admin.toJSON(),
    tokens,
  };
}

export async function changeAdminPassword(
  adminId: string,
  input: { currentPassword: string; newPassword: string }
): Promise<AuthSessionResult> {
  const admin = await AdminUser.findById(adminId).select('+passwordHash +refreshTokenHashes');
  if (!admin) {
    throw ApiError.notFound('Manager account not found.');
  }

  const passwordValid = await bcrypt.compare(input.currentPassword, admin.passwordHash);
  if (!passwordValid) {
    throw ApiError.unauthorized('Current password is incorrect.', 'INVALID_PASSWORD');
  }

  if (input.currentPassword === input.newPassword) {
    throw ApiError.badRequest('New password must be different from your current password.');
  }

  admin.passwordHash = await bcrypt.hash(input.newPassword, AUTH_LIMITS.BCRYPT_ROUNDS);
  // Invalidate all previously issued sessions across devices
  admin.tokenVersion += 1;

  const tokens = issueTokenPair(admin);
  admin.refreshTokenHashes = [hashToken(tokens.refreshToken)];
  await admin.save();

  return {
    admin: admin.toJSON(),
    tokens,
  };
}
