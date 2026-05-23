"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:62971/api/v1";

export function VerificationBanner() {
  const { user, accessToken, isAuthenticated } = useAuth();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!isAuthenticated || user?.emailVerified || dismissed) return null;

  async function handleResend() {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/auth/resend-verification`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      });
      setSent(true);
    } catch {}
    finally { setLoading(false); }
  }

  return (
    <div className="px-4 py-3 flex items-center justify-between gap-4 flex-wrap"
      style={{ background: "color-mix(in srgb, #BA7517 15%, transparent)", borderBottom: "1px solid color-mix(in srgb, #BA7517 30%, transparent)" }}>
      <div className="flex items-center gap-2">
        <span>⚠️</span>
        <p className="text-sm font-medium" style={{ color: "#7A4D0A" }}>
          {sent
            ? "Verification email sent! Check your inbox."
            : "Please verify your email address to submit words and phrases."}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {!sent && (
          <button onClick={handleResend} disabled={loading}
            className="text-xs px-3 py-1.5 rounded-lg font-medium disabled:opacity-50"
            style={{ background: "#BA7517", color: "white" }}>
            {loading ? "Sending..." : "Resend email"}
          </button>
        )}
        <button onClick={() => setDismissed(true)}
          className="text-xs px-2 py-1.5 rounded-lg"
          style={{ color: "#BA7517" }}>
          ✕
        </button>
      </div>
    </div>
  );
}
