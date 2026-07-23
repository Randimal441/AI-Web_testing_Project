import React from 'react';
import clsx from 'clsx';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  TrendingUp,
  ScanSearch,
  AlertTriangle,
  Timer,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { SkeletonLine } from '../ui/Spinner';
import { useStats } from '../../hooks/useStats';
import { formatDuration } from '@autoqa/shared';

// ─────────────────────────────────────────────────────────────────────────────
// Stats Cards Component
// ─────────────────────────────────────────────────────────────────────────────

interface StatCardDef {
  id: string;
  label: string;
  getValue: (stats: NonNullable<ReturnType<typeof useStats>['data']>) => string | number;
  icon: React.ReactNode;
  colorClass: string;
  glowClass: string;
  description: string;
}

const statDefs: StatCardDef[] = [
  {
    id: 'stat-total-scans',
    label: 'Total Scans',
    getValue: (s) => s.totalScans,
    icon: <ScanSearch className="w-5 h-5" />,
    colorClass: 'text-brand-400 bg-brand-600/15 border-brand-500/20',
    glowClass: 'shadow-glow-brand',
    description: 'All-time scan runs',
  },
  {
    id: 'stat-passed',
    label: 'Passed',
    getValue: (s) => s.passedScans,
    icon: <CheckCircle2 className="w-5 h-5" />,
    colorClass: 'text-green-400 bg-green-600/15 border-green-500/20',
    glowClass: '',
    description: 'Scans with no critical issues',
  },
  {
    id: 'stat-failed',
    label: 'Failed',
    getValue: (s) => s.failedScans,
    icon: <XCircle className="w-5 h-5" />,
    colorClass: 'text-red-400 bg-red-600/15 border-red-500/20',
    glowClass: '',
    description: 'Scans that detected issues',
  },
  {
    id: 'stat-running',
    label: 'In Progress',
    getValue: (s) => s.runningScans + s.pendingScans,
    icon: <Loader2 className="w-5 h-5" />,
    colorClass: 'text-amber-400 bg-amber-600/15 border-amber-500/20',
    glowClass: '',
    description: 'Pending + actively running',
  },
  {
    id: 'stat-issues',
    label: 'Total Issues',
    getValue: (s) => s.totalIssues,
    icon: <AlertTriangle className="w-5 h-5" />,
    colorClass: 'text-orange-400 bg-orange-600/15 border-orange-500/20',
    glowClass: '',
    description: 'Across all completed scans',
  },
  {
    id: 'stat-avg-duration',
    label: 'Avg Duration',
    getValue: (s) => s.avgScanDuration > 0 ? formatDuration(s.avgScanDuration) : '—',
    icon: <Timer className="w-5 h-5" />,
    colorClass: 'text-cyan-400 bg-cyan-600/15 border-cyan-500/20',
    glowClass: '',
    description: 'Average time per scan',
  },
];

// ── Skeleton ──────────────────────────────────────────────────────────────────
const StatCardSkeleton: React.FC = () => (
  <div className="glass-card p-5 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <SkeletonLine width="w-24" height="h-3" />
      <div className="w-10 h-10 skeleton rounded-xl" />
    </div>
    <SkeletonLine width="w-16" height="h-8" />
    <SkeletonLine width="w-32" height="h-3" />
  </div>
);

// ── Individual card ───────────────────────────────────────────────────────────
interface StatCardProps {
  def: StatCardDef;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ def, value }) => (
  <Card id={def.id} hover padding="none" className="p-5 group">
    <div className="flex items-start justify-between mb-3">
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
          {def.label}
        </p>
      </div>
      <div className={clsx('w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0', def.colorClass)}>
        {def.icon}
      </div>
    </div>

    <div className="flex items-end gap-2 mb-1">
      <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
      {typeof value === 'number' && value > 0 && (
        <TrendingUp className="w-4 h-4 text-green-400 mb-1" aria-hidden="true" />
      )}
    </div>

    <p className="text-xs text-slate-600">{def.description}</p>
  </Card>
);

// ── Main export ───────────────────────────────────────────────────────────────
export const StatsCards: React.FC = () => {
  const { data, isLoading, isError } = useStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="glass-card p-5 flex items-center gap-3 text-red-400 col-span-full">
        <XCircle className="w-5 h-5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium">Could not load statistics</p>
          <p className="text-xs text-red-400/70 mt-0.5">Ensure the API server is running and MongoDB is connected.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="stats-cards-grid"
      className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4"
      role="region"
      aria-label="Dashboard statistics"
    >
      {statDefs.map((def) => (
        <StatCard key={def.id} def={def} value={def.getValue(data)} />
      ))}
    </div>
  );
};



export default StatsCards;
