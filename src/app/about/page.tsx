import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about the Koloqwa Dictionary — documenting Liberian vernacular English and all 16 tribal languages.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <div className="mb-16">
        <h1 className="font-display text-5xl font-bold italic mb-6"
          style={{ color: "var(--text-primary)" }}>
          About Koloqwa
        </h1>
        <p className="text-xl leading-relaxed max-w-2xl" style={{ color: "var(--text-secondary)" }}>
          A community dictionary for the language Liberians actually speak —
          and a living archive for the 16 indigenous languages that have always been here.
        </p>
      </div>

      <hr className="divider-kola mb-16" />

      {/* Two sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {/* Vernacular */}
        <div className="p-8 rounded-2xl border"
          style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
          <div className="text-3xl mb-4">🗣️</div>
          <h2 className="font-display text-2xl font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}>
            Liberian Vernacular
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
            The main dictionary documents the colloquial English that Liberians speak
            every day — the words born on the streets of Monrovia, in the markets,
            in the music, and in everyday conversation.
          </p>
          <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>
            &ldquo;How the body?&rdquo;, &ldquo;soft life&rdquo;, &ldquo;paining me&rdquo;,
            &ldquo;seh wah?&rdquo; — these are the words Koloqwa was built to document.
          </p>
        </div>

        {/* Tribal */}
        <div className="p-8 rounded-2xl border"
          style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
          <div className="text-3xl mb-4">🌍</div>
          <h2 className="font-display text-2xl font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}>
            16 Tribal Languages
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
            A dedicated section preserves the indigenous languages of Liberia&apos;s
            16 ethnic groups — Kpelle, Bassa, Grebo, Vai, Kru, Mandingo, and more.
            Each with its own vocabulary, oral tradition, and cultural identity.
          </p>
          <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>
            Including the Vai syllabary — one of the few writing systems
            independently invented in all of human history.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="mb-16">
        <h2 className="font-display text-3xl font-semibold mb-6"
          style={{ color: "var(--text-primary)" }}>Our Mission</h2>
        <div className="space-y-4 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <p>
            Languages die when they stop being written down. Koloqwa exists to make sure
            Liberian speech — both the everyday vernacular and the deep-rooted indigenous
            languages — has a permanent, searchable, accessible digital home.
          </p>
          <p>
            This is not a project built by outsiders looking in. Every word in the dictionary
            is submitted by community members, reviewed for accuracy, and published with
            cultural context to ensure authenticity.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-16">
        <h2 className="font-display text-3xl font-semibold mb-8"
          style={{ color: "var(--text-primary)" }}>How It Works</h2>
        <div className="space-y-6">
          {[
            { step: "01", title: "Community submits", desc: "Anyone can submit a word or phrase — with a definition, example sentence, and cultural context." },
            { step: "02", title: "Reviewed for accuracy", desc: "Each submission is reviewed by community administrators who verify the meaning and context before publishing." },
            { step: "03", title: "Published & searchable", desc: "Approved entries join the living dictionary — free to search, share, and explore by anyone, anywhere." },
          ].map(item => (
            <div key={item.step} className="flex gap-5">
              <div className="font-mono text-2xl font-bold flex-shrink-0 w-10"
                style={{ color: "var(--accent)" }}>{item.step}</div>
              <div>
                <h3 className="font-semibold text-base mb-1" style={{ color: "var(--text-primary)" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center p-10 rounded-3xl"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
        <h2 className="font-display text-3xl font-semibold mb-4"
          style={{ color: "var(--text-primary)" }}>Start Exploring</h2>
        <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
          Search Liberian vernacular or explore the tribal languages section.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/words/search"
            className="px-8 py-3 rounded-xl text-sm font-medium text-white"
            style={{ background: "var(--accent)" }}>
            Browse Vernacular Words
          </Link>
          <Link href="/tribes"
            className="px-8 py-3 rounded-xl text-sm font-medium"
            style={{ background: "var(--bg-primary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
            Explore 16 Tribes
          </Link>
        </div>
      </div>
    </div>
  );
}
