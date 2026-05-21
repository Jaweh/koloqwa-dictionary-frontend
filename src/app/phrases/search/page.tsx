import type { Metadata } from "next";
import { PhraseSearchClient } from "./PhraseSearchClient";

export const metadata: Metadata = {
  title: "Search Phrases",
  description: "Search Liberian language phrases, expressions and idioms.",
};

export default function PhraseSearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  return <PhraseSearchClient initialQuery={searchParams.q ?? ""} />;
}
