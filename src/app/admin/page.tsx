"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getAdminStats, type AdminStats } from "@/lib/admin-api";

export default function AdminOverview() {
  const { accessToken } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    getAdminStats(accessToken)
      .then(setStats)
      .finally(() => setLoading(false));
  }, [accessToken]);

  const statCards = stats ? [
    { label: "Pending Review", value: stats.pendingReview, color: "#BA7517", href: "/admin/submissions?status=PendingReview" },
    { label: "Total Words", value: stats.totalWords, color: "var(--accent)", href: "/admin/submissions?entryType=Word" },
    { label: "Total Phrases", value: stats.totalPhrases, color: "var(--accent)", href: "/admin/submissions?entryType=Phrase" },
    { label: "Approved", value: stats.approvedTotal, color: "#3B6D11", href: "/admin/submissions?status=Approved" },
    { label: "Rejected", value: stats.rejectedTotal, color: "#BF0A30", href: "/admin/submissions?status=Rejected" },
    { label: "Total Users", value: stats.totalUsers, color: "var(--text-secondary)", href: "/admin/users" },
  ] : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          Overview
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Koloqwa Dictionary moderation dashboard</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-24 rounded-2xl skeleton" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {statCards.map(card => (
            <Link key={card.label} href={card.href}
              className="p-5 rounded-2xl border card-hover"
              style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
              <p className="font-display text-3xl font-bold mb-1" style={{ color: card.color }}>
                {card.value}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{card.label}</p>
            </Link>
          ))}
        </div>
      )}

      {stats && stats.pendingReview > 0 && (
        <div className="p-5 rounded-2xl border"
          style={{ borderColor: "color-mix(in srgb, #BA7517 30%, transparent)", background: "color-mix(in srgb, #EF9F27 8%, transparent)" }}>
          <p className="text-sm font-medium mb-1" style={{ color: "#BA7517" }}>
            {stats.pendingReview} submission{stats.pendingReview !== 1 ? "s" : ""} awaiting review
          </p>
          <Link href="/admin/submissions?status=PendingReview"
            className="text-sm font-medium" style={{ color: "#BA7517" }}>
            Review now →
          </Link>
        </div>
      )}
    </div>
  );
}
