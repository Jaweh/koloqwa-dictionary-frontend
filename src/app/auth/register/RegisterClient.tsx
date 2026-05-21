"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { register } from "@/lib/auth-api";
import { FormField, Input, Button } from "@/components/ui/FormField";

interface Errors {
  email?: string;
  password?: string;
  displayName?: string;
  general?: string;
}

function validate(email: string, password: string, displayName: string): Errors {
  const errors: Errors = {};
  if (!displayName.trim()) errors.displayName = "Display name is required.";
  else if (displayName.trim().length < 2) errors.displayName = "Must be at least 2 characters.";
  if (!email.trim()) errors.email = "Email is required.";
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Password is required.";
  else if (password.length < 8) errors.password = "Password must be at least 8 characters.";
  else if (!/[A-Z]/.test(password)) errors.password = "Password must contain an uppercase letter.";
  else if (!/[0-9]/.test(password)) errors.password = "Password must contain a number.";
  return errors;
}

export function RegisterClient() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(email, password, displayName);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const tokens = await register({ email, password, displayName });
      authLogin(tokens);
      router.push("/dashboard");
    } catch (err) {
      setErrors({ general: (err as Error).message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo mark */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4"
            style={{ background: "var(--accent)" }}>K</div>
          <h1 className="font-display text-3xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            Join Koloqwa
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Create an account to contribute words and phrases
          </p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl border" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
          {errors.general && (
            <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: "color-mix(in srgb, #BF0A30 10%, transparent)", color: "#BF0A30", border: "1px solid color-mix(in srgb, #BF0A30 25%, transparent)" }}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField label="Display name" error={errors.displayName} required>
              <Input
                type="text"
                placeholder="How you'll appear on contributions"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                error={!!errors.displayName}
                autoComplete="name"
              />
            </FormField>

            <FormField label="Email address" error={errors.email} required>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                error={!!errors.email}
                autoComplete="email"
              />
            </FormField>

            <FormField label="Password" error={errors.password} required
              hint="At least 8 characters, one uppercase letter, one number">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  error={!!errors.password}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: "var(--text-muted)" }}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </FormField>

            <Button type="submit" loading={loading} fullWidth>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium" style={{ color: "var(--accent)" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
