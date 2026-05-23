"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface DailyCount { date: string; count: number; }
interface ApprovalRate { total: number; approved: number; rejected: number; pending: number; approvalPercent: number; }
interface Contributor { displayName: string; email: string; count: number; }
interface CategoryBreakdown { category: string; entryType: string; count: number; }
interface TribeBreakdown { languageName: string; languageCode: string; count: number; }
interface ModerationStats { avgHoursToReview: number; reviewedLast7Days: number; reviewedLast30Days: number; }
interface Analytics {
  submissionsOverTime: DailyCount[];
  approvalsOverTime: DailyCount[];
  registrationsOverTime: DailyCount[];
  approvalRate: ApprovalRate;
  topContributors: Contributor[];
  topApproved: Contributor[];
  categoryBreakdown: CategoryBreakdown[];
  tribeBreakdown: TribeBreakdown[];
  moderationStats: ModerationStats;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:62971/api/v1";

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-mono w-8 text-right" style={{ color: "var(--text-muted)" }}>{value}</span>
    </div>
  );
}

function SparkLine({ data, color }: { data: DailyCount[]; color: string }) {
  if (!data.length) return <div className="h-16 flex items-center justify-center text-xs" style={{ color: "var(--text-muted)" }}>No data</div>;
  const max = Math.max(...data.map(d => d.count), 1);
  const w = 300; const h = 60; const pad = 4;
  const pts = data.map((d, i) => {
    const x = pad + (i / Math.max(data.length - 1, 1)) * (w - pad * 2);
    const y = h - pad - (d.count / max) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ height: 60 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => {
        const x = pad + (i / Math.max(data.length - 1, 1)) * (w - pad * 2);
        const y = h - pad - (d.count / max) * (h - pad * 2);
        return d.count > 0 ? <circle key={i} cx={x} cy={y} r="3" fill={color} /> : null;
      })}
    </svg>
  );
}

function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  if (!total) return <div className="h-32 flex items-center justify-center text-xs" style={{ color: "var(--text-muted)" }}>No data</div>;
  let offset = 0;
  const r = 40; const cx = 60; const cy = 60; const stroke = 18;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-6">
      <svg width="120" height="120">
        {segments.map((seg, i) => {
          const dash = (seg.value / total) * circ;
          const el = (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={seg.color} strokeWidth={stroke}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset * circ / total + circ / 4}
              style={{ transition: "stroke-dasharray 0.5s" }} />
          );
          offset += seg.value;
          return el;
        })}
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--text-primary)">{total}</text>
      </svg>
      <div className="space-y-2">
        {segments.map(seg => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{seg.label}</span>
            <span className="text-xs font-mono ml-auto pl-4" style={{ color: "var(--text-muted)" }}>{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-5 rounded-2xl border ${className ?? ""}`}
      style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>{title}</p>
      {children}
    </div>
  );
}

export default function AdminAnalytics() {
  const { accessToken, user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const isSuperAdmin = user?.role === "SuperAdmin";

  // Route-level guard — redirect non-SuperAdmins away
  useEffect(() => {
    if (user && !isSuperAdmin) router.push("/admin");
  }, [user, isSuperAdmin, router]);

  useEffect(() => {
    if (!accessToken || !isSuperAdmin) return;
    setLoading(true);
    fetch(`${API_BASE}/admin/analytics?days=${days}`, {
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" }
    })
      .then(r => r.json())
      .then(j => setData(j.data))
      .finally(() => setLoading(false));
  }, [accessToken, isSuperAdmin, days]);

  if (!isSuperAdmin) return null;

  if (loading) return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Analytics</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => <div key={i} className="h-44 rounded-2xl skeleton" />)}
      </div>
    </div>
  );

  if (!data) return null;

  const { approvalRate, moderationStats } = data;
  const maxContrib = Math.max(...data.topContributors.map(c => c.count), 1);
  const maxApproved = Math.max(...data.topApproved.map(c => c.count), 1);
  const maxTribe = Math.max(...data.tribeBreakdown.map(t => t.count), 1);

  const vernacularWords   = data.categoryBreakdown.find(c => c.category === "Vernacular" && c.entryType === "Word")?.count ?? 0;
  const vernacularPhrases = data.categoryBreakdown.find(c => c.category === "Vernacular" && c.entryType === "Phrase")?.count ?? 0;
  const tribalWords       = data.categoryBreakdown.find(c => c.category === "Tribal"     && c.entryType === "Word")?.count ?? 0;
  const tribalPhrases     = data.categoryBreakdown.find(c => c.category === "Tribal"     && c.entryType === "Phrase")?.count ?? 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Analytics</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Dictionary growth and moderation insights</p>
        </div>
        <select value={days} onChange={e => setDays(Number(e.target.value))}
          className="h-9 px-3 rounded-lg border text-sm outline-none"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      <div className="space-y-4">

        {/* Row 1 — sparklines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Submissions over time">
            <SparkLine data={data.submissionsOverTime} color="var(--accent)" />
            <p className="text-2xl font-bold mt-2" style={{ color: "var(--accent)" }}>
              {data.submissionsOverTime.reduce((s, d) => s + d.count, 0)}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>submissions in last {days} days</p>
          </Card>

          <Card title="Approvals over time">
            <SparkLine data={data.approvalsOverTime} color="#3B6D11" />
            <p className="text-2xl font-bold mt-2" style={{ color: "#3B6D11" }}>
              {data.approvalsOverTime.reduce((s, d) => s + d.count, 0)}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>approvals in last {days} days</p>
          </Card>

          <Card title="New registrations">
            <SparkLine data={data.registrationsOverTime} color="#002868" />
            <p className="text-2xl font-bold mt-2" style={{ color: "var(--accent)" }}>
              {data.registrationsOverTime.reduce((s, d) => s + d.count, 0)}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>new users in last {days} days</p>
          </Card>
        </div>

        {/* Row 2 — approval rate + category + moderation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Approval rate">
            <DonutChart segments={[
              { label: "Approved", value: approvalRate.approved, color: "#3B6D11" },
              { label: "Pending",  value: approvalRate.pending,  color: "#BA7517" },
              { label: "Rejected", value: approvalRate.rejected, color: "#BF0A30" },
            ]} />
            <p className="text-2xl font-bold mt-3" style={{ color: "#3B6D11" }}>{approvalRate.approvalPercent}%</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>of all submissions approved</p>
          </Card>

          <Card title="Content breakdown">
            <DonutChart segments={[
              { label: "Vernacular words",   value: vernacularWords,   color: "var(--accent)" },
              { label: "Vernacular phrases", value: vernacularPhrases, color: "#4472c4" },
              { label: "Tribal words",       value: tribalWords,       color: "#BA7517" },
              { label: "Tribal phrases",     value: tribalPhrases,     color: "#EF9F27" },
            ]} />
          </Card>

          <Card title="Moderation speed">
            <div className="space-y-4">
              <div className="p-4 rounded-xl text-center" style={{ background: "var(--bg-primary)" }}>
                <p className="text-3xl font-bold" style={{ color: "var(--accent)" }}>
                  {moderationStats.avgHoursToReview < 1
                    ? `${Math.round(moderationStats.avgHoursToReview * 60)}m`
                    : `${moderationStats.avgHoursToReview}h`}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>avg. time to review</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl text-center" style={{ background: "var(--bg-primary)" }}>
                  <p className="text-xl font-bold" style={{ color: "#3B6D11" }}>{moderationStats.reviewedLast7Days}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>reviewed (7d)</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ background: "var(--bg-primary)" }}>
                  <p className="text-xl font-bold" style={{ color: "#3B6D11" }}>{moderationStats.reviewedLast30Days}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>reviewed (30d)</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Row 3 — top contributors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Top contributors by submissions">
            {data.topContributors.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>No data yet</p>
            ) : (
              <div className="space-y-3">
                {data.topContributors.map((c, i) => (
                  <div key={c.email}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono w-4" style={{ color: "var(--text-muted)" }}>{i + 1}</span>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{c.displayName}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{c.email}</p>
                      </div>
                    </div>
                    <MiniBar value={c.count} max={maxContrib} color="var(--accent)" />
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Top contributors by approved entries">
            {data.topApproved.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>No approvals yet</p>
            ) : (
              <div className="space-y-3">
                {data.topApproved.map((c, i) => (
                  <div key={c.email}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono w-4" style={{ color: "var(--text-muted)" }}>{i + 1}</span>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{c.displayName}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{c.email}</p>
                      </div>
                    </div>
                    <MiniBar value={c.count} max={maxApproved} color="#3B6D11" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Row 4 — tribe breakdown */}
        <Card title="Tribal language contributions">
          {data.tribeBreakdown.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No tribal submissions yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {data.tribeBreakdown.map(t => (
                <div key={t.languageCode}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{t.languageName}</p>
                  </div>
                  <MiniBar value={t.count} max={maxTribe} color="#BA7517" />
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}