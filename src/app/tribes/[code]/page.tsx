import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTribe, TRIBES } from "@/lib/tribes";

interface Props {
  params: { code: string };
}

export async function generateStaticParams() {
  return TRIBES.map(t => ({ code: t.code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tribe = getTribe(params.code);
  if (!tribe) return { title: "Tribe not found" };
  return {
    title: `${tribe.name} Language`,
    description: tribe.description,
  };
}

// Mock word samples per tribe for visual preview
const MOCK_WORDS: Record<string, Array<{ word: string; pos: string; meaning: string }>> = {
  kpe: [
    { word: "Kpelle", pos: "n.", meaning: "The name of the people and their language" },
    { word: "Gbowee", pos: "n.", meaning: "A traditional title of respect for elders" },
  ],
  bss: [
    { word: "Bassa Vah", pos: "n.", meaning: "The indigenous writing script of the Bassa people" },
  ],
  vai: [
    { word: "Vai", pos: "n.", meaning: "The people and their independently-created syllabary" },
    { word: "Nsarigbe", pos: "n.", meaning: "Traditional Vai musical instrument" },
  ],
};

export default function TribePage({ params }: Props) {
  const tribe = getTribe(params.code);
  if (!tribe) notFound();

  const mockWords = MOCK_WORDS[params.code] ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-10" style={{ color: "var(--text-muted)" }}>
        <Link href="/" className="hover:underline" style={{ color: "var(--text-muted)" }}>Home</Link>
        <span>/</span>
        <Link href="/tribes" className="hover:underline" style={{ color: "var(--text-muted)" }}>Tribal Languages</Link>
        <span>/</span>
        <span style={{ color: "var(--text-primary)" }}>{tribe.name}</span>
      </nav>

      {/* Tribe header */}
      <div className="flex items-start gap-6 mb-10">
        <div className="text-6xl w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
          {tribe.flag}
        </div>
        <div>
          <h1 className="font-display text-5xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            {tribe.name}
          </h1>
          {tribe.altName && (
            <p className="text-base mb-2" style={{ color: "var(--text-muted)" }}>
              Also known as: <span className="italic">{tribe.altName}</span>
            </p>
          )}
          <div className="flex items-center gap-4 text-sm" style={{ color: "var(--text-muted)" }}>
            <span>📍 {tribe.region}</span>
            <span>👥 {tribe.population} speakers</span>
          </div>
        </div>
      </div>

      <hr className="divider-kola mb-10" />

      {/* About */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: "var(--text-muted)" }}>About the {tribe.name} people</h2>
        <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
          {tribe.description}
        </p>

        {/* Cultural note */}
        <div className="p-5 rounded-2xl border-l-4"
          style={{ background: "var(--bg-secondary)", borderLeftColor: "var(--accent)", border: "1px solid var(--border)", borderLeftWidth: "4px" }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "var(--accent)" }}>Cultural note</p>
          <p className="text-sm leading-relaxed italic" style={{ color: "var(--text-secondary)" }}>
            {tribe.culturalNote}
          </p>
        </div>
      </section>

      {/* Words section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}>{tribe.name} Words & Phrases</h2>
        </div>

        {mockWords.length > 0 ? (
          <div className="space-y-4 mb-8">
            {mockWords.map(w => (
              <div key={w.word} className="p-5 rounded-2xl border"
                style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-display text-xl font-semibold italic"
                    style={{ color: "var(--text-primary)" }}>{w.word}</span>
                  <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>{w.pos}</span>
                </div>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{w.meaning}</p>
              </div>
            ))}
          </div>
        ) : null}

        {/* Coming soon state */}
        <div className="text-center py-16 px-6 rounded-2xl border-2 border-dashed"
          style={{ borderColor: "var(--border)" }}>
          <div className="text-4xl mb-4">{tribe.flag}</div>
          <h3 className="font-display text-xl font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}>
            {tribe.name} words coming soon
          </h3>
          <p className="text-sm max-w-sm mx-auto mb-6" style={{ color: "var(--text-muted)" }}>
            This language section is being built. Native {tribe.name} speakers are
            invited to submit words and phrases to help build this archive.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
            style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)" }}>
            ✦ Submissions open when backend is ready
          </div>
        </div>
      </section>

      {/* Other tribes */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-6"
          style={{ color: "var(--text-muted)" }}>Other Liberian Languages</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TRIBES.filter(t => t.code !== params.code).slice(0, 8).map(t => (
            <Link key={t.code} href={`/tribes/${t.code}`}
              className="p-4 rounded-xl border text-center card-hover group"
              style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
              <div className="text-2xl mb-2">{t.flag}</div>
              <div className="text-sm font-medium group-hover:text-kola-600 dark:group-hover:text-kola-400 transition-colors"
                style={{ color: "var(--text-primary)" }}>{t.name}</div>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/tribes" className="text-sm font-medium" style={{ color: "var(--accent)" }}>
            View all 16 tribes →
          </Link>
        </div>
      </section>
    </div>
  );
}
