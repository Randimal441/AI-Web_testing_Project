import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopNav } from '../components/layout/TopNav';

// ─────────────────────────────────────────────────────────────────────────────
// App Layout — wraps all pages with Sidebar + TopNav
// ─────────────────────────────────────────────────────────────────────────────

export const AppLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-900">
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      {/* ── Main content area ─────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top navigation */}
        <TopNav />

        {/* Page content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-6"
          role="main"
          aria-label="Page content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
