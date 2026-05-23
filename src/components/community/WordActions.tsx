"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  getEntryContext, toggleFavourite, voteDefinition,
  reportEntry, suggestEdit,
  type EntryContext
} from "@/lib/community-api";

interface WordActionsProps {
  entryId: string;
  entryType: "Word" | "Phrase";
  slug: string;
  fields: { label: string; value: string }[];
  definitions: { id: string; definition?: string; meaning?: string }[];
}

const REPORT_REASONS = [
  { value: "Offensive", label: "Offensive content" },
  { value: "IncorrectMeaning", label: "Incorrect meaning" },
  { value: "Spam", label: "Spam" },
  { value: "Other", label: "Other" },
];

export function WordActions({ entryId, entryType, slug, fields, definitions }: WordActionsProps) {
  const { user, accessToken, isAuthenticated } = useAuth();
  const router = useRouter();

  const [context, setContext] = useState<EntryContext | null>(null);
  const [votes, setVotes] = useState<Record<string, { count: number; voted: boolean }>>({});
  const [isFavourited, setIsFavourited] = useState(false);
  const [hasReported, setHasReported] = useState(false);

  // Modals
  const [showSuggest, setShowSuggest] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Suggest edit form
  const [suggestField, setSuggestField] = useState(fields[0]?.label ?? "");
  const [suggestCurrent, setSuggestCurrent] = useState(fields[0]?.value ?? "");
  const [suggestValue, setSuggestValue] = useState("");
  const [suggestNotes, setSuggestNotes] = useState("");
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestSuccess, setSuggestSuccess] = useState(false);

  // Report form
  const [reportReason, setReportReason] = useState("IncorrectMeaning");
  const [reportNotes, setReportNotes] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    getEntryContext(entryType, entryId, accessToken ?? undefined)
      .then(ctx => {
        setContext(ctx);
        setIsFavourited(ctx.isFavourited);
        setHasReported(ctx.hasReported);
        const voteMap: Record<string, { count: number; voted: boolean }> = {};
        ctx.definitionVotes.forEach(v => {
          voteMap[v.definitionId] = { count: v.voteCount, voted: v.userHasVoted };
        });
        setVotes(voteMap);
      })
      .catch(() => {});
  }, [entryId, entryType, accessToken]);

  function requireAuth(action: () => void) {
    if (!isAuthenticated) {
      router.push(`/auth/login?from=/${entryType === "Word" ? "words" : "phrases"}/${slug}`);
      return;
    }
    action();
  }

  async function handleFavourite() {
    requireAuth(async () => {
      try {
        const result = await toggleFavourite(accessToken!, entryId, entryType);
        setIsFavourited(result);
      } catch {}
    });
  }

  async function handleVote(definitionId: string) {
    requireAuth(async () => {
      try {
        const result = await voteDefinition(accessToken!, definitionId);
        setVotes(prev => ({
          ...prev,
          [definitionId]: { count: result.totalVotes, voted: result.voted },
        }));
      } catch {}
    });
  }

  async function handleSuggest(e: React.FormEvent) {
    e.preventDefault();
    if (!suggestValue.trim()) return;
    setSuggestLoading(true);
    try {
      await suggestEdit(accessToken!, {
        entryId, entryType,
        field: suggestField,
        currentValue: suggestCurrent,
        suggestedValue: suggestValue.trim(),
        notes: suggestNotes.trim() || undefined,
      });
      setSuggestSuccess(true);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSuggestLoading(false);
    }
  }

  async function handleReport(e: React.FormEvent) {
    e.preventDefault();
    setReportLoading(true);
    try {
      await reportEntry(accessToken!, {
        entryId, entryType,
        reason: reportReason,
        notes: reportNotes.trim() || undefined,
      });
      setReportSuccess(true);
      setHasReported(true);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setReportLoading(false);
    }
  }

  function onSuggestFieldChange(label: string) {
    setSuggestField(label);
    const field = fields.find(f => f.label === label);
    setSuggestCurrent(field?.value ?? "");
    setSuggestValue("");
  }

  return (
    <>
      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-3 py-4 border-t border-b my-8"
        style={{ borderColor: "var(--border)" }}>

        {/* Favourite */}
        <button onClick={handleFavourite}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: isFavourited ? "color-mix(in srgb, #BF0A30 10%, transparent)" : "var(--bg-secondary)",
            color: isFavourited ? "#BF0A30" : "var(--text-secondary)",
            border: `1px solid ${isFavourited ? "color-mix(in srgb, #BF0A30 30%, transparent)" : "var(--border)"}`,
          }}>
          {isFavourited ? "♥" : "♡"} {isFavourited ? "Saved" : "Save"}
        </button>

        {/* Suggest edit */}
        <button onClick={() => requireAuth(() => setShowSuggest(true))}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
          ✏️ Suggest edit
        </button>

        {/* Report */}
        <button
          onClick={() => requireAuth(() => !hasReported && setShowReport(true))}
          disabled={hasReported}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          style={{ background: "transparent", color: "var(--text-muted)", border: "1px solid transparent" }}>
          🚩 {hasReported ? "Reported" : "Report"}
        </button>
      </div>

      {/* Definition votes */}
      {definitions.length > 0 && Object.keys(votes).length > 0 && (
        <div className="space-y-2 mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--text-muted)" }}>
            Was this helpful?
          </p>
          {definitions.map(def => {
            const v = votes[def.id];
            if (!v) return null;
            return (
              <div key={def.id} className="flex items-center gap-3">
                <button onClick={() => handleVote(def.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all"
                  style={{
                    background: v.voted ? "color-mix(in srgb, #3B6D11 12%, transparent)" : "var(--bg-secondary)",
                    color: v.voted ? "#3B6D11" : "var(--text-muted)",
                    border: `1px solid ${v.voted ? "color-mix(in srgb, #3B6D11 30%, transparent)" : "var(--border)"}`,
                  }}>
                  👍 {v.count > 0 ? v.count : ""} {v.voted ? "Helpful" : "Mark as helpful"}
                </button>
                <span className="text-xs italic line-clamp-1 flex-1" style={{ color: "var(--text-muted)" }}>
                  {def.definition ?? def.meaning}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Suggest Edit Modal */}
      {showSuggest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={e => { if (e.target === e.currentTarget) { setShowSuggest(false); setSuggestSuccess(false); } }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
            style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                Suggest an edit
              </h2>
              <button onClick={() => { setShowSuggest(false); setSuggestSuccess(false); }}
                style={{ color: "var(--text-muted)" }}>×</button>
            </div>

            {suggestSuccess ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-medium mb-1" style={{ color: "var(--text-primary)" }}>Suggestion submitted!</p>
                <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                  Our team will review your suggestion.
                </p>
                <button onClick={() => { setShowSuggest(false); setSuggestSuccess(false); setSuggestValue(""); setSuggestNotes(""); }}
                  className="px-5 py-2 rounded-xl text-sm font-medium text-white"
                  style={{ background: "var(--accent)" }}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSuggest} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                    Field to edit
                  </label>
                  <select value={suggestField} onChange={e => onSuggestFieldChange(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border text-sm outline-none"
                    style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
                    {fields.map(f => <option key={f.label} value={f.label}>{f.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                    Current value
                  </label>
                  <div className="w-full px-3 py-2 rounded-lg border text-sm"
                    style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-muted)" }}>
                    {suggestCurrent || "—"}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                    Suggested value <span style={{ color: "#BF0A30" }}>*</span>
                  </label>
                  <textarea value={suggestValue} onChange={e => setSuggestValue(e.target.value)}
                    rows={3} required placeholder="Enter your suggested correction..."
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
                    style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                    Notes (optional)
                  </label>
                  <input value={suggestNotes} onChange={e => setSuggestNotes(e.target.value)}
                    placeholder="Why are you suggesting this change?"
                    className="w-full h-10 px-3 rounded-lg border text-sm outline-none"
                    style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={suggestLoading || !suggestValue.trim()}
                    className="flex-1 h-10 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                    style={{ background: "var(--accent)" }}>
                    {suggestLoading ? "Submitting..." : "Submit suggestion"}
                  </button>
                  <button type="button" onClick={() => setShowSuggest(false)}
                    className="h-10 px-4 rounded-xl text-sm font-medium"
                    style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={e => { if (e.target === e.currentTarget) { setShowReport(false); setReportSuccess(false); } }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
            style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                Report this {entryType.toLowerCase()}
              </h2>
              <button onClick={() => { setShowReport(false); setReportSuccess(false); }}
                style={{ color: "var(--text-muted)" }}>×</button>
            </div>

            {reportSuccess ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-medium mb-1" style={{ color: "var(--text-primary)" }}>Report submitted</p>
                <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                  Thank you. Our team will review this report.
                </p>
                <button onClick={() => { setShowReport(false); setReportSuccess(false); }}
                  className="px-5 py-2 rounded-xl text-sm font-medium text-white"
                  style={{ background: "var(--accent)" }}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleReport} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
                    Reason <span style={{ color: "#BF0A30" }}>*</span>
                  </label>
                  <div className="space-y-2">
                    {REPORT_REASONS.map(r => (
                      <label key={r.value} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-all"
                        style={{
                          background: reportReason === r.value ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "var(--bg-secondary)",
                          border: `1px solid ${reportReason === r.value ? "var(--accent)" : "var(--border)"}`,
                        }}>
                        <input type="radio" name="reason" value={r.value}
                          checked={reportReason === r.value}
                          onChange={() => setReportReason(r.value)}
                          className="accent-blue-600" />
                        <span className="text-sm" style={{ color: "var(--text-primary)" }}>{r.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-muted)" }}>
                    Additional notes (optional)
                  </label>
                  <textarea value={reportNotes} onChange={e => setReportNotes(e.target.value)}
                    rows={3} placeholder="Provide more context..."
                    className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
                    style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={reportLoading}
                    className="flex-1 h-10 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                    style={{ background: "#BF0A30" }}>
                    {reportLoading ? "Submitting..." : "Submit report"}
                  </button>
                  <button type="button" onClick={() => setShowReport(false)}
                    className="h-10 px-4 rounded-xl text-sm font-medium"
                    style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
