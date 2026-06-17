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
  // Attempt server-side logout first. If it fails or is delayed, poll /auth/me
  // to ensure the session cookie is cleared before navigating to /login.
  try {
    await api.post("/auth/logout");
  } catch (e) {
    // continue — we'll verify by polling /auth/me below
  }

  // Poll /auth/me until it returns 401 or timeout (max ~5s)
  const start = Date.now();
  const timeoutMs = 5000;
  const intervalMs = 500;
  let loggedOut = false;

  while (Date.now() - start < timeoutMs) {
    try {
      await api.get("/auth/me");
      // still authenticated; wait and retry
    } catch (err: any) {
      if (err?.response?.status === 401) {
        loggedOut = true;
        break;
      }
      // network error — break and redirect to be safe
      break;
    }
    // wait
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  if (typeof window !== "undefined") {
    // broadcast logout to other tabs
    try {
      localStorage.setItem("rolemate-logout", Date.now().toString());
    } catch (e) {
      // ignore
    }

    // Only navigate to /login after server has cleared session (or after timeout)
    // Use location.href to ensure cookies are handled by full page reload
    window.location.href = "/login";
  }
}
