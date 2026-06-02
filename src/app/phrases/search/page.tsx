import type { Metadata } from "next";
import { PhraseSearchClient } from "./PhraseSearchClient";

export const metadata: Metadata = {
  title: "Search Phrases",
  description: "Search Liberian language phrases, expressions and idioms.",
};

export default async function PhraseSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return <PhraseSearchClient initialQuery={q ?? ""} />;
}