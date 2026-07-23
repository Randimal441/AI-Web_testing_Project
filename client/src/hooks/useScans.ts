import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/apiClient';
import type { Scan, CreateScanPayload, PaginatedResponse } from '../types';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────────────────────────────────────────
// useScans — TanStack Query hook for scan data
// ─────────────────────────────────────────────────────────────────────────────

export const SCANS_QUERY_KEY = 'scans';

export function useScans(page = 1, limit = 10, status?: string) {
  return useQuery({
    queryKey: [SCANS_QUERY_KEY, { page, limit, status }],
    queryFn: async (): Promise<PaginatedResponse<Scan>> => {
      const params: Record<string, unknown> = { page, limit };
      if (status) params.status = status;
      const { data } = await apiClient.get<PaginatedResponse<Scan>>('/scans', { params });
      return data;
    },
    staleTime: 30_000,       // consider data fresh for 30s
    refetchInterval: 15_000, // auto-refetch every 15s
    placeholderData: (prev) => prev,
  });
}

export function useScan(id: string) {
  return useQuery({
    queryKey: [SCANS_QUERY_KEY, id],
    queryFn: async (): Promise<Scan> => {
      const { data } = await apiClient.get(`/scans/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateScanPayload): Promise<Scan> => {
      const { data } = await apiClient.post('/scans', payload);
      return data.data;
    },
    onSuccess: (scan) => {
      queryClient.invalidateQueries({ queryKey: [SCANS_QUERY_KEY] });
      toast.success(`Scan queued for ${scan.url}`);
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to create scan');
    },
  });
}

export function useCancelScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<Scan> => {
      const { data } = await apiClient.patch(`/scans/${id}/cancel`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCANS_QUERY_KEY] });
      toast.success('Scan cancelled');
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to cancel scan');
    },
  });
}

export function useDeleteScan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/scans/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCANS_QUERY_KEY] });
      toast.success('Scan deleted');
    },
    onError: (error: Error) => {
      toast.error(error.message ?? 'Failed to delete scan');
    },
  });
}
