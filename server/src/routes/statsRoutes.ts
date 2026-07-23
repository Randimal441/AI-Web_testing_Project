import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController';

// ─────────────────────────────────────────────────────────────────────────────
// Stats Routes  →  /api/v1/stats
// ─────────────────────────────────────────────────────────────────────────────

const router = Router();

router.get('/', getDashboardStats);

export default router;
