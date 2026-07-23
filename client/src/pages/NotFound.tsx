import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// 404 Not Found Page
// ─────────────────────────────────────────────────────────────────────────────

export const NotFound: React.FC = () => {
  return (
    <div
      id="not-found-page"
      className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in"
    >
      <div className="w-20 h-20 rounded-3xl bg-surface-700/60 border border-white/5 flex items-center justify-center">
        <AlertTriangle className="w-9 h-9 text-amber-400" aria-hidden="true" />
      </div>

      <div className="text-center">
        <h1 className="text-6xl font-bold gradient-text mb-2">404</h1>
        <p className="text-xl font-semibold text-white mb-2">Page Not Found</p>
        <p className="text-sm text-slate-500 max-w-sm text-balance">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <Link
        to="/"
        id="back-to-dashboard"
        className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
      >
        <Home className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
