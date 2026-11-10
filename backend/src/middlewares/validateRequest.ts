import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodTypeAny } from 'zod';
import { ApiError } from '../utils/ApiError.js';

declare global {
  namespace Express {
    interface Request {
      validatedQuery?: Record<string, unknown>;
      validatedParams?: Record<string, string>;
    }
  }
}

interface ValidationSchemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

export function validateRequest(schemas: ValidationSchemas): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const errors: { field: string; message: string }[] = [];

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        for (const issue of result.error.issues) {
          errors.push({
            field: issue.path.join('.') || 'params',
            message: issue.message,
          });
        }
      } else {
        req.validatedParams = result.data as Record<string, string>;
        req.params = result.data as Record<string, string>;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        for (const issue of result.error.issues) {
          errors.push({
            field: issue.path.join('.') || 'query',
            message: issue.message,
          });
        }
      } else {
        req.validatedQuery = result.data as Record<string, unknown>;
      }
    }

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        for (const issue of result.error.issues) {
          errors.push({
            field: issue.path.join('.') || 'body',
            message: issue.message,
          });
        }
      } else {
        req.body = result.data;
      }
    }

    if (errors.length > 0) {
      return next(
        ApiError.badRequest(
          errors[0]?.message || 'Validation failed.',
          errors,
          'VALIDATION_ERROR'
        )
      );
    }

    return next();
  };
}
