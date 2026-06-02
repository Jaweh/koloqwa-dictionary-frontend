"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SearchInput } from "@/components/search/SearchInput";
import { SearchTabs } from "@/components/search/SearchTabs";
import { WordCard } from "@/components/dictionary/WordCard";
import { PhraseCard } from "@/components/dictionary/PhraseCard";
import { WordCardSkeleton, PhraseCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { useWordSearch, usePhraseSearch } from "@/hooks/useSearch";
import { searchWords, searchPhrases } from "@/lib/api";
import { TRIBES } from "@/lib/tribes";
import { TribeMask } from "@/components/ui/TribeMask";
import type { WordSummary, PhraseSummary } from "@/types/dictionary";

const VERNACULAR_SAMPLES = [
  { word: "Ha lay balay?", meaning: "How are you? / How are you doing?" },
  { word: "She geh belleh", meaning: "She is pregnant" },
  { word: "Your kahn leh go", meaning: "Join me, let us go" },
  { word: "Wetin you say?", meaning: "What did you say?" },
  { word: "Wehplay you eh", meaning: "Where are you?" },
  { word: "We nahn going", meaning: "We are not going" },
];

const PAGE_SIZE = 6;
const PHRASE_PAGE_SIZE = 4;

interface Props {
  initialWords: WordSummary[];
  initialPhrases: PhraseSummary[];
  initialWordsTotalPages: number;
  initialPhrasesTotalPages: number;
}

export function HomepageClient({
  initialWords,
  initialPhrases,
  initialWordsTotalPages,
  initialPhrasesTotalPages,
}: Props) {
  const [activeTab, setActiveTab] = useState<"words" | "phrases">("words");

  // ── Recently added words ───────────────────────────────────────
  const [words, setWords] = useState<WordSummary[]>(initialWords);
  const [wordsPage, setWordsPage] = useState(1);
  const [wordsTotalPages, setWordsTotalPages] = useState(initialWordsTotalPages);
  const [wordsLoading, setWordsLoading] = useState(false);

  // ── Recently added phrases ─────────────────────────────────────
  const [phrases, setPhrases] = useState<PhraseSummary[]>(initialPhrases);
  const [phrasesPage, setPhrasesPage] = useState(1);
  const [phrasesTotalPages, setPhrasesTotalPages] = useState(initialPhrasesTotalPages);
  const [phrasesLoading, setPhrasesLoading] = useState(false);

  // Vernacular-only search on homepage
  const wordSearch = useWordSearch({ category: "Vernacular" });
  const phraseSearch = usePhraseSearch({ category: "Vernacular" });

  const isSearching = wordSearch.query.length > 0 || phraseSearch.query.length > 0;

  // Fetch words on page change
  useEffect(() => {
    if (wordsPage === 1 && initialWords.length > 0) return;
    setWordsLoading(true);
    searchWords({ page: wordsPage, pageSize: PAGE_SIZE })
      .then(data => {
        setWords(data.items);
        setWordsTotalPages(data.totalPages);
      })
      .catch(() => {})
      .finally(() => setWordsLoading(false));
  }, [wordsPage]);

  // Fetch phrases on page change
  useEffect(() => {
    if (phrasesPage === 1 && initialPhrases.length > 0) return;
    setPhrasesLoading(true);
    searchPhrases({ page: phrasesPage, pageSize: PHRASE_PAGE_SIZE })
      .then(data => {
        setPhrases(data.items);
        setPhrasesTotalPages(data.totalPages);
      })
      .catch(() => {})
      .finally(() => setPhrasesLoading(false));
  }, [phrasesPage]);

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, var(--accent), transparent)" }} />
          <div className="absolute bottom-0 -left-24 w-72 h-72 rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, var(--accent), transparent)" }} />
          <div className="absolute top-0 left-0 right-0 h-1 opacity-30"
            style={{ background: "repeating-linear-gradient(90deg, #BF0A30 0px, #BF0A30 40px, transparent 40px, transparent 80px, #002868 80px, #002868 120px, transparent 120px, transparent 160px)" }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
            🇱🇷 The language Liberians actually speak
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6"
            style={{ color: "var(--text-primary)" }}>
            <span style={{ color: "#BF0A30" }}>Liberian</span>{" "}
            English,{" "}
            <span className="italic" style={{ color: "var(--accent)" }}>
              properly documented
            </span>
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
            style={{ color: "var(--text-secondary)" }}>
            From the streets of Monrovia, the shores of Buchanan, the markets of Kakata,
            to the hills of Nimba — Koloqwa captures the words, expressions and phrases
            that make Liberian speech unlike anything else in the world.
          </p>

          <p className="text-sm max-w-xl mx-auto mb-10" style={{ color: "var(--text-muted)" }}>
            Also exploring the languages of all{" "}
            <Link href="/tribes" className="underline underline-offset-2"
              style={{ color: "var(--accent)" }}>
              16 Liberian tribes →
            </Link>
          </p>

          <div className="max-w-2xl mx-auto mb-4">
            <SearchTabs
              tabs={[{ id: "words", label: "Words & Slang" }, { id: "phrases", label: "Expressions & Phrases" }]}
              active={activeTab}
              onChange={id => setActiveTab(id as "words" | "phrases")}
            />
          </div>

          <div className="max-w-2xl mx-auto">
            {activeTab === "words" ? (
              <SearchInput
                value={wordSearch.query}
                onChange={wordSearch.setQuery}
                placeholder='Try "dartor"'
                loading={wordSearch.loading}
                size="lg"
                autoFocus
              />
            ) : (
              <SearchInput
                value={phraseSearch.query}
                onChange={phraseSearch.setQuery}
                placeholder='Try "wehplay you eh"'
                loading={phraseSearch.loading}
                size="lg"
                autoFocus
              />
            )}
          </div>
        </div>
      </section>

      {/* ── Search Results ────────────────────────────────────────── */}
      {isSearching && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <hr className="divider-kola mb-10" />
          {activeTab === "words" && (
            <>
              {wordSearch.loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => <WordCardSkeleton key={i} />)}
                </div>
              ) : wordSearch.error ? (
                <EmptyState icon="⚠️" title="Search failed" description={wordSearch.error} />
              ) : wordSearch.results?.items.length === 0 ? (
                <EmptyState icon="🔍" title="No words found"
                  description={`No results for "${wordSearch.query}". This word might not be in the dictionary yet.`} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wordSearch.results?.items.map(word => <WordCard key={word.id} word={word} />)}
                </div>
              )}
            </>
          )}
          {activeTab === "phrases" && (
            <>
              {phraseSearch.loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => <PhraseCardSkeleton key={i} />)}
                </div>
              ) : phraseSearch.error ? (
                <EmptyState icon="⚠️" title="Search failed" description={phraseSearch.error} />
              ) : phraseSearch.results?.items.length === 0 ? (
                <EmptyState icon="🔍" title="No phrases found"
                  description={`No results for "${phraseSearch.query}".`} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {phraseSearch.results?.items.map(phrase => <PhraseCard key={phrase.id} phrase={phrase} />)}
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* ── Not searching ────────────────────────────────────────── */}
      {!isSearching && (
        <>
          {/* Sample expressions */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
            <div className="mb-8">
              <h2 className="font-display text-3xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                How Liberians really talk
              </h2>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                A taste of what you&apos;ll find in the dictionary
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {VERNACULAR_SAMPLES.map((item, i) => (
                <div key={item.word} className="p-5 rounded-2xl border opacity-0 animate-fade-up"
                  style={{ borderColor: "var(--border)", background: "var(--bg-secondary)", animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}>
                  <p className="font-display text-xl font-semibold italic mb-2" style={{ color: "var(--accent)" }}>
                    &ldquo;{item.word}&rdquo;
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{item.meaning}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/words/search"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white"
                style={{ background: "var(--accent)" }}>
                Browse all words →
              </Link>
            </div>
          </section>

          {/* Recently added words */}
          {(words.length > 0 || wordsLoading) && (
            <section className="px-4 sm:px-6 py-16" style={{ background: "var(--bg-secondary)" }}>
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="font-display text-3xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                      Recently Added
                    </h2>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>Latest community contributions</p>
                  </div>
                  <Link href="/words/search" className="text-sm font-medium hidden sm:block"
                    style={{ color: "var(--accent)" }}>Browse all →</Link>
                </div>

                {wordsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(PAGE_SIZE)].map((_, i) => <WordCardSkeleton key={i} />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {words.map((word, i) => (
                      <div key={word.id} className="opacity-0 animate-fade-up"
                        style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
                        <WordCard word={word} />
                      </div>
                    ))}
                  </div>
                )}

                <Pagination
                  page={wordsPage}
                  totalPages={wordsTotalPages}
                  onPage={p => { setWordsPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                />
              </div>
            </section>
          )}

          {/* Expressions & phrases */}
          {(phrases.length > 0 || phrasesLoading) && (
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-display text-3xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                    Expressions & Phrases
                  </h2>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>Everyday Liberian expressions</p>
                </div>
                <Link href="/phrases/search" className="text-sm font-medium hidden sm:block"
                  style={{ color: "var(--accent)" }}>Browse all →</Link>
              </div>

              {phrasesLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(PHRASE_PAGE_SIZE)].map((_, i) => <PhraseCardSkeleton key={i} />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {phrases.map((phrase, i) => (
                    <div key={phrase.id} className="opacity-0 animate-fade-up"
                      style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}>
                      <PhraseCard phrase={phrase} />
                    </div>
                  ))}
                </div>
              )}

              <Pagination
                page={phrasesPage}
                totalPages={phrasesTotalPages}
                onPage={p => { setPhrasesPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              />
            </section>
          )}

          {/* Tribes teaser */}
          <section className="px-4 sm:px-6 py-20"
            style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
                    style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)" }}>
                    ✦ Separate section
                  </div>
                  <h2 className="font-display text-4xl font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                    Exploring the{" "}
                    <span className="italic" style={{ color: "var(--accent)" }}>16 Tribes</span>
                  </h2>
                  <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                    Beyond the everyday vernacular, Liberia is home to 16 distinct ethnic
                    groups — each with its own language, oral tradition, and cultural heritage.
                  </p>
                  <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
                    From the Vai syllabary — one of the few writing systems independently
                    invented in human history — to the warrior songs of the Kru seafarers.
                  </p>
                  <Link href="/tribes"
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium text-sm text-white"
                    style={{ background: "var(--accent)" }}>
                    Explore all 16 tribes →
                  </Link>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {TRIBES.map(tribe => (
                    <Link key={tribe.code} href={`/tribes/${tribe.code}`}
                      className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
                      style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
                      <TribeMask code={tribe.code} size={32} />
                      <span className="text-xs font-medium text-center leading-tight px-1"
                        style={{ color: "var(--text-muted)" }}>{tribe.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* What is Koloqwa */}
          <section className="py-20 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-4xl font-semibold italic mb-6" style={{ color: "var(--text-primary)" }}>
                What is Koloqwa?
              </h2>
              <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                Koloqwa is a community-powered dictionary built to document the language
                Liberians actually speak — the colloquial, the creative, the unmistakably ours.
              </p>
              <p className="text-base leading-relaxed mb-10" style={{ color: "var(--text-muted)" }}>
                Every word submitted is reviewed by community members before it goes live.
              </p>
              <Link href="/about"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-medium text-sm text-white"
                style={{ background: "var(--accent)" }}>
                Learn more about Koloqwa →
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}