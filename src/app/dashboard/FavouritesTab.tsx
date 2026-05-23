"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getUserFavourites, type FavouriteItem } from "@/lib/community-api";
import { Pagination } from "@/components/ui/Pagination";

export function FavouritesTab() {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<FavouriteItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    getUserFavourites(accessToken, page)
      .then(data => {
        setItems(data.items);
        setTotal(data.totalCount);
        setTotalPages(data.totalPages);
      })
      .finally(() => setLoading(false));
  }, [accessToken, page]);

  if (loading) return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-2xl skeleton" />)}
    </div>
  );

  if (items.length === 0) return (
    <div className="text-center py-16 rounded-2xl border-2 border-dashed"
      style={{ borderColor: "var(--border)" }}>
      <div className="text-4xl mb-4">♡</div>
      <h3 className="font-display text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
        No favourites yet
      </h3>
      <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
        Save words and phrases you like by clicking the heart button on any entry.
      </p>
    </div>
  );

  return (
    <div>
      <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
        {total} saved {total === 1 ? "entry" : "entries"}
      </p>
      <div className="space-y-3">
        {items.map(item => (
          <Link key={item.entryId}
            href={item.slug ? `/${item.entryType === "Word" ? "words" : "phrases"}/${item.slug}` : "#"}
            className="block p-5 rounded-2xl border card-hover"
            style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded"
                    style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}>
                    {item.entryType === "Word" ? "W" : "P"}
                  </span>
                  <p className="font-display font-semibold italic"
                    style={{ color: "var(--text-primary)" }}>
                    {item.entryType === "Phrase"
                      ? `"${item.entryPreview}"`
                      : item.entryPreview}
                  </p>
                  {item.partOfSpeech && (
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {item.partOfSpeech}
                    </span>
                  )}
                </div>
                {item.firstMeaning && (
                  <p className="text-sm line-clamp-1" style={{ color: "var(--text-secondary)" }}>
                    {item.firstMeaning}
                  </p>
                )}
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: "var(--text-muted)" }}>
                {new Date(item.savedAt).toLocaleDateString("en-LR", { month: "short", day: "numeric" })}
              </span>
            </div>
          </Link>
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onPage={setPage} />
    </div>
  );
}
