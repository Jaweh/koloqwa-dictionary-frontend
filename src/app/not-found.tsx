import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="font-display text-8xl font-bold italic mb-4"
        style={{ color: "var(--border)" }}>404</div>
      <h1 className="font-display text-3xl font-semibold mb-3"
        style={{ color: "var(--text-primary)" }}>Page not found</h1>
      <p className="text-sm mb-8 max-w-sm" style={{ color: "var(--text-muted)" }}>
        This word hasn&apos;t made it into the dictionary yet — or the page doesn&apos;t exist.
      </p>
      <div className="flex gap-3">
        <Link href="/"
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
          style={{ background: "var(--accent)" }}>
          Go home
        </Link>
        <Link href="/words/search"
          className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
          Search words
        </Link>
      </div>
    </div>
  );
}
