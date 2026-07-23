import React from 'react';
import clsx from 'clsx';
import type { ScanStatus } from '../../types';

// ─────────────────────────────────────────────────────────────────────────────
// Badge Component
// ─────────────────────────────────────────────────────────────────────────────

type BadgeVariant = ScanStatus | 'info' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  passed:    'badge-passed',
  failed:    'badge-failed',
  running:   'badge-running',
  pending:   'badge-pending',
  cancelled: 'badge-cancelled',
  info:      'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
  default:   'bg-surface-500/50 text-slate-400 border border-white/10',
};

const dotColors: Record<BadgeVariant, string> = {
  passed:    'bg-green-400',
  failed:    'bg-red-400',
  running:   'bg-amber-400 animate-pulse',
  pending:   'bg-slate-400',
  cancelled: 'bg-gray-400',
  info:      'bg-cyan-400',
  default:   'bg-slate-500',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className,
  dot = false,
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide',
        variantClasses[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
