const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:62971/api/v1";

async function fetchCommunity<T>(
  path: string, options?: RequestInit, token?: string
): Promise<T> {
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

export interface DefinitionVoteDto {
  definitionId: string;
  voteCount: number;
  userHasVoted: boolean;
}

export interface EntryContext {
  isFavourited: boolean;
  hasReported: boolean;
  definitionVotes: DefinitionVoteDto[];
}

export interface FavouriteItem {
  entryId: string;
  entryType: string;
  entryPreview: string;
  partOfSpeech: string | null;
  firstMeaning: string | null;
  slug: string | null;
  savedAt: string;
}

export async function getEntryContext(
  entryType: string, entryId: string, token?: string
): Promise<EntryContext> {
  return fetchCommunity<EntryContext>(
    `/community/context/${entryType}/${entryId}`, {}, token);
}

export async function suggestEdit(token: string, data: {
  entryId: string; entryType: string; field: string;
  currentValue: string; suggestedValue: string; notes?: string;
}): Promise<void> {
  await fetchCommunity(`/community/suggest`, {
    method: "POST", body: JSON.stringify(data),
  }, token);
}

export async function reportEntry(token: string, data: {
  entryId: string; entryType: string; reason: string; notes?: string;
}): Promise<void> {
  await fetchCommunity(`/community/report`, {
    method: "POST", body: JSON.stringify(data),
  }, token);
}

export async function voteDefinition(token: string, definitionId: string): Promise<{ voted: boolean; totalVotes: number }> {
  return fetchCommunity(`/community/vote/${definitionId}`, { method: "POST" }, token);
}

export async function toggleFavourite(token: string, entryId: string, entryType: string): Promise<boolean> {
  const res = await fetchCommunity<{ isFavourited: boolean }>(
    `/community/favourite`, {
      method: "POST",
      body: JSON.stringify({ entryId, entryType }),
    }, token);
  return res.isFavourited;
}

export async function getUserFavourites(token: string, page = 1): Promise<{
  items: FavouriteItem[]; totalCount: number; totalPages: number; page: number; pageSize: number;
}> {
  return fetchCommunity(`/community/favourites?page=${page}`, {}, token);
}
