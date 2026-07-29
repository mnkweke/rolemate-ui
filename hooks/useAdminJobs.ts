"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { AdminJobStats } from "@/types";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const { data } = await api.get<AdminJobStats>("/admin/jobs/stats");
      return data;
    },
    refetchInterval: 30000,
  });
}

export function useSyncJobs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ status: string; message: string }>("/admin/jobs/sync");
      return data;
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      }, 5000);
    },
  });
}
