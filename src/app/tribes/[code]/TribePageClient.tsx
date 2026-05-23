"use client";
import { useState } from "react";
import { SearchInput } from "@/components/search/SearchInput";
import { SearchTabs } from "@/components/search/SearchTabs";
import { WordCard } from "@/components/dictionary/WordCard";
import { PhraseCard } from "@/components/dictionary/PhraseCard";
import { WordCardSkeleton, PhraseCardSkeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { useWordSearch, usePhraseSearch } from "@/hooks/useSearch";
import { TribeMask } from "@/components/ui/TribeMask";

interface Props {
  tribeCode: string;
  tribeName: string;
  tribeFlag: string;
}

export function TribePageClient({ tribeCode, tribeName, tribeFlag }: Props) {
  const [activeTab, setActiveTab] = useState<"words" | "phrases">("words");

  const wordSearch = useWordSearch({
    category: "Tribal",
    languageCode: tribeCode,
  });

  const phraseSearch = usePhraseSearch({
    category: "Tribal",
    languageCode: tribeCode,
  });

  const hasWords = (wordSearch.results?.totalCount ?? 0) > 0;
  const hasPhrases = (phraseSearch.results?.totalCount ?? 0) > 0;

  // Each tab has its own loading state — don't block both on one loading
  const wordsLoading = wordSearch.loading;
  const phrasesLoading = phraseSearch.loading;

  // Show tabs once at least one search has resolved
  const bothInitializing = wordsLoading && phrasesLoading && !wordSearch.results && !phraseSearch.results;
  const hasAnyContent = hasWords || hasPhrases;
  const neitherLoading = !wordsLoading && !phrasesLoading;
  const showEmpty = neitherLoading && !hasAnyContent;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}>
          {tribeName} Words & Phrases
        </h2>
        {hasAnyContent && (
          <span className="text-xs px-2 py-1 rounded-full font-mono"
            style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)" }}>
            {(wordSearch.results?.totalCount ?? 0) + (phraseSearch.results?.totalCount ?? 0)} entries
          </span>
        )}
      </div>

      {/* Initial loading — both tabs loading for the first time */}
      {bothInitializing && (
        <div className="space-y-4">
          <div className="h-10 rounded-xl skeleton w-48" />
          <div className="h-10 rounded-xl skeleton" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <WordCardSkeleton key={i} />)}
          </div>
        </div>
      )}

      {/* Tabs + content — show once at least one has resolved */}
      {!bothInitializing && (hasAnyContent || wordsLoading || phrasesLoading) && (
        <>
          <div className="mb-4">
            <SearchTabs
              tabs={[
                { id: "words",   label: "Words",   count: wordSearch.results?.totalCount },
                { id: "phrases", label: "Phrases", count: phraseSearch.results?.totalCount },
              ]}
              active={activeTab}
              onChange={id => setActiveTab(id as "words" | "phrases")}
            />
          </div>

          <div className="mb-6">
            {activeTab === "words" ? (
              <SearchInput
                value={wordSearch.query}
                onChange={wordSearch.setQuery}
                placeholder={`Search ${tribeName} words...`}
                loading={wordsLoading}
                size="md"
              />
            ) : (
              <SearchInput
                value={phraseSearch.query}
                onChange={phraseSearch.setQuery}
                placeholder={`Search ${tribeName} phrases...`}
                loading={phrasesLoading}
                size="md"
              />
            )}
          </div>

          {/* Words tab */}
          {activeTab === "words" && (
            wordsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => <WordCardSkeleton key={i} />)}
              </div>
            ) : wordSearch.results?.items.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border-2 border-dashed"
                style={{ borderColor: "var(--border)" }}>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {wordSearch.query
                    ? `No ${tribeName} words match "${wordSearch.query}"`
                    : `No ${tribeName} words yet`}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wordSearch.results?.items.map(word => <WordCard key={word.id} word={word} />)}
                </div>
                <Pagination
                  page={wordSearch.page}
                  totalPages={wordSearch.results?.totalPages ?? 1}
                  onPage={wordSearch.setPage}
                />
              </>
            )
          )}

          {/* Phrases tab */}
          {activeTab === "phrases" && (
            phrasesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => <PhraseCardSkeleton key={i} />)}
              </div>
            ) : phraseSearch.results?.items.length === 0 ? (
              <div className="text-center py-12 rounded-2xl border-2 border-dashed"
                style={{ borderColor: "var(--border)" }}>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {phraseSearch.query
                    ? `No ${tribeName} phrases match "${phraseSearch.query}"`
                    : `No ${tribeName} phrases yet`}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {phraseSearch.results?.items.map(phrase => <PhraseCard key={phrase.id} phrase={phrase} />)}
                </div>
                <Pagination
                  page={phraseSearch.page}
                  totalPages={phraseSearch.results?.totalPages ?? 1}
                  onPage={phraseSearch.setPage}
                />
              </>
            )
          )}
        </>
      )}

      {/* Empty state — both done loading, nothing found */}
      {showEmpty && (
        <div className="text-center py-16 px-6 rounded-2xl border-2 border-dashed"
          style={{ borderColor: "var(--border)" }}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center overflow-hidden"
            style={{ background: "var(--bg-secondary)" }}>
            <TribeMask code={tribeCode} size={52} />
          </div>
          <h3 className="font-display text-xl font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}>
            {tribeName} words coming soon
          </h3>
          <p className="text-sm max-w-sm mx-auto mb-6" style={{ color: "var(--text-muted)" }}>
            This language section is being built. Native {tribeName} speakers are
            invited to submit words and phrases to help build this archive.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
            style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)" }}>
            ✦ Be the first to contribute {tribeName} words
          </div>
        </div>
      )}
    </section>
  );
}