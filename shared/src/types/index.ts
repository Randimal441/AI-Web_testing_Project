// ─────────────────────────────────────────────────────────────────────────────
// Shared Types — used by both client and server
// ─────────────────────────────────────────────────────────────────────────────

// ── Scan Status ──────────────────────────────────────────────────────────────
export type ScanStatus = 'pending' | 'running' | 'passed' | 'failed' | 'cancelled';

// ── Scan Severity ────────────────────────────────────────────────────────────
export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

// ── Issue ────────────────────────────────────────────────────────────────────
export interface ScanIssue {
  id: string;
  title: string;
  description: string;
  severity: IssueSeverity;
  selector?: string;
  screenshot?: string;
  pageUrl: string;
  timestamp: string;
}

// ── Scan Result ───────────────────────────────────────────────────────────────
export interface ScanResult {
  totalPages: number;
  totalIssues: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  infoCount: number;
  issues: ScanIssue[];
  duration: number; // milliseconds
}

// ── Scan Document ─────────────────────────────────────────────────────────────
export interface Scan {
  _id: string;
  url: string;
  status: ScanStatus;
  label?: string;
  result?: ScanResult;
  error?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Scan Create Payload ───────────────────────────────────────────────────────
export interface CreateScanPayload {
  url: string;
  label?: string;
}

// ── Dashboard Statistics ──────────────────────────────────────────────────────
export interface DashboardStats {
  totalScans: number;
  passedScans: number;
  failedScans: number;
  runningScans: number;
  pendingScans: number;
  cancelledScans: number;
  totalIssues: number;
  avgScanDuration: number; // milliseconds
}

// ── API Response Wrappers ─────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  statusCode: number;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  timestamp: string;
}
