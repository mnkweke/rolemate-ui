"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { getSessionId } from "@/lib/auth";
import type { ApplicationsResponse, ApplyRequest, ApplyResponse } from "@/types";

export function useApplications() {
  const sessionId = getSessionId();

  const { data: applications, isLoading, error, refetch } = useQuery({
    queryKey: ["applications", sessionId],
    queryFn: async () => {
      const { data } = await api.get<ApplicationsResponse>(
        `/applications?session_id=${sessionId}`
      );
      return data;
    },
    staleTime: 15000,
  });

  const applyMutation = useMutation({
    mutationFn: async (payload: ApplyRequest) => {
      const { data } = await api.post<ApplyResponse>("/apply", payload);
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ appId, status, feedback }: { appId: string; status: string; feedback: string }) => {
      const { data } = await api.post(`/applications/${appId}/status`, { status, feedback });
      return data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  return {
    applications,
    isLoading,
    error,
    refetch,
    applyMutation,
    updateStatusMutation,
  };
}
