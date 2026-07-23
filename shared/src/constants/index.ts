// ─────────────────────────────────────────────────────────────────────────────
// Shared Constants
// ─────────────────────────────────────────────────────────────────────────────

// ── API Routes ────────────────────────────────────────────────────────────────
export const API_PREFIX = '/api/v1' as const;

export const API_ROUTES = {
  HEALTH: '/health',
  SCANS: `${API_PREFIX}/scans`,
  STATS: `${API_PREFIX}/stats`,
} as const;

// ── Scan Status Labels ────────────────────────────────────────────────────────
export const SCAN_STATUS_LABELS = {
  pending: 'Pending',
  running: 'Running',
  passed: 'Passed',
  failed: 'Failed',
  cancelled: 'Cancelled',
} as const;

// ── Issue Severity Labels ─────────────────────────────────────────────────────
export const SEVERITY_LABELS = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  info: 'Info',
} as const;

// ── Pagination Defaults ───────────────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// ── App Metadata ──────────────────────────────────────────────────────────────
export const APP_META = {
  NAME: 'AutoQA Agent',
  VERSION: '1.0.0',
  DESCRIPTION: 'AI-powered Autonomous QA Testing Platform',
} as const;
