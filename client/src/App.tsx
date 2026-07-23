import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { NotFound } from './pages/NotFound';

// ─────────────────────────────────────────────────────────────────────────────
// TanStack Query Client Configuration
// ─────────────────────────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// App — Root Component
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            {/* Future pages — scaffold routes ready */}
            <Route
              path="scans"
              element={
                <div className="text-center py-16">
                  <p className="text-slate-500 text-sm">Scans page — coming soon</p>
                </div>
              }
            />
            <Route
              path="reports"
              element={
                <div className="text-center py-16">
                  <p className="text-slate-500 text-sm">Reports page — coming soon</p>
                </div>
              }
            />
            <Route
              path="settings"
              element={
                <div className="text-center py-16">
                  <p className="text-slate-500 text-sm">Settings page — coming soon</p>
                </div>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e1e35',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#1e1e35' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#1e1e35' },
          },
        }}
      />

      {/* React Query devtools — only in development */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
}

export default App;
