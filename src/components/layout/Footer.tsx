"use client";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t mt-24"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: "var(--accent)" }}>K</div>
              <span className="font-display font-semibold" style={{ color: "var(--text-primary)" }}>
                Koloqwa Dictionary
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--text-muted)" }}>
              Documenting the words Liberians actually speak — and preserving the languages
              of all 16 ethnic groups for generations to come.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: "var(--text-muted)" }}>Dictionary</h3>
            <ul className="space-y-2">
              {[
                ["Words & Slang", "/words/search"],
                ["Phrases", "/phrases/search"],
                ["About", "/about"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors duration-200 hover:text-kola-500"
                    style={{ color: "var(--text-secondary)" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: "var(--text-muted)" }}>Tribal Languages</h3>
            <ul className="space-y-2">
              {[
                ["All 16 Tribes", "/tribes"],
                ["Kpelle", "/tribes/kpe"],
                ["Bassa", "/tribes/bss"],
                ["Vai", "/tribes/vai"],
                ["Grebo", "/tribes/grb"],
                ["Kru", "/tribes/kru"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors duration-200 hover:text-kola-500"
                    style={{ color: "var(--text-secondary)" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderColor: "var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} Koloqwa Dictionary. Built with love by <b>BRIDGES Technology Group</b> for Liberia 🇱🇷
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Preserving Liberian voices
          </p>
        </div>
      </div>
    </footer>
  );
}
