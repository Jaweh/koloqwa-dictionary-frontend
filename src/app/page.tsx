import { HomepageClient } from "./HomepageClient";
import { searchWords, searchPhrases } from "@/lib/api";

export default async function HomePage() {
  // Server-side fetch featured words
  let featuredWords = null;
  let featuredPhrases = null;

  try {
    featuredWords = await searchWords({ page: 1, pageSize: 6 });
  } catch {}
  try {
    featuredPhrases = await searchPhrases({ page: 1, pageSize: 4 });
  } catch {}

  return (
    <HomepageClient
      initialWords={featuredWords?.items ?? []}
      initialPhrases={featuredPhrases?.items ?? []}
    />
  );
}
