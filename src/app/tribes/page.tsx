import type { Metadata } from "next";
import Link from "next/link";
import { TRIBES } from "@/lib/tribes";

export const metadata: Metadata = {
  title: "Tribal Languages",
  description: "Explore the languages of all 16 Liberian ethnic groups — Kpelle, Bassa, Grebo, Vai, and more.",
};

export default function TribesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-16 px-4 sm:px-6"
        style={{ background: "var(--bg-secondary)" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(circle, var(--accent), transparent)" }} />
          {/* Kente stripe top */}
          <div className="absolute top-0 left-0 right-0 h-1.5 opacity-40"
            style={{ background: "repeating-linear-gradient(90deg, #BF0A30 0px, #BF0A30 30px, #ffffff 30px, #ffffff 60px, #002868 60px, #002868 90px, transparent 90px, transparent 130px)" }} />
        </div>

        <div className="max-w-4xl mx-auto relative">
          <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            <Link href="/" style={{ color: "var(--text-muted)" }} className="hover:underline">Home</Link>
            <span>/</span>
            <span style={{ color: "var(--text-primary)" }}>Tribal Languages</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
            style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)" }}>
            16 ethnic groups documented
          </div>

          <h1 className="font-display text-5xl sm:text-6xl font-bold mb-6"
            style={{ color: "var(--text-primary)" }}>
            The Languages of{" "}
            <span className="italic" style={{ color: "var(--accent)" }}>
              Liberia&apos;s Peoples
          </span>
          </h1>

          <p className="text-lg leading-relaxed max-w-2xl" style={{ color: "var(--text-secondary)" }}>
            Liberia is one of the most linguistically diverse nations in West Africa.
            Each of its 16 recognized ethnic groups carries centuries of language,
            oral tradition, and cultural knowledge. This section is dedicated to
            preserving and celebrating each one.
          </p>
        </div>
      </section>

      {/* Tribes grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {TRIBES.map((tribe, i) => (
            <Link key={tribe.code} href={`/tribes/${tribe.code}`}
              className="group block p-6 rounded-2xl border card-hover"
              style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}>

              {/* Flag + name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--bg-secondary)" }}>
                  {tribe.flag}
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold group-hover:text-kola-600 dark:group-hover:text-kola-400 transition-colors"
                    style={{ color: "var(--text-primary)" }}>
                    {tribe.name}
                  </h2>
                  {tribe.altName && (
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      also: {tribe.altName}
                    </p>
                  )}
                </div>
              </div>

              {/* Region */}
              <div className="flex items-center gap-1.5 mb-3">
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{tribe.region}</span>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed line-clamp-3 mb-4"
                style={{ color: "var(--text-secondary)" }}>
                {tribe.description}
              </p>

              {/* Population + arrow */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono px-2 py-0.5 rounded-full"
                  style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                  {tribe.population} speakers
                </span>
                <span className="text-sm transition-transform group-hover:translate-x-1"
                  style={{ color: "var(--accent)" }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Context note */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-3xl mx-auto text-center p-10 rounded-3xl"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
          <p className="font-display text-2xl font-semibold italic mb-4"
            style={{ color: "var(--text-primary)" }}>
            This section is growing
          </p>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
            The tribal languages section is a living archive. Words and phrases for each
            language are submitted by community members and native speakers. If you speak
            a Liberian ethnic language, your contribution matters.
          </p>
          <Link href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: "var(--accent)", color: "white" }}>
            Back to main dictionary →
          </Link>
        </div>
      </section>
    </div>
  );
}
