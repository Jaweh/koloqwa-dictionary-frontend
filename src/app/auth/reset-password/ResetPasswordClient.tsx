"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:62971/api/v1";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) { setError("Please enter a new password."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!/[A-Z]/.test(password)) { setError("Password must contain an uppercase letter."); return; }
    if (!/[0-9]/.test(password)) { setError("Password must contain a number."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="font-display text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            Invalid reset link
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            This reset link is missing or invalid.
          </p>
          <Link href="/auth/forgot-password" className="text-sm font-medium" style={{ color: "var(--accent)" }}>
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4"
            style={{ background: "var(--accent)" }}>K</div>
          <h1 className="font-display text-3xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            Reset password
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Choose a new password for your account
          </p>
        </div>
        <div className="p-8 rounded-2xl border" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
          {success ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">✅</div>
              <p className="font-medium mb-2" style={{ color: "var(--text-primary)" }}>Password reset!</p>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                Your password has been updated. Redirecting you to sign in...
              </p>
              <Link href="/auth/login" className="text-sm font-medium" style={{ color: "var(--accent)" }}>
                Sign in now
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
                    New password <span style={{ color: "#BF0A30" }}>*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      autoFocus
                      className="w-full h-11 px-4 rounded-xl border text-sm outline-none"
                      style={{ background: "var(--bg-primary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                      style={{ color: "var(--text-muted)" }}>
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                    At least 8 characters, one uppercase letter, one number
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
                    Confirm password <span style={{ color: "#BF0A30" }}>*</span>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full h-11 px-4 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--bg-primary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
                  />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full h-11 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                  style={{ background: "var(--accent)" }}>
                  {loading ? "Resetting..." : "Reset password"}
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