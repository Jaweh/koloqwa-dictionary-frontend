import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTribe, TRIBES } from "@/lib/tribes";
import { TribePageClient } from "./TribePageClient";
import { TribeMask } from "@/components/ui/TribeMask";

interface Props { params: Promise<{ code: string }> }

export async function generateStaticParams() {
  return TRIBES.map(t => ({ code: t.code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const tribe = getTribe(code);
  if (!tribe) return { title: "Tribe not found" };
  return { title: `${tribe.name} Language`, description: tribe.description };
}

export default async function TribePage({ params }: Props) {
  const { code } = await params;
  const tribe = getTribe(code);
  if (!tribe) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <nav className="flex items-center gap-2 text-sm mb-10" style={{ color: "var(--text-muted)" }}>
        <Link href="/" className="hover:underline" style={{ color: "var(--text-muted)" }}>Home</Link>
        <span>/</span>
        <Link href="/tribes" className="hover:underline" style={{ color: "var(--text-muted)" }}>Tribal Languages</Link>
        <span>/</span>
        <span style={{ color: "var(--text-primary)" }}>{tribe.name}</span>
      </nav>

      {/* Tribe header with mask */}
      <div className="flex items-start gap-6 mb-10">
        <div className="w-24 h-28 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
          <TribeMask code={tribe.code} size={72} />
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
          <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: "var(--text-muted)" }}>
            <span>📍 {tribe.region}</span>
            <span>👥 {tribe.population} speakers</span>
          </div>
        </div>
      </div>

      <hr className="divider-kola mb-10" />

      <section className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: "var(--text-muted)" }}>About the {tribe.name} people</h2>
        <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
          {tribe.description}
        </p>
        <div className="p-5 rounded-2xl"
          style={{ background: "var(--bg-secondary)", borderLeft: "4px solid var(--accent)", border: "1px solid var(--border)", borderLeftWidth: "4px" }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--accent)" }}>
            Cultural note
          </p>
          <p className="text-sm leading-relaxed italic" style={{ color: "var(--text-secondary)" }}>
            {tribe.culturalNote}
          </p>
        </div>
      </section>

      <TribePageClient tribeCode={tribe.code} tribeName={tribe.name} tribeFlag="" />

      <section className="mt-16">
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-6"
          style={{ color: "var(--text-muted)" }}>Other Liberian Languages</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TRIBES.filter(t => t.code !== code).slice(0, 8).map(t => (
            <Link key={t.code} href={`/tribes/${t.code}`}
              className="p-4 rounded-xl border text-center card-hover group flex flex-col items-center gap-2"
              style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
              <TribeMask code={t.code} size={40} />
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