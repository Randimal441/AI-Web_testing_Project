import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  LayoutDashboard,
  ScanSearch,
  FileBarChart2,
  Settings,
  ChevronLeft,
  Zap,
  Activity,
} from 'lucide-react';
import { APP_META } from '@autoqa/shared';

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar Component
// ─────────────────────────────────────────────────────────────────────────────

interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: SidebarNavItem[] = [
  {
    id: 'nav-dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-4 h-4" />,
    path: '/',
  },
  {
    id: 'nav-scans',
    label: 'Scans',
    icon: <ScanSearch className="w-4 h-4" />,
    path: '/scans',
  },
  {
    id: 'nav-reports',
    label: 'Reports',
    icon: <FileBarChart2 className="w-4 h-4" />,
    path: '/reports',
  },
  {
    id: 'nav-settings',
    label: 'Settings',
    icon: <Settings className="w-4 h-4" />,
    path: '/settings',
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();

  return (
    <aside
      id="sidebar"
      role="navigation"
      aria-label="Main navigation"
      className={clsx(
        'relative flex flex-col h-screen border-r border-white/5 transition-all duration-300 flex-shrink-0',
        'bg-surface-800/95 backdrop-blur-md',
        isCollapsed ? 'w-[68px]' : 'w-64',
      )}
    >
      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5 overflow-hidden">
        <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}
        >
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <div className="animate-fade-in overflow-hidden">
            <p className="text-sm font-bold gradient-text leading-tight whitespace-nowrap">
              {APP_META.NAME}
            </p>
            <p className="text-[10px] text-slate-600 whitespace-nowrap">
              v{APP_META.VERSION}
            </p>
          </div>
        )}
      </div>

      {/* ── Toggle button ─────────────────────────────────────────────────── */}
      <button
        id="sidebar-toggle"
        onClick={onToggle}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-surface-600 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors z-10 shadow-card"
      >
        <ChevronLeft
          className={clsx('w-3 h-3 transition-transform duration-300', isCollapsed && 'rotate-180')}
        />
      </button>

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden no-scrollbar">
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              Main Menu
            </p>
          )}
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.id}
                to={item.path}
                id={item.id}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive: linkActive }) =>
                  clsx(
                    linkActive ? 'nav-item-active' : 'nav-item',
                    isCollapsed && 'justify-center px-2',
                  )
                }
                end={item.path === '/'}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && (
                  <span className="truncate animate-fade-in">{item.label}</span>
                )}
                {/* Active indicator */}
                {isActive && !isCollapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" aria-hidden="true" />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* ── Footer status ─────────────────────────────────────────────────── */}
      <div className={clsx(
        'px-3 py-4 border-t border-white/5 overflow-hidden',
      )}>
        <div className={clsx(
          'flex items-center gap-2.5 px-3 py-2 rounded-xl bg-surface-700/50',
          isCollapsed && 'justify-center px-2',
        )}>
          <Activity className="w-3.5 h-3.5 text-green-400 flex-shrink-0 animate-pulse-slow" />
          {!isCollapsed && (
            <div className="overflow-hidden animate-fade-in">
              <p className="text-xs font-medium text-slate-300 truncate">System Active</p>
              <p className="text-[10px] text-slate-600 truncate">Engine ready</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
