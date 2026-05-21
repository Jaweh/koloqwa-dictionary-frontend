"use client";
import { useState } from "react";
import Link from "next/link";
import { SearchInput } from "@/components/search/SearchInput";
import { SearchTabs } from "@/components/search/SearchTabs";
import { WordCard } from "@/components/dictionary/WordCard";
import { PhraseCard } from "@/components/dictionary/PhraseCard";
import { WordCardSkeleton, PhraseCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useWordSearch, usePhraseSearch } from "@/hooks/useSearch";
import type { WordSummary, PhraseSummary } from "@/types/dictionary";

// Sample vernacular expressions shown before any search
const VERNACULAR_SAMPLES = [
  { word: "How the body?", meaning: "How are you? / How are you doing?" },
  { word: "Soft life", meaning: "An easy, comfortable lifestyle" },
  { word: "Paining me", meaning: "It's hurting me / causing me pain" },
  { word: "Seh wah?", meaning: "Say what? / Really? / Is that so?" },
  { word: "On the way-o", meaning: "I'm coming / I'm on my way" },
  { word: "Fine-o", meaning: "I'm fine / Things are good" },
];

interface Props {
  initialWords: WordSummary[];
  initialPhrases: PhraseSummary[];
}

export function HomepageClient({ initialWords, initialPhrases }: Props) {
  const [activeTab, setActiveTab] = useState<"words" | "phrases">("words");
  const wordSearch = useWordSearch();
  const phraseSearch = usePhraseSearch();
  const isSearching = wordSearch.query.length > 0 || phraseSearch.query.length > 0;

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, var(--accent), transparent)" }} />
          <div className="absolute bottom-0 -left-24 w-72 h-72 rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, var(--accent), transparent)" }} />
          {/* Subtle kente-inspired lines */}
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

          <p className="text-sm max-w-xl mx-auto mb-10"
            style={{ color: "var(--text-muted)" }}>
            Also exploring the languages of all{" "}
            <Link href="/tribes" className="underline underline-offset-2 transition-colors"
              style={{ color: "var(--accent)" }}>
              16 Liberian tribes →
            </Link>
          </p>

          {/* Search tabs */}
          <div className="max-w-2xl mx-auto mb-4">
            <SearchTabs
              tabs={[{ id: "words", label: "Words & Slang" }, { id: "phrases", label: "Expressions & Phrases" }]}
              active={activeTab}
              onChange={id => setActiveTab(id as "words" | "phrases")}
            />
          </div>

          {/* Search input */}
          <div className="max-w-2xl mx-auto">
            {activeTab === "words" ? (
              <SearchInput
                value={wordSearch.query}
                onChange={wordSearch.setQuery}
                placeholder='Try "soft life", "how the body", "paining me"...'
                loading={wordSearch.loading}
                size="lg"
                autoFocus
              />
            ) : (
              <SearchInput
                value={phraseSearch.query}
                onChange={phraseSearch.setQuery}
                placeholder='Try "on the way-o", "seh wah", "fine-o"...'
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
                  description={`No results for "${wordSearch.query}". This word might not be in the dictionary yet — consider submitting it!`} />
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
                  description={`No results for "${phraseSearch.query}". Try different keywords.`} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {phraseSearch.results?.items.map(phrase => <PhraseCard key={phrase.id} phrase={phrase} />)}
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* ── Not searching: show vernacular samples + featured ────── */}
      {!isSearching && (
        <>
          {/* Vernacular sample expressions */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
            <div className="mb-8">
              <h2 className="font-display text-3xl font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}>
                How Liberians really talk
              </h2>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                A taste of what you'll find in the dictionary
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {VERNACULAR_SAMPLES.map((item, i) => (
                <div key={item.word}
                  className="p-5 rounded-2xl border opacity-0 animate-fade-up"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--bg-secondary)",
                    animationDelay: `${i * 80}ms`,
                    animationFillMode: "forwards"
                  }}>
                  <p className="font-display text-xl font-semibold italic mb-2"
                    style={{ color: "var(--accent)" }}>
                    &ldquo;{item.word}&rdquo;
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {item.meaning}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/words/search"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all"
                style={{ background: "var(--accent)", color: "white" }}>
                Browse all words →
              </Link>
            </div>
          </section>

          {/* Featured words from API */}
          {initialWords.length > 0 && (
            <section className="px-4 sm:px-6 py-16" style={{ background: "var(--bg-secondary)" }}>
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="font-display text-3xl font-semibold mb-1"
                      style={{ color: "var(--text-primary)" }}>Recently Added</h2>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                      Latest community contributions
                    </p>
                  </div>
                  <Link href="/words/search" className="text-sm font-medium hidden sm:block"
                    style={{ color: "var(--accent)" }}>Browse all →</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {initialWords.map((word, i) => (
                    <div key={word.id} className="opacity-0 animate-fade-up"
                      style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}>
                      <WordCard word={word} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Featured phrases */}
          {initialPhrases.length > 0 && (
            <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-display text-3xl font-semibold mb-1"
                    style={{ color: "var(--text-primary)" }}>Expressions & Phrases</h2>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Everyday Liberian expressions
                  </p>
                </div>
                <Link href="/phrases/search" className="text-sm font-medium hidden sm:block"
                  style={{ color: "var(--accent)" }}>Browse all →</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {initialPhrases.map((phrase, i) => (
                  <div key={phrase.id} className="opacity-0 animate-fade-up"
                    style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}>
                    <PhraseCard phrase={phrase} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Tribal Languages teaser ──────────────────────────── */}
          <section className="px-4 sm:px-6 py-20"
            style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
                    style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)" }}>
                    ✦ Separate section
                  </div>
                  <h2 className="font-display text-4xl font-semibold mb-4"
                    style={{ color: "var(--text-primary)" }}>
                    Exploring the{" "}
                    <span className="italic" style={{ color: "var(--accent)" }}>16 Tribes</span>
                  </h2>
                  <p className="text-base leading-relaxed mb-6"
                    style={{ color: "var(--text-secondary)" }}>
                    Beyond the everyday vernacular, Liberia is home to 16 distinct ethnic
                    groups — each with its own language, oral tradition, and cultural heritage.
                    Koloqwa dedicates a separate section to preserving these indigenous voices.
                  </p>
                  <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
                    From the Vai syllabary — one of the few writing systems independently
                    invented in human history — to the warrior songs of the Kru seafarers,
                    every tribe has a story worth telling.
                  </p>
                  <Link href="/tribes"
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium text-sm transition-all text-white"
                    style={{ background: "var(--accent)" }}>
                    Explore all 16 tribes →
                  </Link>
                </div>

                {/* Tribe preview grid */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { code: "kpe", name: "Kpelle", flag: "🌿" },
                    { code: "bss", name: "Bassa", flag: "🌊" },
                    { code: "grb", name: "Grebo", flag: "🌄" },
                    { code: "gio", name: "Gio", flag: "🦅" },
                    { code: "vai", name: "Vai", flag: "📜" },
                    { code: "kru", name: "Kru", flag: "⚓" },
                    { code: "man", name: "Mandingo", flag: "📿" },
                    { code: "lor", name: "Lorma", flag: "🌾" },
                    { code: "mno", name: "Mano", flag: "⚒️" },
                    { code: "kis", name: "Kissi", flag: "🎵" },
                    { code: "gol", name: "Gola", flag: "🎭" },
                    { code: "sap", name: "Sapo", flag: "🌳" },
                    { code: "bel", name: "Belle", flag: "🍃" },
                    { code: "dey", name: "Dey", flag: "🏙️" },
                    { code: "mnd", name: "Mende", flag: "🏔️" },
                    { code: "gbd", name: "Gbandi", flag: "🧵" },
                  ].map((tribe, i) => (
                    <Link key={tribe.code} href={`/tribes/${tribe.code}`}
                      className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
                      style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
                      <span className="text-xl">{tribe.flag}</span>
                      <span className="text-xs font-medium text-center leading-tight px-1"
                        style={{ color: "var(--text-muted)" }}>{tribe.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── About strip ───────────────────────────────────────── */}
          <section className="py-20 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-4xl font-semibold italic mb-6"
                style={{ color: "var(--text-primary)" }}>
                What is Koloqwa?
              </h2>
              <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                Koloqwa is a community-powered dictionary built to document the language
                Liberians actually speak — the colloquial, the creative, the unmistakably ours.
                Not the English they taught in school, but the words born on the streets of
                Monrovia, in the markets, in the music.
              </p>
              <p className="text-base leading-relaxed mb-10" style={{ color: "var(--text-muted)" }}>
                Every word submitted is reviewed by community members before it goes live,
                ensuring the dictionary stays authentic and accurate.
              </p>
              <Link href="/about"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-medium text-sm transition-all"
                style={{ background: "var(--accent)", color: "white" }}>
                Learn more about Koloqwa →
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
