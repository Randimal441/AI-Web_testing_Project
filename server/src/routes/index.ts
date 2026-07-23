import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import scanRoutes from './scanRoutes';
import statsRoutes from './statsRoutes';
import { env } from '../config/environment';
import { APP_META } from '../../../shared/src/constants';

// ─────────────────────────────────────────────────────────────────────────────
// Route Aggregator — mounts all sub-routers under the API prefix
// ─────────────────────────────────────────────────────────────────────────────

const router = Router();

// ── Health check ──────────────────────────────────────────────────────────────
router.get('/health', (_req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState] ?? 'unknown';

  res.status(200).json({
    success: true,
    message: `${APP_META.NAME} API is operational`,
    data: {
      app: APP_META.NAME,
      version: APP_META.VERSION,
      environment: env.NODE_ENV,
      database: dbStatus,
      uptime: `${Math.floor(process.uptime())}s`,
      timestamp: new Date().toISOString(),
    },
  });
});

// ── Feature routes ────────────────────────────────────────────────────────────
router.use('/scans', scanRoutes);
router.use('/stats', statsRoutes);

export default router;
