import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ScrapeStatusResponse } from "@/types";

export function useScrapeStatus() {
  return useQuery<ScrapeStatusResponse, Error>({
    queryKey: ["scrapeStatus"],
    queryFn: async () => {
      const { data } = await api.get<ScrapeStatusResponse>("/scrape/status");
      return data;
    },
    staleTime: 30000, // 30 seconds
  });
}