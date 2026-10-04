import { API_URL } from "@/lib/catalog";
import type { Session } from "@/lib/types";

type ApiUser = { name: string; email: string; phone: string | null };

export type AuthResult = { token: string; session: Session };

function toSession(user: ApiUser): Session {
  return { name: user.name, email: user.email, phone: user.phone ?? "" };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new Error("Cannot reach the server. Try again in a moment.");
  }
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message = body?.message;
    throw new Error(
      Array.isArray(message) ? message.join(", ") : message ?? `Request failed (${res.status}).`,
    );
  }
  return body as T;
}

export async function registerAccount(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<AuthResult> {
  const { token, user } = await request<{ token: string; user: ApiUser }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return { token, session: toSession(user) };
}

export async function loginAccount(email: string, password: string): Promise<AuthResult> {
  const { token, user } = await request<{ token: string; user: ApiUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return { token, session: toSession(user) };
}

/** Resolves the account behind a stored token; null when it is no longer valid. */
export async function fetchMe(token: string): Promise<Session | null> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => null);
  if (!res) throw new Error("offline");
  if (res.status === 401 || res.status === 403) return null;
  if (!res.ok) throw new Error(`status ${res.status}`);
  return toSession((await res.json()) as ApiUser);
}
