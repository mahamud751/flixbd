export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const TOKEN_KEY = "streamnest-admin-token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // storage blocked: the session just will not survive a reload
  }
}

/** Small typed fetch wrapper for the backend API; sends the admin token. */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text();
  const body: unknown = text ? JSON.parse(text) : null;

  // Expired or revoked admin token: drop it and send the admin to the login screen.
  if (res.status === 401 && token && !path.startsWith("/auth/admin/login")) {
    setToken(null);
    // Full reload on purpose: it clears every page's in-memory state.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign("/login");
  }

  if (!res.ok) {
    const message =
      body && typeof body === "object" && "message" in body
        ? String((body as { message: unknown }).message)
        : `${res.status} ${res.statusText}`;
    throw new Error(message);
  }

  return body as T;
}

/** ৳ formatted price, e.g. ৳1,299 */
export function bdt(amount: number): string {
  return `৳${amount.toLocaleString("en-US")}`;
}
