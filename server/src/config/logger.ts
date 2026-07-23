import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { env } from './environment';

// ─────────────────────────────────────────────────────────────────────────────
// Winston Logger Configuration
// ─────────────────────────────────────────────────────────────────────────────

const LOG_DIR = path.resolve(__dirname, '../../../logs');

const { combine, timestamp, printf, colorize, align, errors, json } = winston.format;

// ── Console format (human-readable in dev) ────────────────────────────────────
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  align(),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    const stackStr = stack ? `\n${stack}` : '';
    return `[${ts}] ${level}: ${message}${metaStr}${stackStr}`;
  }),
);

// ── File format (structured JSON for log aggregators) ─────────────────────────
const fileFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json(),
);

// ── Transports ─────────────────────────────────────────────────────────────────
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: consoleFormat,
    silent: env.NODE_ENV === 'test',
  }),
];

// Add rotating file transports in non-test environments
if (env.NODE_ENV !== 'test') {
  transports.push(
    new DailyRotateFile({
      dirname: LOG_DIR,
      filename: 'autoqa-%DATE%-combined.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      maxSize: '20m',
      format: fileFormat,
    }),
    new DailyRotateFile({
      dirname: LOG_DIR,
      filename: 'autoqa-%DATE%-error.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '30d',
      maxSize: '20m',
      format: fileFormat,
    }),
  );
}

// ── Logger instance ────────────────────────────────────────────────────────────
export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  transports,
  exitOnError: false,
});

// Convenience stream for morgan/express HTTP logging
export const loggerStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export default logger;
