import React from 'react';
import { StatsCards } from '../components/dashboard/StatsCards';
import { ScanForm } from '../components/dashboard/ScanForm';
import { RecentScansTable } from '../components/dashboard/RecentScansTable';
import { Zap } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Page
// ─────────────────────────────────────────────────────────────────────────────

export const Dashboard: React.FC = () => {
  return (
    <div id="dashboard-page" className="space-y-6 animate-fade-in">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}
              aria-hidden="true"
            >
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">Dashboard</h1>
          </div>
          <p className="text-sm text-slate-500 ml-[42px]">
            Monitor scans, queue new targets, and track QA health metrics
          </p>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-700/60 border border-white/5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
          <span className="text-xs text-slate-400 font-medium">Live</span>
        </div>
      </div>

      {/* ── Statistics ────────────────────────────────────────────────────── */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Statistics Overview</h2>
        <StatsCards />
      </section>

      {/* ── Two-column layout: Scan form + future widgets ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scan form */}
        <div className="lg:col-span-1">
          <ScanForm />
        </div>

        {/* Future widgets placeholder */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col items-center justify-center min-h-[200px] gap-3">
          <div className="w-14 h-14 rounded-2xl bg-surface-600/50 border border-white/5 flex items-center justify-center">
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-500">Analytics Charts</p>
            <p className="text-xs text-slate-700 mt-1">
              Scan trend, issue breakdown, and success rate — coming soon
            </p>
          </div>
          <div className="px-3 py-1 rounded-full border border-brand-500/20 bg-brand-600/10">
            <span className="text-[10px] font-semibold text-brand-500 tracking-widest uppercase">
              Future Integration
            </span>
          </div>
        </div>
      </div>

      {/* ── Recent Scans table ────────────────────────────────────────────── */}
      <section aria-labelledby="recent-scans-heading">
        <h2 id="recent-scans-heading" className="sr-only">Recent Scans</h2>
        <RecentScansTable />
      </section>
    </div>
  );
};

export default Dashboard;
