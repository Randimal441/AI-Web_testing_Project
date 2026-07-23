import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

// ─────────────────────────────────────────────────────────────────────────────
// Zod Request Validation Middleware Factory
// Usage: router.post('/scans', validateRequest({ body: CreateScanSchema }), ...)
// ─────────────────────────────────────────────────────────────────────────────

interface ValidationSchemas {
  body?: AnyZodObject;
  params?: AnyZodObject;
  query?: AnyZodObject;
}

export function validateRequest(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as Request['params'];
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as Request['query'];
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join('; ');
        next(ApiError.badRequest(`Validation failed — ${messages}`));
      } else {
        next(error);
      }
    }
  };
}

export default validateRequest;
