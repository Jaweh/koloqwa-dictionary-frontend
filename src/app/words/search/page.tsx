import type { Metadata } from "next";
import { WordSearchClient } from "./WordSearchClient";

export const metadata: Metadata = {
  title: "Search Words",
  description: "Search the Koloqwa Dictionary for Liberian language words.",
};

export default function WordSearchPage({
  searchParams,
}: {
  searchParams: { q?: string; lang?: string; page?: string };
}) {
  return (
    <WordSearchClient
      initialQuery={searchParams.q ?? ""}
      initialLang={searchParams.lang ?? ""}
    />
  );
}
