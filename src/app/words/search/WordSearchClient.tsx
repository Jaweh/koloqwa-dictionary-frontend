"use client";
import { SearchInput } from "@/components/search/SearchInput";
import { WordCard } from "@/components/dictionary/WordCard";
import { WordCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { useWordSearch } from "@/hooks/useSearch";

interface Props {
  initialQuery: string;
  initialLang: string;
}

export function WordSearchClient({ initialQuery }: Props) {
  const { results, loading, error, query, setQuery, page, setPage } =
    useWordSearch({ initialQuery, category: "Vernacular" });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
          Word Dictionary
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Liberian vernacular words and street language
        </p>
      </div>

      <div className="mb-8">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search for a Liberian word..."
          loading={loading}
          size="lg"
          autoFocus
        />
      </div>

      {results && !loading && (
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          {results.totalCount === 0
            ? "No results"
            : `${results.totalCount} word${results.totalCount !== 1 ? "s" : ""}${query ? ` for "${query}"` : ""}`}
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => <WordCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <EmptyState icon="⚠️" title="Something went wrong" description={error} />
      ) : results?.items.length === 0 ? (
        <EmptyState icon="🔍" title="No words found"
          description={query ? `No results for "${query}". Try a different spelling.` : "The dictionary is empty."} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results?.items.map(word => <WordCard key={word.id} word={word} />)}
          </div>
          <Pagination page={page} totalPages={results?.totalPages ?? 1} onPage={setPage} />
        </>
      )}
    </div>
  );
}
