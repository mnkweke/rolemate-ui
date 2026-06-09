"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { getSessionId } from "@/lib/auth";
import type { Job, ScrapeResult } from "@/types";

interface JobsResponse {
  jobs: Job[];
  total: number;
}

interface JobsParams {
  location?: string;
  remote?: boolean;
  seniority?: string;
  source?: string;
  limit?: number;
  offset?: number;
}

async function fetchJobs(params: JobsParams = {}): Promise<JobsResponse> {
  const { data } = await api.get<JobsResponse>("/jobs", { params });
  return data;
}

export function useJobs(params: JobsParams = {}) {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["jobs", params],
    queryFn: () => fetchJobs(params),
    staleTime: 30000,
  });

  const scrapeJobs = useMutation({
    mutationFn: async () => {
      const { data } = await api.post<ScrapeResult>("/scrape", { session_id: getSessionId() });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const clearJobs = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete("/jobs/clear");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  return {
    jobs: data?.jobs ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    scrapeJobs,
    clearJobs,
  };
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await api.get("/health");
      return {
        total_jobs: 0,
        last_scrape_time: null,
        profile_completion: 0,
        top_skills: [],
        ...data,
      };
    },
    staleTime: 30000,
  });
}
