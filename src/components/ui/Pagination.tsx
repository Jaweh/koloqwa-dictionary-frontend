"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}

export function Pagination({ page, totalPages, onPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button onClick={() => onPage(page - 1)} disabled={page === 1}
        className="px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ color: "var(--text-secondary)", background: "var(--bg-secondary)" }}>
        ← Prev
      </button>

      {pages.map(p => (
        <button key={p} onClick={() => onPage(p)}
          className="w-9 h-9 rounded-lg text-sm font-medium transition-all"
          style={{
            background: p === page ? "var(--accent)" : "var(--bg-secondary)",
            color: p === page ? "white" : "var(--text-secondary)",
          }}>
          {p}
        </button>
      ))}

      <button onClick={() => onPage(page + 1)} disabled={page === totalPages}
        className="px-3 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ color: "var(--text-secondary)", background: "var(--bg-secondary)" }}>
        Next →
      </button>
    </div>
  );
}
