import dotenv from 'dotenv';
import path from 'path';

// Load .env from the monorepo root (server/src/config/ → server/ → root)
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// ─────────────────────────────────────────────────────────────────────────────
// Environment configuration with validation
// ─────────────────────────────────────────────────────────────────────────────

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function parsePort(value: string): number {
  const port = parseInt(value, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT value: ${value}`);
  }
  return port;
}

export const env = {
  NODE_ENV: requireEnv('NODE_ENV', 'development') as 'development' | 'production' | 'test',
  PORT: parsePort(requireEnv('PORT', '5000')),
  MONGODB_URI: requireEnv('MONGODB_URI', 'mongodb://localhost:27017/autoqa_agent'),
  CORS_ORIGIN: requireEnv('CORS_ORIGIN', 'http://localhost:5173'),
  LOG_LEVEL: requireEnv('LOG_LEVEL', 'debug'),
  API_PREFIX: requireEnv('API_PREFIX', '/api/v1'),
} as const;

export type Env = typeof env;
