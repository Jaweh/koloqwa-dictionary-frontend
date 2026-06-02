import type { Metadata } from "next";
import { WordSearchClient } from "./WordSearchClient";

export const metadata: Metadata = {
  title: "Search Words",
  description: "Search the Koloqwa Dictionary for Liberian language words.",
};

export default async function WordSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; lang?: string; page?: string }>;
}) {
  const { q, lang } = await searchParams;
  return (
    <WordSearchClient
      initialQuery={q ?? ""}
      initialLang={lang ?? ""}
    />
  );
}