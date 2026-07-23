import React from 'react';
import clsx from 'clsx';

// ─────────────────────────────────────────────────────────────────────────────
// Spinner Component
// ─────────────────────────────────────────────────────────────────────────────

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeMap = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className,
  label = 'Loading…',
}) => (
  <svg
    className={clsx('animate-spin text-brand-400', sizeMap[size], className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-label={label}
    role="status"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

// ── Full-page loading overlay ─────────────────────────────────────────────────
export const LoadingOverlay: React.FC<{ message?: string }> = ({
  message = 'Loading…',
}) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16">
    <Spinner size="lg" />
    <p className="text-sm text-slate-500">{message}</p>
  </div>
);

// ── Skeleton line ─────────────────────────────────────────────────────────────
export const SkeletonLine: React.FC<{ width?: string; height?: string }> = ({
  width = 'w-full',
  height = 'h-4',
}) => <div className={clsx('skeleton', width, height)} />;

export default Spinner;
