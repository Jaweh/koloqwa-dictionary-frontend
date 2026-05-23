"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getMySubmissions, cancelSubmission } from "@/lib/auth-api";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Pagination } from "@/components/ui/Pagination";
import type { SubmissionItem } from "@/types/auth";
import type { PagedResult } from "@/types/dictionary";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  PendingReview: { bg: "color-mix(in srgb, #EF9F27 12%, transparent)", color: "#BA7517", label: "Under Review" },
  Approved:      { bg: "color-mix(in srgb, #639922 12%, transparent)", color: "#3B6D11", label: "Published" },
  Rejected:      { bg: "color-mix(in srgb, #BF0A30 12%, transparent)", color: "#BF0A30", label: "Rejected" },
  Draft:         { bg: "color-mix(in srgb, #888780 12%, transparent)", color: "#5F5E5A", label: "Draft" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.Draft;
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function ConfirmDialog({
  message, onConfirm, onCancel, loading,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
        <div className="text-2xl mb-4 text-center">⚠️</div>
        <p className="text-sm font-medium text-center mb-6" style={{ color: "var(--text-primary)" }}>
          {message}
        </p>
        <div className="flex gap-3">
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 h-10 rounded-xl text-sm font-medium text-white disabled:opacity-50"
            style={{ background: "#BF0A30" }}>
            {loading ? "Cancelling..." : "Yes, cancel it"}
          </button>
          <button onClick={onCancel} disabled={loading}
            className="flex-1 h-10 rounded-xl text-sm font-medium"
            style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
            Keep it
          </button>
        </div>
      </div>
    </div>
  );
}

export function DashboardClient() {
  const { user, accessToken } = useAuth();
  const [data, setData] = useState<PagedResult<SubmissionItem> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    getMySubmissions(accessToken, page)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [accessToken, page]);

  async function handleCancel(id: string) {
    setCancelling(id);
    try {
      await cancelSubmission(id, accessToken!);
      setData(prev => prev ? {
        ...prev,
        items: prev.items.filter(i => i.id !== id),
        totalCount: prev.totalCount - 1,
      } : prev);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setCancelling(null);
      setPendingCancelId(null);
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display text-4xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              My contributions
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Welcome back, {user?.displayName}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/submit/word"
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: "var(--accent)" }}>
              + Submit word
            </Link>
            <Link href="/submit/phrase"
              className="px-5 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
              + Submit phrase
            </Link>
          </div>
        </div>

        {/* Stats row */}
        {data && (
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: "Total submitted", value: data.totalCount },
              { label: "Published", value: data.items.filter(i => i.status === "Approved").length },
              { label: "Under review", value: data.items.filter(i => i.status === "PendingReview").length },
            ].map(stat => (
              <div key={stat.label} className="p-5 rounded-2xl text-center"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                <p className="font-display text-3xl font-bold mb-1" style={{ color: "var(--accent)" }}>
                  {stat.value}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Submissions list */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-6"
            style={{ color: "var(--text-muted)" }}>Submission history</h2>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 rounded-2xl skeleton" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{error}</p>
            </div>
          ) : data?.items.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border-2 border-dashed"
              style={{ borderColor: "var(--border)" }}>
              <div className="text-4xl mb-4">✍️</div>
              <h3 className="font-display text-xl font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}>No submissions yet</h3>
              <p className="text-sm max-w-sm mx-auto mb-6" style={{ color: "var(--text-muted)" }}>
                You haven&apos;t submitted any words or phrases yet. Be the first to contribute!
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/submit/word"
                  className="px-6 py-2.5 rounded-xl text-sm font-medium text-white"
                  style={{ background: "var(--accent)" }}>
                  Submit a word
                </Link>
                <Link href="/submit/phrase"
                  className="px-6 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                  Submit a phrase
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {data?.items.map(item => (
                  <div key={item.id} className="p-5 rounded-2xl border flex items-start justify-between gap-4"
                    style={{ borderColor: "var(--border)", background: "var(--bg-primary)" }}>
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono font-medium"
                        style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}>
                        {item.entryType === "Word" ? "W" : "P"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-display font-semibold italic truncate"
                          style={{ color: "var(--text-primary)" }}>
                          &ldquo;{item.entryPreview}&rdquo;
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {item.entryType} · Submitted {new Date(item.submittedAt).toLocaleDateString("en-LR", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                        {item.adminNote && (
                          <p className="text-xs mt-1.5 italic" style={{ color: "var(--text-secondary)" }}>
                            Note: {item.adminNote}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <StatusBadge status={item.status} />
                      {item.status === "PendingReview" && (
                        <button
                          onClick={() => setPendingCancelId(item.id)}
                          disabled={cancelling === item.id}
                          className="text-xs px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
                          style={{ color: "var(--text-muted)", border: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
                          {cancelling === item.id ? "Cancelling..." : "Cancel"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Pagination page={page} totalPages={data?.totalPages ?? 1} onPage={setPage} />
            </>
          )}
        </div>
      </div>

      {pendingCancelId && (
        <ConfirmDialog
          message="Cancel this submission? The word or phrase will be permanently removed."
          onConfirm={() => handleCancel(pendingCancelId)}
          onCancel={() => setPendingCancelId(null)}
          loading={cancelling === pendingCancelId}
        />
      )}
    </ProtectedRoute>
  );
}