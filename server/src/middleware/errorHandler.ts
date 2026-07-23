import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';
import logger from '../config/logger';
import { env } from '../config/environment';

// ─────────────────────────────────────────────────────────────────────────────
// Global Error Handler Middleware
// Must be the last middleware registered with app.use()
// ─────────────────────────────────────────────────────────────────────────────

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorDetail: string | undefined;

  // ── Handle known operational errors ────────────────────────────────────────
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    if (env.NODE_ENV === 'development') errorDetail = err.stack;
  }

  // ── Handle Zod validation errors ───────────────────────────────────────────
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errorDetail = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
  }

  // ── Handle Mongoose duplicate key ──────────────────────────────────────────
  else if ((err as NodeJS.ErrnoException).name === 'MongoServerError' && (err as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate key error — resource already exists';
  }

  // ── Handle Mongoose cast errors ────────────────────────────────────────────
  else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource ID format';
  }

  // ── Unknown errors ──────────────────────────────────────────────────────────
  else {
    logger.error('Unhandled error', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
    if (env.NODE_ENV === 'development') errorDetail = err.stack;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errorDetail && { error: errorDetail }),
    statusCode,
    timestamp: new Date().toISOString(),
  });
}

export default errorHandler;
