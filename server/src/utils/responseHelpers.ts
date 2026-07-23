import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../../shared/src/types';

// ─────────────────────────────────────────────────────────────────────────────
// Response Helpers — ensure a consistent JSON envelope on every response
// ─────────────────────────────────────────────────────────────────────────────

export function buildSuccess<T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
): Response {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(body);
}

export function buildPaginatedSuccess<T>(
  res: Response,
  message: string,
  data: T[],
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  },
): Response {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Parse pagination query params
// ─────────────────────────────────────────────────────────────────────────────
export function parsePagination(query: Request['query']): { page: number; limit: number } {
  const page = Math.max(1, parseInt((query.page as string) ?? '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt((query.limit as string) ?? '10', 10) || 10));
  return { page, limit };
}

// Suppress unused import warning
export type { NextFunction };
