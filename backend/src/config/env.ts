import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const isTestEnv = process.env.NODE_ENV === 'test';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: isTestEnv
    ? z.string().trim().min(1).default('mongodb://127.0.0.1:27017/nexordive_test')
    : z.string().trim().min(1, 'MONGODB_URI is required'),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:3000,http://127.0.0.1:3000'),
  JWT_ACCESS_SECRET: isTestEnv
    ? z.string().min(16).default('test_access_secret_key_for_unit_tests_12345')
    : z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 characters'),
  JWT_REFRESH_SECRET: isTestEnv
    ? z.string().min(16).default('test_refresh_secret_key_for_unit_tests_12345')
    : z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  COOKIE_DOMAIN: z.string().optional().default(''),
  SEED_ADMIN_NAME: z.string().default('Website Manager'),
  SEED_ADMIN_EMAIL: z.string().email().optional().or(z.literal('')).default(''),
  SEED_ADMIN_PASSWORD: z.string().optional().default(''),
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  SMTP_FROM: z.string().default('NexorDive <no-reply@nexordive.com>'),
  LEADS_NOTIFY_EMAIL: z.string().email().optional().or(z.literal('')).default(''),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid environment configuration:\n${details}`);
}

const raw = parsed.data;

export const env = {
  ...raw,
  isProduction: raw.NODE_ENV === 'production',
  isDevelopment: raw.NODE_ENV === 'development',
  isTest: raw.NODE_ENV === 'test',
  corsOriginsList: raw.CORS_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};
