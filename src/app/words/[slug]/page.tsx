import { getWordBySlug, searchWords } from "@/lib/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { TribeMask } from "@/components/ui/TribeMask";
import { DefinitionBlock } from "@/components/dictionary/DefinitionBlock";
import { WordCard } from "@/components/dictionary/WordCard";
import { WordActions } from "@/components/community/WordActions";
import { formatPartOfSpeech, languageFlag } from "@/lib/utils";
import Link from "next/link";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const word = await getWordBySlug(params.slug);
    const description = word.definitions[0]?.definition ?? `Definition of ${word.headword}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://koloqwa.lr";
    return {
      title: word.headword,
      description,
      openGraph: {
        title: `${word.headword} — Koloqwa Dictionary`,
        description,
        url: `${appUrl}/words/${params.slug}`,
        type: "article",
      },
    };
  } catch {
    return { title: "Word not found" };
  }
}

export default async function WordDetailPage({ params }: Props) {
  let word;
  try {
    word = await getWordBySlug(params.slug);
  } catch {
    notFound();
  }

  let related = null;
  try {
    const r = await searchWords({
      category: word.category,
      lang: word.languageCode ?? undefined,
      pageSize: 4,
    });
    related = r.items.filter(w => w.slug !== params.slug).slice(0, 3);
  } catch {}

  // Build editable fields for suggest-edit form
  const fields = [
    { label: "Headword", value: word.headword },
    ...(word.pronunciation ? [{ label: "Pronunciation", value: word.pronunciation }] : []),
    ...word.definitions.map((d, i) => ({
      label: `Definition ${i + 1}`,
      value: d.definition,
    })),
    { label: "Tags", value: word.tags.join(", ") },
  ];

  // Build definitions for voting
  const definitions = word.definitions.map(d => ({
    id: d.id,
    definition: d.definition,
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-10" style={{ color: "var(--text-muted)" }}>
        <Link href="/" className="hover:underline" style={{ color: "var(--text-muted)" }}>Home</Link>
        <span>/</span>
        <Link href="/words/search" className="hover:underline" style={{ color: "var(--text-muted)" }}>Words</Link>
        <span>/</span>
        <span style={{ color: "var(--text-primary)" }}>{word.headword}</span>
      </nav>

      {/* Word header */}
      <div className="mb-10">
        <div className="flex flex-wrap items-start gap-3 mb-3">
          <h1 className="headword text-5xl sm:text-6xl font-bold" style={{ color: "var(--text-primary)" }}>
            {word.headword}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="pos">{formatPartOfSpeech(word.partOfSpeech)}</Badge>
            <Badge variant="language">
              {word.languageCode
                ? <><TribeMask code={word.languageCode} size={16} /> {word.languageName}</>
                : "🗣️ Vernacular"}
            </Badge>
          </div>
        </div>

        {word.pronunciation && (
          <p className="font-mono text-lg mb-3" style={{ color: "var(--text-muted)" }}>
            /{word.pronunciation}/
          </p>
        )}

        {word.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {word.tags.map(tag => <Badge key={tag} variant="tag">{tag}</Badge>)}
          </div>
        )}
      </div>

      <hr className="divider-kola mb-10" />

      {/* Definitions */}
      <div className="mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-6"
          style={{ color: "var(--text-muted)" }}>Definitions</h2>
        <div className="space-y-8">
          {word.definitions.map((def, i) => (
            <DefinitionBlock key={def.id} definition={def} index={i} />
          ))}
        </div>
      </div>

      {/* Community actions — favourite, suggest edit, report, votes */}
      <WordActions
        entryId={word.id}
        entryType="Word"
        slug={params.slug}
        fields={fields}
        definitions={definitions}
      />

      {/* Related words */}
      {related && related.length > 0 && (
        <>
          <hr className="divider-kola mb-10" />
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: "var(--text-muted)" }}>
              More from {word.languageName ?? "Vernacular"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(w => <WordCard key={w.id} word={w} />)}
            </div>
          </div>
        </>
      )}

      {word.publishedAt && (
        <p className="text-xs mt-12" style={{ color: "var(--text-muted)" }}>
          Added {new Date(word.publishedAt).toLocaleDateString("en-LR", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      )}
    </div>
  );
}
