"use client";
import { SearchInput } from "@/components/search/SearchInput";
import { PhraseCard } from "@/components/dictionary/PhraseCard";
import { PhraseCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { usePhraseSearch } from "@/hooks/useSearch";

export function PhraseSearchClient({ initialQuery }: { initialQuery: string }) {
  const { results, loading, error, query, setQuery, page, setPage } = usePhraseSearch(initialQuery);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
          Phrases & Expressions
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Idioms, proverbs and everyday expressions from Liberian languages
        </p>
      </div>

      <div className="mb-8">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search for a phrase or expression..."
          loading={loading}
          size="lg"
          autoFocus
        />
      </div>

      {results && !loading && (
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          {results.totalCount === 0
            ? "No results"
            : `${results.totalCount} phrase${results.totalCount !== 1 ? "s" : ""}${query ? ` for "${query}"` : ""}`}
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => <PhraseCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <EmptyState icon="⚠️" title="Something went wrong" description={error} />
      ) : results?.items.length === 0 ? (
        <EmptyState icon="💬" title="No phrases found"
          description={query ? `No results for "${query}".` : "No phrases yet."} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results?.items.map(phrase => <PhraseCard key={phrase.id} phrase={phrase} />)}
          </div>
          <Pagination page={page} totalPages={results?.totalPages ?? 1} onPage={setPage} />
        </>
      )}
    </div>
  );
}
