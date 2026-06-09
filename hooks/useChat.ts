"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";
import { getSessionId } from "@/lib/auth";
import type { ChatMessage, ChatResponse } from "@/types";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profileMissing, setProfileMissing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const sessionId = getSessionId();
      const { data } = await api.post<ChatResponse>("/chat", {
        message: content,
        session_id: sessionId,
      });

      setProfileMissing(data.profile_missing);

      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        content: data.market_insight,
        jobs: data.ranked_jobs,
        suggestions: data.follow_up_suggestions,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to send message";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    profileMissing,
    sendMessage,
    clearMessages,
  };
}
