"use client";
import { useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:62971/api/v1";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setSent(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4"
            style={{ background: "var(--accent)" }}>K</div>
          <h1 className="font-display text-3xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            Forgot password
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <div className="p-8 rounded-2xl border" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
          {sent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">📬</div>
              <p className="font-medium mb-2" style={{ color: "var(--text-primary)" }}>Check your inbox</p>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                If an account exists for <span className="font-medium">{email}</span>, you'll receive a reset link shortly.
              </p>
              <Link href="/auth/login"
                className="text-sm font-medium"
                style={{ color: "var(--accent)" }}>
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 p-4 rounded-xl text-sm"
                  style={{ background: "color-mix(in srgb, #BF0A30 10%, transparent)", color: "#BF0A30", border: "1px solid color-mix(in srgb, #BF0A30 25%, transparent)" }}>
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
                    Email address <span style={{ color: "#BF0A30" }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoFocus
                    className="w-full h-11 px-4 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--bg-primary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                  />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full h-11 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                  style={{ background: "var(--accent)" }}>
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
          Remembered it?{" "}
          <Link href="/auth/login" className="font-medium" style={{ color: "var(--accent)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}