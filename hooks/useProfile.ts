"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { UserProfile } from "@/types";

async function fetchProfile(): Promise<UserProfile | null> {
  try {
    const { data } = await api.get("/profile");
    if (data && typeof data === "object" && "profile_missing" in data) {
      return null;
    }
    return data as UserProfile;
  } catch {
    return null;
  }
}

export function useProfile() {
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    retry: 1,
    staleTime: 30000,
  });

  const updateProfile = useMutation({
    mutationFn: async (profileData: Partial<UserProfile>) => {
      const { data } = await api.post<UserProfile>(
        "/profile/update",
        profileData
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const uploadResume = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post<UserProfile>(
        "/profile/upload-resume",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const completionPercent = profile
    ? calculateCompletion(profile)
    : 0;

  return {
    profile,
    isLoading,
    error,
    completionPercent,
    updateProfile,
    uploadResume,
  };
}

function calculateCompletion(profile: UserProfile): number {
  let total = 0;
  let filled = 0;

  const checks = [
    profile.skills && profile.skills.length > 0,
    !!profile.seniority,
    (profile.years_experience ?? 0) > 0,
    profile.preferred_roles && profile.preferred_roles.length > 0,
    profile.preferred_locations && profile.preferred_locations.length > 0,
    !!profile.background,
    !!profile.current_goal,
  ];

  total = checks.length;
  filled = checks.filter(Boolean).length;

  return Math.round((filled / total) * 100);
}
