import React from 'react';
import clsx from 'clsx';

// ─────────────────────────────────────────────────────────────────────────────
// Card Component
// ─────────────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  id?: string;
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  padding = 'md',
  id,
}) => {
  return (
    <div
      id={id}
      className={clsx(
        hover ? 'glass-card-hover' : 'glass-card',
        paddingMap[padding],
        className,
      )}
    >
      {children}
    </div>
  );
};

// ── Card sub-components ───────────────────────────────────────────────────────
interface CardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  description,
  action,
  icon,
  className,
}) => (
  <div className={clsx('flex items-start justify-between mb-5', className)}>
    <div className="flex items-center gap-3">
      {icon && (
        <div className="w-9 h-9 rounded-xl bg-brand-600/20 border border-brand-500/20 flex items-center justify-center text-brand-400 flex-shrink-0">
          {icon}
        </div>
      )}
      <div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

export default Card;
