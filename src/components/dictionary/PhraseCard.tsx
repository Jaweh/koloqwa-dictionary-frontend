import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { languageFlag } from "@/lib/utils";
import type { PhraseSummary } from "@/types/dictionary";

export function PhraseCard({ phrase }: { phrase: PhraseSummary }) {
  return (
    <Link href={`/phrases/${phrase.slug}`}
      className="block p-5 rounded-2xl border card-hover group"
      style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}>

      <h3 className="font-display text-lg font-semibold italic mb-2 group-hover:text-kola-600 dark:group-hover:text-kola-400 transition-colors"
        style={{ color: "var(--text-primary)" }}>
        &ldquo;{phrase.phraseText}&rdquo;
      </h3>

      <p className="text-sm leading-relaxed line-clamp-2 mb-3"
        style={{ color: "var(--text-secondary)" }}>
        {phrase.firstMeaning}
      </p>

      <div className="flex items-center gap-2">
        <span>{languageFlag(phrase.languageCode)}</span>
        <Badge variant="language">{phrase.languageName}</Badge>
      </div>
    </Link>
  );
}
