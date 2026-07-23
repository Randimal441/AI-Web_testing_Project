// ─────────────────────────────────────────────────────────────────────────────
// Client-side type extensions (re-exports shared types + client-specific)
// ─────────────────────────────────────────────────────────────────────────────

export type {
  Scan,
  ScanStatus,
  ScanResult,
  ScanIssue,
  IssueSeverity,
  CreateScanPayload,
  DashboardStats,
  ApiResponse,
  ApiErrorResponse,
  PaginatedResponse,
} from '@autoqa/shared';

// ── Client-specific UI types ──────────────────────────────────────────────────

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

export interface StatCard {
  id: string;
  label: string;
  value: number | string;
  icon: string;
  color: 'brand' | 'green' | 'red' | 'amber' | 'cyan';
  description?: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface PaginationState {
  page: number;
  limit: number;
}

export type QueryStatus = 'loading' | 'error' | 'success';
