import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { scanService, CreateScanSchema } from '../services/scanService';
import { buildSuccess, buildPaginatedSuccess, parsePagination } from '../utils/responseHelpers';
import { ApiError } from '../utils/ApiError';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Scan Controller — Route Handlers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/scans
 * Returns a paginated list of scans.
 */
export const getScans = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query);
  const status = req.query.status as string | undefined;

  const validStatuses = ['pending', 'running', 'passed', 'failed', 'cancelled'];
  if (status && !validStatuses.includes(status)) {
    throw ApiError.badRequest(`Invalid status filter. Must be one of: ${validStatuses.join(', ')}`);
  }

  const { scans, pagination } = await scanService.getScans({
    page,
    limit,
    status: status as any,
  });

  buildPaginatedSuccess(res, 'Scans retrieved successfully', scans as any[], pagination);
});

/**
 * GET /api/v1/scans/:id
 * Returns a single scan by ID.
 */
export const getScanById = asyncHandler(async (req: Request, res: Response) => {
  const scan = await scanService.getScanById(req.params.id);
  buildSuccess(res, 200, 'Scan retrieved successfully', scan);
});

/**
 * POST /api/v1/scans
 * Creates a new scan (status: pending). Scanning is handled by playwright-engine.
 */
export const createScan = asyncHandler(async (req: Request, res: Response) => {
  const payload = CreateScanSchema.parse(req.body);
  const scan = await scanService.createScan(payload);
  buildSuccess(res, 201, 'Scan created successfully. It will start shortly.', scan);
});

/**
 * PATCH /api/v1/scans/:id/cancel
 * Cancels a pending or running scan.
 */
export const cancelScan = asyncHandler(async (req: Request, res: Response) => {
  const scan = await scanService.cancelScan(req.params.id);
  buildSuccess(res, 200, 'Scan cancelled successfully', scan);
});

/**
 * DELETE /api/v1/scans/:id
 * Deletes a scan record.
 */
export const deleteScan = asyncHandler(async (req: Request, res: Response) => {
  await scanService.deleteScan(req.params.id);
  buildSuccess(res, 200, 'Scan deleted successfully', null);
});
