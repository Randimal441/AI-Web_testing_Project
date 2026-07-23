import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { env } from './src/config/environment';
import { connectDatabase } from './src/config/database';
import logger from './src/config/logger';
import { requestLogger } from './src/middleware/requestLogger';
import { errorHandler } from './src/middleware/errorHandler';
import { notFound } from './src/middleware/notFound';
import apiRouter from './src/routes/index';
import { APP_META } from '../shared/src/constants';

// ─────────────────────────────────────────────────────────────────────────────
// Express Application Bootstrap
// ─────────────────────────────────────────────────────────────────────────────

const app = express();

// ── Security middleware ────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  }),
);

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin "${origin}" not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// ── Compression ───────────────────────────────────────────────────────────────
app.use(compression());

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ── Request logging ───────────────────────────────────────────────────────────
app.use(requestLogger);

// ── Rate limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});
app.use(limiter);

// ── API Routes ────────────────────────────────────────────────────────────────
app.use(env.API_PREFIX, apiRouter);

// ── 404 handler (must be after all routes) ────────────────────────────────────
app.use(notFound);

// ── Global error handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────────────────────────────────────
// Server Startup
// ─────────────────────────────────────────────────────────────────────────────

async function bootstrap(): Promise<void> {
  try {
    // Connect to database
    await connectDatabase();

    // Start HTTP server
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀  ${APP_META.NAME} API Server started`, {
        port: env.PORT,
        environment: env.NODE_ENV,
        apiPrefix: env.API_PREFIX,
        url: `http://localhost:${env.PORT}`,
      });
    });

    // ── Graceful shutdown ────────────────────────────────────────────────────
    const shutdown = (signal: string) => {
      logger.info(`Received ${signal} — shutting down gracefully…`);
      server.close(async () => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // Force shutdown after 10s
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10_000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // ── Unhandled rejections ─────────────────────────────────────────────────
    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Promise Rejection', { reason });
      shutdown('unhandledRejection');
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
      shutdown('uncaughtException');
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

bootstrap();

export default app;
