import { NextFunction, Request, Response } from 'express';

const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Recursively strips MongoDB query operator keys (starting with `$`),
 * prototype-pollution keys, and NUL bytes from strings.
 */
export function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return value.replace(/\0/g, '');
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (value !== null && typeof value === 'object') {
    const clean: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (key.startsWith('$') || BLOCKED_KEYS.has(key)) {
        continue;
      }
      clean[key] = sanitizeValue(val);
    }
    return clean;
  }

  return value;
}

export function sanitizeInput(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params) as Record<string, string>;
  }
  next();
}
