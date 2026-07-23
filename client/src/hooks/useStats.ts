import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import type { DashboardStats } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// useStats — TanStack Query hook for dashboard statistics
// ─────────────────────────────────────────────────────────────────────────────

export const STATS_QUERY_KEY = 'stats';

export function useStats() {
  return useQuery({
    queryKey: [STATS_QUERY_KEY],
    queryFn: async (): Promise<DashboardStats> => {
      const { data } = await apiClient.get<{ data: DashboardStats }>('/stats');
      return data.data;
    },
    staleTime: 30_000,
    refetchInterval: 20_000,
    retry: 2,
  });
}

export default useStats;
