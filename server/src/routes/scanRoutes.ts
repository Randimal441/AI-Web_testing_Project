import { Router } from 'express';
import {
  getScans,
  getScanById,
  createScan,
  cancelScan,
  deleteScan,
} from '../controllers/scanController';

// ─────────────────────────────────────────────────────────────────────────────
// Scan Routes  →  /api/v1/scans
// ─────────────────────────────────────────────────────────────────────────────

const router = Router();

router.get('/', getScans);
router.get('/:id', getScanById);
router.post('/', createScan);
router.patch('/:id/cancel', cancelScan);
router.delete('/:id', deleteScan);

export default router;
