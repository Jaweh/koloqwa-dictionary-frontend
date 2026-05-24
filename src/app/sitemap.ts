import type { MetadataRoute } from "next";
import { searchWords, searchPhrases } from "@/lib/api";
import { TRIBES } from "@/lib/tribes";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://koloqwa.lr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/words/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/phrases/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/tribes`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...TRIBES.map(t => ({
      url: `${BASE_URL}/tribes/${t.code}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  try {
    const [wordsResult, phrasesResult] = await Promise.all([
      searchWords({ page: 1, pageSize: 100 }),
      searchPhrases({ page: 1, pageSize: 100 }),
    ]);

    const wordRoutes: MetadataRoute.Sitemap = wordsResult.items.map(w => ({
      url: `${BASE_URL}/words/${w.slug}`,
      lastModified: w.publishedAt ? new Date(w.publishedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    const phraseRoutes: MetadataRoute.Sitemap = phrasesResult.items.map(p => ({
      url: `${BASE_URL}/phrases/${p.slug}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...wordRoutes, ...phraseRoutes];
  } catch {
    return staticRoutes;
  }
}