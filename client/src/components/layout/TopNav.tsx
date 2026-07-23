import React from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronRight, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import clsx from 'clsx';
import { useStats } from '../../hooks/useStats';

// ─────────────────────────────────────────────────────────────────────────────
// TopNav Component
// ─────────────────────────────────────────────────────────────────────────────

const routeLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/scans': 'Scans',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

const ConnectionIndicator: React.FC = () => {
  const { isError, isFetching, isSuccess } = useStats();

  if (isFetching) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-400">
        <RefreshCw className="w-3 h-3 animate-spin" />
        <span className="hidden sm:inline">Syncing…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-red-400">
        <WifiOff className="w-3 h-3" />
        <span className="hidden sm:inline">API offline</span>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-green-400">
        <Wifi className="w-3 h-3" />
        <span className="hidden sm:inline">Connected</span>
      </div>
    );
  }

  return null;
};

export const TopNav: React.FC = () => {
  const location = useLocation();

  // Build breadcrumb
  const segments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: 'AutoQA', path: '/' },
    ...segments.map((seg, i) => ({
      label: routeLabels[`/${seg}`] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
      path: '/' + segments.slice(0, i + 1).join('/'),
    })),
  ];

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header
      id="top-nav"
      className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-surface-800/60 backdrop-blur-md flex-shrink-0"
    >
      {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="w-3 h-3 text-slate-600" aria-hidden="true" />
              )}
              <span
                className={clsx(
                  'text-sm',
                  index === breadcrumbs.length - 1
                    ? 'text-slate-200 font-medium'
                    : 'text-slate-500 hover:text-slate-300 cursor-pointer transition-colors',
                )}
              >
                {crumb.label}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      {/* ── Right cluster ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Connection status */}
        <div
          id="connection-status"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-700/60 border border-white/5"
        >
          <ConnectionIndicator />
        </div>

        {/* Clock */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" aria-hidden="true" />
          {currentTime}
        </div>

        {/* Version badge */}
        <div className="hidden lg:flex px-2.5 py-1 rounded-full border border-brand-500/20 bg-brand-600/10">
          <span className="text-[10px] font-semibold text-brand-400 tracking-wider uppercase">
            Beta
          </span>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
