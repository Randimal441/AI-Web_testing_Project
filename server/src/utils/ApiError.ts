// ─────────────────────────────────────────────────────────────────────────────
// Custom API Error Class
// ─────────────────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    stack = '',
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, ApiError.prototype);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // ── Factory helpers ──────────────────────────────────────────────────────
  static badRequest(message = 'Bad Request'): ApiError {
    return new ApiError(400, message);
  }

  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError(403, message);
  }

  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(404, message);
  }

  static conflict(message = 'Conflict'): ApiError {
    return new ApiError(409, message);
  }

  static tooManyRequests(message = 'Too many requests'): ApiError {
    return new ApiError(429, message);
  }

  static internal(message = 'Internal Server Error'): ApiError {
    return new ApiError(500, message, false);
  }
}

export default ApiError;
