"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getAdminReports, reviewReport, type AdminReport } from "@/lib/admin-api";
import { Pagination } from "@/components/ui/Pagination";
import type { PagedResult } from "@/lib/admin-api";

const REASON_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  Offensive:       { label: "Offensive",         color: "#BF0A30", bg: "color-mix(in srgb, #BF0A30 12%, transparent)" },
  IncorrectMeaning:{ label: "Incorrect meaning",  color: "#BA7517", bg: "color-mix(in srgb, #EF9F27 12%, transparent)" },
  Spam:            { label: "Spam",               color: "#5F5E5A", bg: "color-mix(in srgb, #888780 12%, transparent)" },
  Other:           { label: "Other",              color: "#5F5E5A", bg: "color-mix(in srgb, #888780 12%, transparent)" },
};

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  Pending:   { label: "Pending",   color: "#BA7517", bg: "color-mix(in srgb, #EF9F27 12%, transparent)" },
  Reviewed:  { label: "Reviewed",  color: "#3B6D11", bg: "color-mix(in srgb, #639922 12%, transparent)" },
  Dismissed: { label: "Dismissed", color: "#5F5E5A", bg: "color-mix(in srgb, #888780 12%, transparent)" },
};

export default function AdminReports() {
  const { accessToken } = useAuth();
  const [data, setData] = useState<PagedResult<AdminReport> | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [reasonFilter, setReasonFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AdminReport | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const result = await getAdminReports(accessToken, {
        status: statusFilter || undefined,
        reason: reasonFilter || undefined,
        page,
      });
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [accessToken, statusFilter, reasonFilter, page]);

  useEffect(() => { load(); }, [load]);

  async function handleAction(action: "Dismiss" | "Delete") {
    if (!selected || !accessToken) return;
    if (action === "Delete" && !confirm(`Permanently delete "${selected.entryPreview}"? This cannot be undone.`)) return;
    setActionLoading(true);
    try {
      await reviewReport(accessToken, selected.id, action);
      setSelected(null);
      await load();
    } catch (e) { alert((e as Error).message); }
    finally { setActionLoading(false); }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          Reports
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {data?.totalCount ?? 0} total reports
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-9 px-3 rounded-lg border text-sm outline-none"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Dismissed">Dismissed</option>
        </select>
        <select value={reasonFilter} onChange={e => { setReasonFilter(e.target.value); setPage(1); }}
          className="h-9 px-3 rounded-lg border text-sm outline-none"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
          <option value="">All reasons</option>
          <option value="Offensive">Offensive</option>
          <option value="IncorrectMeaning">Incorrect meaning</option>
          <option value="Spam">Spam</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => <div key={i} className="h-14 rounded-xl skeleton" />)}
        </div>
      ) : data?.items.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed" style={{ borderColor: "var(--border)" }}>
          <div className="text-4xl mb-3">✅</div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No reports found</p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
                  {["Entry", "Type", "Reason", "Reported by", "Date", "Status", ""].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.items.map((item, i) => {
                  const reason = REASON_LABELS[item.reason] ?? REASON_LABELS.Other;
                  const status = STATUS_STYLES[item.status] ?? STATUS_STYLES.Pending;
                  return (
                    <tr key={item.id}
                      style={{ borderBottom: i < data.items.length - 1 ? "1px solid var(--border)" : "none", background: "var(--bg-primary)" }}>
                      <td className="px-4 py-3">
                        <span className="font-display italic font-medium" style={{ color: "var(--text-primary)" }}>
                          &ldquo;{item.entryPreview}&rdquo;
                        </span>
                        {item.entrySlug && (
                          <Link href={`/${item.entryType === "Word" ? "words" : "phrases"}/${item.entrySlug}`}
                            target="_blank"
                            className="block text-xs mt-0.5 hover:underline"
                            style={{ color: "var(--accent)" }}>
                            View →
                          </Link>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded font-mono"
                          style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}>
                          {item.entryType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: reason.bg, color: reason.color }}>
                          {reason.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{item.reporterName}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.reporterEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                        {new Date(item.reportedAt).toLocaleDateString("en-LR", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: status.bg, color: status.color }}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {item.status === "Pending" && (
                          <button onClick={() => setSelected(item)}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium"
                            style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)" }}>
                            Review
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={data?.totalPages ?? 1} onPage={setPage} />
        </>
      )}

      {/* Review Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
            style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                  {selected.entryType} Report
                </p>
                <h2 className="font-display text-xl font-semibold italic" style={{ color: "var(--text-primary)" }}>
                  &ldquo;{selected.entryPreview}&rdquo;
                </h2>
              </div>
              <button onClick={() => setSelected(null)} style={{ color: "var(--text-muted)" }}>×</button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-3 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Reason</p>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {REASON_LABELS[selected.reason]?.label ?? selected.reason}
                </p>
              </div>
              {selected.notes && (
                <div className="p-3 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
                  <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Reporter notes</p>
                  <p className="text-sm italic" style={{ color: "var(--text-secondary)" }}>{selected.notes}</p>
                </div>
              )}
              <div className="p-3 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Reported by</p>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  {selected.reporterName} · {selected.reporterEmail}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <button onClick={() => handleAction("Dismiss")} disabled={actionLoading}
                className="w-full h-10 rounded-xl text-sm font-medium disabled:opacity-50"
                style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                {actionLoading ? "..." : "Dismiss report — entry is fine"}
              </button>
              <button onClick={() => handleAction("Delete")} disabled={actionLoading}
                className="w-full h-10 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                style={{ background: "#BF0A30" }}>
                {actionLoading ? "..." : "🗑 Delete entry — report is valid"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
