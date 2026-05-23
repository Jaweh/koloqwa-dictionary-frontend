import { HomepageClient } from "./HomepageClient";
import { searchWords, searchPhrases } from "@/lib/api";
import type { PagedResult, WordSummary, PhraseSummary } from "@/types/dictionary";

export default async function HomePage() {
  let featuredWords: PagedResult<WordSummary> | null = null;
  let featuredPhrases: PagedResult<PhraseSummary> | null = null;

  try { featuredWords = await searchWords({ page: 1, pageSize: 6 }); } catch {}
  try { featuredPhrases = await searchPhrases({ page: 1, pageSize: 4 }); } catch {}

  return (
    <HomepageClient
      initialWords={featuredWords?.items ?? []}
      initialPhrases={featuredPhrases?.items ?? []}
      initialWordsTotalPages={featuredWords?.totalPages ?? 1}
      initialPhrasesTotalPages={featuredPhrases?.totalPages ?? 1}
    />
  );
}