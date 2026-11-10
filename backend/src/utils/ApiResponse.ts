import { Response } from 'express';

export interface ApiSuccessPayload<T> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
  meta?: Record<string, unknown>
): Response<ApiSuccessPayload<T>> {
  const payload: ApiSuccessPayload<T> = {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  };
  return res.status(statusCode).json(payload);
}
