const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:62971/api/v1";

async function fetchAdmin<T>(path: string, options?: RequestInit, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message ?? `HTTP ${res.status}`);
  return json.data;
}

export interface AdminSubmission {
  id: string;
  entryType: string;
  entryId: string;
  entryPreview: string;
  status: string;
  submitterName: string;
  submitterEmail: string;
  adminNote: string | null;
  category: string | null;
  languageName: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedByName: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  isActive: boolean;
  submissionCount: number;
  approvedCount: number;
  createdAt: string;
}

export interface AdminStats {
  totalWords: number;
  totalPhrases: number;
  pendingReview: number;
  approvedTotal: number;
  rejectedTotal: number;
  totalUsers: number;
  activeUsers: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export async function getAdminStats(token: string): Promise<AdminStats> {
  return fetchAdmin<AdminStats>("/admin/stats", {}, token);
}

export async function getAdminSubmissions(
  token: string,
  params: { status?: string; entryType?: string; search?: string; page?: number; pageSize?: number }
): Promise<PagedResult<AdminSubmission>> {
  const q = new URLSearchParams();
  if (params.status) q.set("status", params.status);
  if (params.entryType) q.set("entryType", params.entryType);
  if (params.search) q.set("search", params.search);
  q.set("page", String(params.page ?? 1));
  q.set("pageSize", String(params.pageSize ?? 20));
  return fetchAdmin<PagedResult<AdminSubmission>>(`/admin/submissions?${q}`, {}, token);
}

export async function getSubmissionDetail(token: string, id: string): Promise<Record<string, unknown>> {
  return fetchAdmin<Record<string, unknown>>(`/admin/submissions/${id}/detail`, {}, token);
}

export async function reviewSubmission(
  token: string, id: string, action: "Approve" | "Reject", adminNote?: string
): Promise<void> {
  await fetchAdmin(`/admin/submissions/${id}/review`, {
    method: "POST",
    body: JSON.stringify({ action, adminNote: adminNote ?? null }),
  }, token);
}

export async function deleteSubmission(token: string, id: string): Promise<void> {
  await fetchAdmin(`/admin/submissions/${id}`, { method: "DELETE" }, token);
}

export async function editWordEntry(
  token: string, entryId: string, data: Record<string, unknown>
): Promise<void> {
  await fetchAdmin(`/admin/submissions/${entryId}/word`, {
    method: "PUT", body: JSON.stringify(data),
  }, token);
}

export async function editPhraseEntry(
  token: string, entryId: string, data: Record<string, unknown>
): Promise<void> {
  await fetchAdmin(`/admin/submissions/${entryId}/phrase`, {
    method: "PUT", body: JSON.stringify(data),
  }, token);
}

export async function getAdminUsers(
  token: string, params: { search?: string; page?: number }
): Promise<PagedResult<AdminUser>> {
  const q = new URLSearchParams();
  if (params.search) q.set("search", params.search);
  q.set("page", String(params.page ?? 1));
  return fetchAdmin<PagedResult<AdminUser>>(`/admin/users?${q}`, {}, token);
}

export async function updateUserRole(token: string, userId: string, role: string): Promise<void> {
  await fetchAdmin(`/admin/users/${userId}/role`, {
    method: "PUT", body: JSON.stringify({ role }),
  }, token);
}

export async function toggleUserActive(token: string, userId: string, isActive: boolean): Promise<void> {
  await fetchAdmin(`/admin/users/${userId}/active`, {
    method: "PUT", body: JSON.stringify({ isActive }),
  }, token);
}

export interface AdminReport {
  id: string;
  entryId: string;
  entryType: string;
  entryPreview: string;
  entrySlug: string | null;
  reason: string;
  notes: string | null;
  status: string;
  reporterName: string;
  reporterEmail: string;
  reportedAt: string;
  reviewedAt: string | null;
  reviewedByName: string | null;
}

export interface AdminSuggestion {
  id: string;
  entryId: string;
  entryType: string;
  entryPreview: string;
  entrySlug: string | null;
  field: string;
  currentValue: string;
  suggestedValue: string;
  notes: string | null;
  status: string;
  suggesterName: string;
  suggesterEmail: string;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedByName: string | null;
  adminNote: string | null;
}

export async function getAdminReports(
  token: string,
  params: { status?: string; reason?: string; page?: number }
): Promise<PagedResult<AdminReport>> {
  const q = new URLSearchParams();
  if (params.status) q.set("status", params.status);
  if (params.reason) q.set("reason", params.reason);
  q.set("page", String(params.page ?? 1));
  return fetchAdmin<PagedResult<AdminReport>>(`/admin/reports?${q}`, {}, token);
}

export async function reviewReport(
  token: string, id: string, action: "Dismiss" | "Delete"
): Promise<void> {
  await fetchAdmin(`/admin/reports/${id}/review`, {
    method: "POST", body: JSON.stringify({ action }),
  }, token);
}

export async function getAdminSuggestions(
  token: string,
  params: { status?: string; page?: number }
): Promise<PagedResult<AdminSuggestion>> {
  const q = new URLSearchParams();
  if (params.status) q.set("status", params.status);
  q.set("page", String(params.page ?? 1));
  return fetchAdmin<PagedResult<AdminSuggestion>>(`/admin/suggestions?${q}`, {}, token);
}

export async function reviewSuggestion(
  token: string, id: string, action: "Accept" | "Reject", adminNote?: string
): Promise<void> {
  await fetchAdmin(`/admin/suggestions/${id}/review`, {
    method: "POST", body: JSON.stringify({ action, adminNote: adminNote ?? null }),
  }, token);
}