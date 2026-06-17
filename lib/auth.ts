import api from "./api";

const SESSION_KEY = "session_id";

export function getSessionId(): string {
  if (typeof window === "undefined") return "default";
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch (e) {
    // ignore errors; ensure client clears session state
  }
  if (typeof window !== "undefined") {
    // broadcast logout to other tabs
    try {
      localStorage.setItem("rolemate-logout", Date.now().toString());
    } catch (e) {
      // ignore
    }
    window.location.href = "/login";
  }
}
