import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

// ─────────────────────────────────────────────────────────────────────────────
// HTTP Request Logger Middleware
// Logs method, URL, status code, and response time for every request.
// ─────────────────────────────────────────────────────────────────────────────

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 500 ? 'error'
      : res.statusCode >= 400 ? 'warn'
      : 'http';

    logger[logLevel](`${req.method} ${req.originalUrl}`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  });

  next();
}

export default requestLogger;
