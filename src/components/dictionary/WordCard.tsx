import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatPartOfSpeech, languageFlag } from "@/lib/utils";
import { TribeMask } from "@/components/ui/TribeMask";
import type { WordSummary } from "@/types/dictionary";

export function WordCard({ word }: { word: WordSummary }) {
  return (
    <Link href={`/words/${word.slug}`}
      className="block p-5 rounded-2xl border card-hover group"
      style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}>

      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="headword text-xl font-semibold group-hover:text-kola-600 dark:group-hover:text-kola-400 transition-colors"
          style={{ color: "var(--text-primary)" }}>
          {word.headword}
        </h3>
        <Badge variant="pos">{formatPartOfSpeech(word.partOfSpeech)}</Badge>
      </div>

      <p className="text-sm leading-relaxed line-clamp-2 mb-3"
        style={{ color: "var(--text-secondary)" }}>
        {word.firstDefinition}
      </p>

      <div className="flex items-center gap-2">
        {word.languageCode
          ? <TribeMask code={word.languageCode} size={18} />
          : <span className="text-base">{languageFlag(word.languageCode ?? "")}</span>}
        <Badge variant="language">{word.languageName}</Badge>
      </div>
    </Link>
  );
}