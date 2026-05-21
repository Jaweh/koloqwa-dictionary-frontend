"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getAdminSubmissions, reviewSubmission, deleteSubmission,
  editWordEntry, editPhraseEntry, getSubmissionDetail,
  type AdminSubmission
} from "@/lib/admin-api";
import { Pagination } from "@/components/ui/Pagination";
import type { PagedResult } from "@/lib/admin-api";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  PendingReview: { bg: "color-mix(in srgb, #EF9F27 12%, transparent)", color: "#BA7517", label: "Pending" },
  Approved:      { bg: "color-mix(in srgb, #639922 12%, transparent)", color: "#3B6D11", label: "Approved" },
  Rejected:      { bg: "color-mix(in srgb, #BF0A30 12%, transparent)", color: "#BF0A30", label: "Rejected" },
};

interface EditState {
  headword?: string; definition?: string; usageNote?: string; pronunciation?: string;
  phraseText?: string; meaning?: string; contextNote?: string; literalMeaning?: string;
}

export default function AdminSubmissions() {
  const { accessToken } = useAuth();
  const searchParams = useSearchParams();

  const [data, setData] = useState<PagedResult<AdminSubmission> | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? "");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("entryType") ?? "");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AdminSubmission | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editState, setEditState] = useState<EditState>({});

  const load = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const result = await getAdminSubmissions(accessToken, {
        status: statusFilter || undefined,
        entryType: typeFilter || undefined,
        search: search || undefined,
        page,
      });
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [accessToken, statusFilter, typeFilter, search, page]);

  useEffect(() => { load(); }, [load]);

  async function handleReview(action: "Approve" | "Reject") {
    if (!selected || !accessToken) return;
    setActionLoading(true);
    try {
      await reviewSubmission(accessToken, selected.id, action, adminNote || undefined);
      setSelected(null);
      setAdminNote("");
      await load();
    } catch (e) { alert((e as Error).message); }
    finally { setActionLoading(false); }
  }

  async function handleDelete() {
    if (!selected || !accessToken) return;
    if (!confirm(`Permanently delete "${selected.entryPreview}"? This cannot be undone.`)) return;
    setActionLoading(true);
    try {
      await deleteSubmission(accessToken, selected.id);
      setSelected(null);
      await load();
    } catch (e) { alert((e as Error).message); }
    finally { setActionLoading(false); }
  }

  async function handleEdit() {
    if (!selected || !accessToken) return;
    setActionLoading(true);
    try {
      if (selected.entryType === "Word") {
        await editWordEntry(accessToken, selected.entryId, {
          headword: editState.headword || undefined,
          definition: editState.definition || undefined,
          usageNote: editState.usageNote || undefined,
          pronunciation: editState.pronunciation || undefined,
        });
      } else {
        await editPhraseEntry(accessToken, selected.entryId, {
          phraseText: editState.phraseText || undefined,
          meaning: editState.meaning || undefined,
          contextNote: editState.contextNote || undefined,
          literalMeaning: editState.literalMeaning || undefined,
        });
      }
      setEditMode(false);
      await load();
    } catch (e) { alert((e as Error).message); }
    finally { setActionLoading(false); }
  }

  async function openReview(item: AdminSubmission) {
    setSelected(item);
    setAdminNote(item.adminNote ?? "");
    setEditMode(false);

    // Fetch full entry details to pre-populate edit fields
    try {
      const detail = await getSubmissionDetail(accessToken!, item.id);
      setEditState({
        headword: (detail.headword as string) ?? item.entryPreview,
        pronunciation: (detail.pronunciation as string) ?? "",
        definition: (detail.definition as string) ?? "",
        usageNote: (detail.usageNote as string) ?? "",
        phraseText: (detail.phraseText as string) ?? item.entryPreview,
        literalMeaning: (detail.literalMeaning as string) ?? "",
        meaning: (detail.meaning as string) ?? "",
        contextNote: (detail.contextNote as string) ?? "",
      });
    } catch {
      setEditState({
        headword: item.entryPreview,
        phraseText: item.entryPreview,
      });
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          Submissions
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {data?.totalCount ?? 0} total submissions
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search submissions..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="h-9 px-3 rounded-lg border text-sm outline-none"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)", minWidth: "200px" }}
        />
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-9 px-3 rounded-lg border text-sm outline-none"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
          <option value="">All statuses</option>
          <option value="PendingReview">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
          className="h-9 px-3 rounded-lg border text-sm outline-none"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
          <option value="">All types</option>
          <option value="Word">Words</option>
          <option value="Phrase">Phrases</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => <div key={i} className="h-14 rounded-xl skeleton" />)}
        </div>
      ) : data?.items.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed"
          style={{ borderColor: "var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No submissions found</p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
                  {["Entry", "Type", "Category", "Submitted by", "Date", "Status", ""].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.items.map((item, i) => {
                  const s = STATUS_STYLES[item.status] ?? STATUS_STYLES.PendingReview;
                  return (
                    <tr key={item.id}
                      style={{ borderBottom: i < data.items.length - 1 ? "1px solid var(--border)" : "none", background: "var(--bg-primary)" }}>
                      <td className="px-4 py-3">
                        <span className="font-display italic font-medium" style={{ color: "var(--text-primary)" }}>
                          &ldquo;{item.entryPreview}&rdquo;
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded font-mono"
                          style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}>
                          {item.entryType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                        {item.category}{item.languageName ? ` · ${item.languageName}` : ""}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{item.submitterName}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.submitterEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                        {new Date(item.submittedAt).toLocaleDateString("en-LR", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: s.bg, color: s.color }}>{s.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => openReview(item)}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                          style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)", color: "var(--accent)" }}>
                          Review
                        </button>
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
          <div className="w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>

            {/* Modal header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                  {selected.entryType} · {selected.category}{selected.languageName ? ` · ${selected.languageName}` : ""}
                </p>
                <h2 className="font-display text-2xl font-semibold italic" style={{ color: "var(--text-primary)" }}>
                  &ldquo;{selected.entryPreview}&rdquo;
                </h2>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  by {selected.submitterName} · {new Date(selected.submittedAt).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-xl leading-none ml-4"
                style={{ color: "var(--text-muted)" }}>×</button>
            </div>

            {/* Status badge */}
            {selected.status !== "PendingReview" && (
              <div className="mb-4 p-3 rounded-xl text-sm"
                style={{
                  background: selected.status === "Approved"
                    ? "color-mix(in srgb, #639922 10%, transparent)"
                    : "color-mix(in srgb, #BF0A30 10%, transparent)",
                  color: selected.status === "Approved" ? "#3B6D11" : "#BF0A30"
                }}>
                {selected.status === "Approved" ? "✓ Approved" : "✗ Rejected"}
                {selected.reviewedByName && ` by ${selected.reviewedByName}`}
                {selected.adminNote && ` — "${selected.adminNote}"`}
              </div>
            )}

            {/* Edit mode */}
            {editMode ? (
              <div className="space-y-3 mb-5">
                {selected.entryType === "Word" ? (
                  <>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Headword</label>
                      <input value={editState.headword ?? ""} onChange={e => setEditState(s => ({ ...s, headword: e.target.value }))}
                        className="w-full h-9 px-3 rounded-lg border text-sm outline-none"
                        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Pronunciation</label>
                      <input value={editState.pronunciation ?? ""} onChange={e => setEditState(s => ({ ...s, pronunciation: e.target.value }))}
                        className="w-full h-9 px-3 rounded-lg border text-sm outline-none"
                        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Definition</label>
                      <textarea value={editState.definition ?? ""} onChange={e => setEditState(s => ({ ...s, definition: e.target.value }))}
                        rows={3} className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
                        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Usage note</label>
                      <input value={editState.usageNote ?? ""} onChange={e => setEditState(s => ({ ...s, usageNote: e.target.value }))}
                        className="w-full h-9 px-3 rounded-lg border text-sm outline-none"
                        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Phrase</label>
                      <input value={editState.phraseText ?? ""} onChange={e => setEditState(s => ({ ...s, phraseText: e.target.value }))}
                        className="w-full h-9 px-3 rounded-lg border text-sm outline-none"
                        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Literal meaning</label>
                      <input value={editState.literalMeaning ?? ""} onChange={e => setEditState(s => ({ ...s, literalMeaning: e.target.value }))}
                        className="w-full h-9 px-3 rounded-lg border text-sm outline-none"
                        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Meaning</label>
                      <textarea value={editState.meaning ?? ""} onChange={e => setEditState(s => ({ ...s, meaning: e.target.value }))}
                        rows={3} className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
                        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Context note</label>
                      <input value={editState.contextNote ?? ""} onChange={e => setEditState(s => ({ ...s, contextNote: e.target.value }))}
                        className="w-full h-9 px-3 rounded-lg border text-sm outline-none"
                        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                    </div>
                  </>
                )}
                <div className="flex gap-2 pt-2">
                  <button onClick={handleEdit} disabled={actionLoading}
                    className="flex-1 h-9 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                    style={{ background: "var(--accent)" }}>
                    {actionLoading ? "Saving..." : "Save changes"}
                  </button>
                  <button onClick={() => setEditMode(false)}
                    className="h-9 px-4 rounded-xl text-sm font-medium"
                    style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Admin note */}
                <div className="mb-4">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                    Admin note (optional)
                  </label>
                  <textarea
                    value={adminNote}
                    onChange={e => setAdminNote(e.target.value)}
                    rows={2}
                    placeholder="Add a note for the submitter..."
                    className="w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none"
                    style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                  />
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {selected.status === "PendingReview" && (
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handleReview("Approve")} disabled={actionLoading}
                        className="h-10 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                        style={{ background: "#3B6D11" }}>
                        {actionLoading ? "..." : "✓ Approve"}
                      </button>
                      <button onClick={() => handleReview("Reject")} disabled={actionLoading}
                        className="h-10 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                        style={{ background: "#BF0A30" }}>
                        {actionLoading ? "..." : "✗ Reject"}
                      </button>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setEditMode(true)}
                      className="h-10 rounded-xl text-sm font-medium"
                      style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                      ✏️ Edit entry
                    </button>
                    <button onClick={handleDelete} disabled={actionLoading}
                      className="h-10 rounded-xl text-sm font-medium disabled:opacity-50"
                      style={{ background: "color-mix(in srgb, #BF0A30 10%, transparent)", color: "#BF0A30", border: "1px solid color-mix(in srgb, #BF0A30 25%, transparent)" }}>
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
