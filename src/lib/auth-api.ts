import type { AuthTokens, RegisterRequest, LoginRequest } from "@/types/auth";
import type { ApiResponse, PagedResult } from "@/types/dictionary";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:62971/api/v1";

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    // Surface validation errors as readable message
    if (json.errors) {
      const messages = Object.values(json.errors).flat();
      throw new Error(messages[0] ?? json.message ?? "Request failed");
    }
    throw new Error(json.message ?? `HTTP ${res.status}`);
  }

  return json.data;
}

export async function register(data: RegisterRequest): Promise<AuthTokens> {
  return fetchApi<AuthTokens>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(data: LoginRequest): Promise<AuthTokens> {
  return fetchApi<AuthTokens>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  return fetchApi<AuthTokens>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function submitWord(data: object, accessToken: string): Promise<{ id: string }> {
  return fetchApi<{ id: string }>("/words", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(data),
  });
}

export async function submitPhrase(data: object, accessToken: string): Promise<{ id: string }> {
  return fetchApi<{ id: string }>("/phrases", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(data),
  });
}

export async function getMySubmissions(
  accessToken: string,
  page = 1
): Promise<PagedResult<import("@/types/auth").SubmissionItem>> {
  const res = await fetch(
    `${API_BASE}/submissions/my?page=${page}&pageSize=20`,
    { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
  );
  const json = await res.json();
  if (!json.success) throw new Error(json.message ?? "Failed to load submissions");
  return json.data;
}

export async function updateProfile(
  accessToken: string,
  data: { displayName?: string; email?: string }
): Promise<{ displayName: string; email: string; role: string }> {
  const res = await fetch(`${API_BASE}/profile`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message ?? "Failed to update profile");
  return json.data;
}

export async function changePassword(
  accessToken: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/profile/password`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message ?? "Failed to change password");
}
