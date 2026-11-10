export interface ErrorDetail {
  field?: string;
  message: string;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: ErrorDetail[];
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    code = 'APP_ERROR',
    details?: ErrorDetail[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(message: string, details?: ErrorDetail[], code = 'BAD_REQUEST'): ApiError {
    return new ApiError(400, message, code, details);
  }

  static unauthorized(message = 'Authentication required.', code = 'UNAUTHORIZED'): ApiError {
    return new ApiError(401, message, code);
  }

  static forbidden(message = 'You do not have permission to perform this action.', code = 'FORBIDDEN'): ApiError {
    return new ApiError(403, message, code);
  }

  static notFound(message = 'Requested resource was not found.', code = 'NOT_FOUND'): ApiError {
    return new ApiError(404, message, code);
  }

  static conflict(message: string, code = 'CONFLICT'): ApiError {
    return new ApiError(409, message, code);
  }

  static locked(message: string, code = 'ACCOUNT_LOCKED'): ApiError {
    return new ApiError(423, message, code);
  }

  static tooManyRequests(message: string, code = 'RATE_LIMITED'): ApiError {
    return new ApiError(429, message, code);
  }
}
