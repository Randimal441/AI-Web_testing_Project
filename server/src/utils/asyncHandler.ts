import { Request, Response, NextFunction, RequestHandler } from 'express';

// ─────────────────────────────────────────────────────────────────────────────
// Async Handler Wrapper
// Wraps async route handlers to automatically catch rejected promises
// and forward them to Express's error handling middleware.
// ─────────────────────────────────────────────────────────────────────────────

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

export function asyncHandler(fn: AsyncRequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default asyncHandler;
