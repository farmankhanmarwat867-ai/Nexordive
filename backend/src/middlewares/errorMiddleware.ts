import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`, 'ROUTE_NOT_FOUND'));
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected server error occurred.';
  let details: { field?: string; message: string }[] | undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  } else if (err instanceof multer.MulterError) {
    statusCode = 400;
    code = 'UPLOAD_ERROR';
    message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Uploaded file exceeds the 5MB limit.'
        : err.message;
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    code = 'DB_VALIDATION_ERROR';
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    message = details[0]?.message || 'Database validation failed.';
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    code = 'INVALID_IDENTIFIER';
    message = `Invalid identifier for field "${err.path}".`;
  } else if (err && typeof err === 'object' && 'code' in err && (err as { code?: number }).code === 11000) {
    statusCode = 409;
    code = 'DUPLICATE_KEY';
    const keyValue = (err as { keyValue?: Record<string, unknown> }).keyValue;
    const duplicateField = keyValue ? Object.keys(keyValue)[0] : undefined;
    message = duplicateField
      ? `A record with this ${duplicateField} already exists.`
      : 'Duplicate record conflict.';
  } else if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400;
    code = 'INVALID_JSON';
    message = 'Malformed JSON request body.';
  } else if (err instanceof Error) {
    message = env.isProduction ? 'An unexpected server error occurred.' : err.message;
  }

  if (statusCode >= 500 && !env.isTest) {
    console.error('[NexorDive API Error]', err);
  }

  res.status(statusCode).json({
    success: false,
    code,
    message,
    ...(details ? { details } : {}),
    ...(!env.isProduction && err instanceof Error && statusCode >= 500 ? { stack: err.stack } : {}),
  });
};
