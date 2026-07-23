import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { statsService } from '../services/statsService';
import { buildSuccess } from '../utils/responseHelpers';

// ─────────────────────────────────────────────────────────────────────────────
// Stats Controller — Dashboard Aggregation Handlers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/stats
 * Returns aggregated dashboard statistics from MongoDB.
 */
export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await statsService.getDashboardStats();
  buildSuccess(res, 200, 'Statistics retrieved successfully', stats);
});
