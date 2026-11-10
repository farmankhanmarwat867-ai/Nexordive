import { z } from 'zod';
import { AUTH_LIMITS } from '../constants/index.js';

const strongPasswordSchema = z
  .string()
  .min(
    AUTH_LIMITS.PASSWORD_MIN_LENGTH,
    `Password must be at least ${AUTH_LIMITS.PASSWORD_MIN_LENGTH} characters long.`
  )
  .max(128, 'Password must be 128 characters or fewer.')
  .refine((val) => /[A-Za-z]/.test(val) && /\d/.test(val), {
    message: 'Password must include at least one letter and one number.',
  });

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Enter a valid email address in the format name@example.com.')
  .max(160, 'Email must be 160 characters or fewer.');

export const setupAdminSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  email: emailSchema,
  password: strongPasswordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required.').max(128),
});

export const updateAdminEmailSchema = z.object({
  newEmail: emailSchema,
  currentPassword: z.string().min(1, 'Current password is required.').max(128),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required.').max(128),
  newPassword: strongPasswordSchema,
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});
