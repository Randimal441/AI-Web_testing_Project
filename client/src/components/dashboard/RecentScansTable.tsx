import React, { useState } from 'react';
import { ExternalLink, Trash2, XCircle, RefreshCw, History } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Table, Pagination, Column } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useScans, useDeleteScan, useCancelScan } from '../../hooks/useScans';
import { timeAgo, truncate } from '@autoqa/shared';
import type { Scan, ScanStatus } from '../../types';

// ─────────────────────────────────────────────────────────────────────────────
// RecentScansTable Component
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Running', value: 'running' },
  { label: 'Passed', value: 'passed' },
  { label: 'Failed', value: 'failed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export const RecentScansTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const LIMIT = 8;

  const { data, isLoading, isFetching, refetch } = useScans(page, LIMIT, statusFilter || undefined);
  const { mutate: deleteScan } = useDeleteScan();
  const { mutate: cancelScan } = useCancelScan();

  const scans = data?.data ?? [];
  const pagination = data?.pagination;

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const columns: Column<Scan>[] = [
    {
      key: 'url',
      label: 'Target URL',
      render: (scan) => (
        <div className="flex items-center gap-2 min-w-0">
          <div className="min-w-0">
            <a
              href={scan.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-200 hover:text-brand-400 transition-colors font-medium flex items-center gap-1 group"
              aria-label={`Visit ${scan.url}`}
            >
              <span className="truncate max-w-[220px] block">{truncate(scan.url, 40)}</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
            </a>
            {scan.label && (
              <p className="text-[11px] text-slate-600 truncate mt-0.5">{scan.label}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      render: (scan) => (
        <Badge variant={scan.status as ScanStatus} dot>
          {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'result',
      label: 'Issues',
      width: '80px',
      align: 'center',
      render: (scan) =>
        scan.result ? (
          <span className={scan.result.totalIssues > 0 ? 'text-red-400 font-semibold' : 'text-green-400 font-semibold'}>
            {scan.result.totalIssues}
          </span>
        ) : (
          <span className="text-slate-600">—</span>
        ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: '140px',
      render: (scan) => (
        <time
          dateTime={scan.createdAt}
          title={new Date(scan.createdAt).toLocaleString()}
          className="text-slate-500 text-xs"
        >
          {timeAgo(scan.createdAt)}
        </time>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '100px',
      align: 'right',
      render: (scan) => (
        <div className="flex items-center justify-end gap-1">
          {['pending', 'running'].includes(scan.status) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => cancelScan(scan._id)}
              title="Cancel scan"
              aria-label={`Cancel scan for ${scan.url}`}
              className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 p-1.5"
            >
              <XCircle className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.confirm('Delete this scan?')) deleteScan(scan._id);
            }}
            title="Delete scan"
            aria-label={`Delete scan for ${scan.url}`}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1.5"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card id="recent-scans-card" padding="none">
      <div className="px-6 pt-6 pb-4 border-b border-white/5">
        <CardHeader
          title="Recent Scans"
          description="All queued and completed scan runs from MongoDB"
          icon={<History className="w-4 h-4" />}
          action={
            <Button
              id="refresh-scans-btn"
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              aria-label="Refresh scans"
              className="text-slate-500 hover:text-slate-300 p-1.5"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          }
        />

        {/* ── Status filter tabs ──────────────────────────────────────────── */}
        <div
          className="flex items-center gap-1 overflow-x-auto no-scrollbar"
          role="tablist"
          aria-label="Filter scans by status"
        >
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              id={`filter-${opt.value || 'all'}`}
              role="tab"
              aria-selected={statusFilter === opt.value}
              onClick={() => handleStatusFilter(opt.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 whitespace-nowrap ${
                statusFilter === opt.value
                  ? 'bg-brand-600/25 text-brand-300 border border-brand-500/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-surface-600/40'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Table
        columns={columns}
        data={scans}
        keyExtractor={(scan) => scan._id}
        isLoading={isLoading}
        emptyMessage="No scans found"
        emptyDescription={
          statusFilter
            ? `No scans with status "${statusFilter}". Try a different filter.`
            : 'Submit a URL above to queue your first scan.'
        }
      />

      {pagination && pagination.totalPages > 0 && (
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={LIMIT}
          onPageChange={setPage}
        />
      )}
    </Card>
  );
};

export default RecentScansTable;
