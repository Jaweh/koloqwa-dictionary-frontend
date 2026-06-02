"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:62971/api/v1";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found. Please check your email link.");
      return;
    }
    fetch(`${API_BASE}/auth/verify-email?token=${token}`, {
      method: "POST",
    })
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          setStatus("success");
          setMessage(json.message ?? "Email verified successfully!");
          setTimeout(() => router.push("/auth/login"), 3000);
        } else {
          setStatus("error");
          setMessage(json.message ?? "Verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg-primary)" }}>
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ background: "var(--accent)" }}>K</div>
          <span className="font-display text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            Koloqwa
          </span>
        </Link>
        <div className="p-8 rounded-2xl border"
          style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
          {status === "loading" && (
            <>
              <div className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-6"
                style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
              <h1 className="font-display text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                Verifying your email...
              </h1>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Please wait a moment.</p>
            </>
          )}
          {status === "success" && (
            <>
              <div className="text-5xl mb-6">✅</div>
              <h1 className="font-display text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                Email verified!
              </h1>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
                {message} Redirecting you to sign in...
              </p>
              <Link href="/auth/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white"
                style={{ background: "var(--accent)" }}>
                Sign in now
              </Link>
            </>
          )}
          {status === "error" && (
            <>
              <div className="text-5xl mb-6">❌</div>
              <h1 className="font-display text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                Verification failed
              </h1>
              <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>{message}</p>
              <div className="flex gap-3 justify-center">
                <Link href="/auth/login"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-white"
                  style={{ background: "var(--accent)" }}>
                  Sign in
                </Link>
                <Link href="/"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium"
                  style={{ background: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                  Go home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}