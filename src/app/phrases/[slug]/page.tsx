import { getPhraseBySlug, searchPhrases } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { PhraseCard } from "@/components/dictionary/PhraseCard";
import { languageFlag } from "@/lib/utils";
import Link from "next/link";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const phrase = await getPhraseBySlug(params.slug);
    return {
      title: phrase.phraseText,
      description: phrase.meanings[0]?.meaning ?? `Meaning of "${phrase.phraseText}" in ${phrase.languageName}`,
    };
  } catch {
    return { title: "Phrase not found" };
  }
}

export default async function PhraseDetailPage({ params }: Props) {
  let phrase;
  try {
    phrase = await getPhraseBySlug(params.slug);
  } catch {
    notFound();
  }

  let related = null;
  try {
    const r = await searchPhrases({ lang: phrase.languageCode, pageSize: 5 });
    related = r.items.filter(p => p.slug !== params.slug).slice(0, 4);
  } catch {}

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-10" style={{ color: "var(--text-muted)" }}>
        <Link href="/" className="hover:underline" style={{ color: "var(--text-muted)" }}>Home</Link>
        <span>/</span>
        <Link href="/phrases/search" className="hover:underline" style={{ color: "var(--text-muted)" }}>Phrases</Link>
        <span>/</span>
        <span style={{ color: "var(--text-primary)" }}>{phrase.phraseText}</span>
      </nav>

      {/* Phrase header */}
      <div className="mb-10">
        <blockquote className="font-display text-4xl sm:text-5xl font-semibold italic leading-tight mb-5"
          style={{ color: "var(--text-primary)" }}>
          &ldquo;{phrase.phraseText}&rdquo;
        </blockquote>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="language">
            {languageFlag(phrase.languageCode)} {phrase.languageName}
          </Badge>
          {phrase.tags.map(tag => <Badge key={tag} variant="tag">{tag}</Badge>)}
        </div>

        {phrase.literalMeaning && (
          <div className="p-4 rounded-xl" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
              Literal meaning
            </p>
            <p className="text-sm italic" style={{ color: "var(--text-secondary)" }}>
              {phrase.literalMeaning}
            </p>
          </div>
        )}
      </div>

      <hr className="divider-kola mb-10" />

      {/* Meanings */}
      <div className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-6"
          style={{ color: "var(--text-muted)" }}>Meanings & Usage</h2>

        <div className="space-y-8">
          {phrase.meanings.map((meaning, i) => (
            <div key={meaning.id} className="flex gap-4">
              <span className="font-mono text-sm font-medium flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs mt-0.5"
                style={{ background: "var(--accent)", color: "white" }}>
                {i + 1}
              </span>
              <div>
                <p className="text-base leading-relaxed mb-2" style={{ color: "var(--text-primary)" }}>
                  {meaning.meaning}
                </p>
                {meaning.contextNote && (
                  <div className="pl-4 border-l-2" style={{ borderColor: "var(--border)" }}>
                    <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>
                      <span className="font-medium not-italic">Context: </span>
                      {meaning.contextNote}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related phrases */}
      {related && related.length > 0 && (
        <>
          <hr className="divider-kola mb-10" />
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: "var(--text-muted)" }}>More {phrase.languageName} Phrases</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map(p => <PhraseCard key={p.id} phrase={p} />)}
            </div>
          </div>
        </>
      )}

      {phrase.publishedAt && (
        <p className="text-xs mt-12" style={{ color: "var(--text-muted)" }}>
          Added {new Date(phrase.publishedAt).toLocaleDateString("en-LR", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      )}
    </div>
  );
}
