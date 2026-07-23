import { Scan, IScan } from '../models/Scan';
import { ApiError } from '../utils/ApiError';
import { buildPaginationMeta } from '../../../shared/src/utils';
import { CreateScanPayload } from '../../../shared/src/types';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Zod Validation Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const CreateScanSchema = z.object({
  url: z
    .string({ required_error: 'URL is required' })
    .url('Must be a valid URL')
    .refine(
      (u) => u.startsWith('http://') || u.startsWith('https://'),
      'URL must use http or https protocol',
    ),
  label: z.string().trim().max(100).optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Scan Service — Business Logic
// ─────────────────────────────────────────────────────────────────────────────

export interface GetScansOptions {
  page: number;
  limit: number;
  status?: IScan['status'];
}

export interface GetScansResult {
  scans: IScan[];
  pagination: ReturnType<typeof buildPaginationMeta>;
}

export const scanService = {
  /**
   * Retrieve a paginated list of scans, newest first.
   */
  async getScans({ page, limit, status }: GetScansOptions): Promise<GetScansResult> {
    const filter = status ? { status } : {};
    const skip = (page - 1) * limit;

    const [scans, total] = await Promise.all([
      Scan.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Scan.countDocuments(filter),
    ]);

    return {
      scans: scans as unknown as IScan[],
      pagination: buildPaginationMeta(total, page, limit),
    };
  },

  /**
   * Retrieve a single scan by its MongoDB ObjectId.
   */
  async getScanById(id: string): Promise<IScan> {
    const scan = await Scan.findById(id).lean();
    if (!scan) throw ApiError.notFound(`Scan with id "${id}" not found`);
    return scan as unknown as IScan;
  },

  /**
   * Create a new scan record with status 'pending'.
   * The actual scanning is handled by the playwright-engine (future).
   */
  async createScan(payload: CreateScanPayload): Promise<IScan> {
    const scan = await Scan.create({
      url: payload.url.trim(),
      label: payload.label?.trim(),
      status: 'pending',
    });
    return scan;
  },

  /**
   * Cancel a pending or running scan.
   */
  async cancelScan(id: string): Promise<IScan> {
    const scan = await Scan.findById(id);
    if (!scan) throw ApiError.notFound(`Scan with id "${id}" not found`);

    if (!['pending', 'running'].includes(scan.status)) {
      throw ApiError.badRequest(`Cannot cancel a scan with status "${scan.status}"`);
    }

    scan.status = 'cancelled';
    await scan.save();
    return scan;
  },

  /**
   * Delete a scan by ID.
   */
  async deleteScan(id: string): Promise<void> {
    const scan = await Scan.findByIdAndDelete(id);
    if (!scan) throw ApiError.notFound(`Scan with id "${id}" not found`);
  },
};

export default scanService;
