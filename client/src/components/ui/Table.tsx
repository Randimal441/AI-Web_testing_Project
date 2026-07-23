import React from 'react';
import clsx from 'clsx';
import { Spinner } from './Spinner';

// ─────────────────────────────────────────────────────────────────────────────
// Table Component
// ─────────────────────────────────────────────────────────────────────────────

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Table<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No data found',
  emptyDescription = 'Nothing to display yet.',
  className,
}: TableProps<T>) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={clsx('overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" role="table">
          <thead>
            <tr className="border-b border-white/5">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={col.width ? { width: col.width } : undefined}
                  className={clsx(
                    'px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-widest',
                    alignClass[col.align ?? 'left'],
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-16">
                  <div className="flex flex-col items-center gap-3">
                    <Spinner size="md" />
                    <span className="text-sm text-slate-500">Loading data…</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16">
                  <div className="flex flex-col items-center gap-3">
                    {/* Empty state icon */}
                    <div className="w-16 h-16 rounded-2xl bg-surface-600/50 border border-white/5 flex items-center justify-center">
                      <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-400">{emptyMessage}</p>
                      <p className="text-xs text-slate-600 mt-1">{emptyDescription}</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={keyExtractor(row, index)}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors duration-150 animate-fade-in"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={clsx(
                        'px-4 py-3.5 text-sm text-slate-300',
                        alignClass[col.align ?? 'left'],
                      )}
                    >
                      {col.render
                        ? col.render(row, index)
                        : String(row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Pagination Bar ────────────────────────────────────────────────────────────
interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}) => {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
      <p className="text-xs text-slate-500">
        Showing <span className="text-slate-300 font-medium">{total === 0 ? 0 : start}–{end}</span> of{' '}
        <span className="text-slate-300 font-medium">{total}</span> results
      </p>
      <div className="flex items-center gap-1">
        <button
          id="table-prev-page"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 text-xs rounded-lg text-slate-400 hover:text-white hover:bg-surface-600/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ← Prev
        </button>
        <span className="px-3 py-1.5 text-xs text-slate-300 bg-brand-600/20 border border-brand-500/20 rounded-lg font-medium">
          {page} / {totalPages || 1}
        </span>
        <button
          id="table-next-page"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 text-xs rounded-lg text-slate-400 hover:text-white hover:bg-surface-600/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Table;
