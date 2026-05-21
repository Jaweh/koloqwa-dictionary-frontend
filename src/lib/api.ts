import type {
  ApiResponse,
  PagedResult,
  WordSummary,
  WordDetail,
  PhraseSummary,
  PhraseDetail,
  SearchParams,
} from "@/types/dictionary";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:62971/api/v1";

async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    // Allow self-signed cert in dev
    ...(process.env.NODE_ENV === "development" ? {} : {}),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message ?? `HTTP ${res.status}`);
  }

  const json: ApiResponse<T> = await res.json();
  if (!json.success) throw new Error(json.message ?? "Request failed");
  return json.data;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

// ── Words ────────────────────────────────────────────────────────────────────
export async function searchWords(
  params: SearchParams
): Promise<PagedResult<WordSummary>> {
  const qs = buildQuery({
    q: params.q,
    lang: params.lang,
    pos: params.pos,
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 20,
  });
  return fetchApi<PagedResult<WordSummary>>(`/words/search${qs}`);
}

export async function getWordBySlug(slug: string): Promise<WordDetail> {
  return fetchApi<WordDetail>(`/words/${slug}`);
}

// ── Phrases ──────────────────────────────────────────────────────────────────
export async function searchPhrases(
  params: SearchParams
): Promise<PagedResult<PhraseSummary>> {
  const qs = buildQuery({
    q: params.q,
    lang: params.lang,
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 20,
  });
  return fetchApi<PagedResult<PhraseSummary>>(`/phrases/search${qs}`);
}

export async function getPhraseBySlug(slug: string): Promise<PhraseDetail> {
  return fetchApi<PhraseDetail>(`/phrases/${slug}`);
}
