"use client";
import Link from "next/link";
import { useThemeContext } from "./ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/words/search", label: "Words" },
  { href: "/phrases/search", label: "Phrases" },
  { href: "/tribes", label: "Tribal Languages", highlight: true },
  { href: "/about", label: "About" },
];

export function Header() {
  const { theme, toggle } = useThemeContext();
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--bg-primary) 90%, transparent)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold transition-transform group-hover:scale-110"
            style={{ background: "var(--accent)" }}>K</div>
          <span className="font-display font-semibold text-lg hidden sm:block"
            style={{ color: "var(--text-primary)" }}>Koloqwa</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ href, label, highlight }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link key={href} href={href}
                className={cn("px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200", active && "font-semibold", highlight && !active && "border")}
                style={{
                  color: active ? "var(--accent)" : highlight ? "var(--accent)" : "var(--text-secondary)",
                  background: active ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent",
                  borderColor: highlight && !active ? "color-mix(in srgb, var(--accent) 30%, transparent)" : "transparent",
                }}>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Contribute button */}
          {isAuthenticated && (
            <Link href="/dashboard"
              className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)" }}>
              + Contribute
            </Link>
          )}

          {/* Theme toggle */}
          <button onClick={toggle} aria-label="Toggle theme"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
            style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
            {theme === "dark" ? (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* Auth buttons or user menu */}
          {isAuthenticated ? (
            <div className="relative hidden md:block">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "var(--accent)" }}>
                  {user?.displayName.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-24 truncate">{user?.displayName}</span>
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border py-1 shadow-lg z-50"
                  style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}>
                  <div className="px-4 py-2 border-b" style={{ borderColor: "var(--border)" }}>
                    <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{user?.displayName}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{user?.email}</p>
                  </div>
                  <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm transition-colors hover:bg-opacity-50"
                    style={{ color: "var(--text-secondary)" }}>
                    My Submissions
                  </Link>
                  <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm transition-colors"
                    style={{ color: "var(--text-secondary)" }}>
                    My Profile
                  </Link>
                  <Link href="/submit/word" onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm transition-colors"
                    style={{ color: "var(--text-secondary)" }}>
                    Submit a Word
                  </Link>
                  <Link href="/submit/phrase" onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm transition-colors"
                    style={{ color: "var(--text-secondary)" }}>
                    Submit a Phrase
                  </Link>
                  {(user?.role === "Admin" || user?.role === "SuperAdmin") && (
                    <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm font-medium transition-colors"
                      style={{ color: "var(--accent)" }}>
                      ⚙️ Admin Dashboard
                    </Link>
                  )}
                  <div className="border-t mt-1 pt-1" style={{ borderColor: "var(--border)" }}>
                    <button onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm transition-colors"
                      style={{ color: "var(--text-muted)" }}>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth/login"
                className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{ color: "var(--text-secondary)" }}>
                Sign in
              </Link>
              <Link href="/auth/register"
                className="px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-all"
                style={{ background: "var(--accent)" }}>
                Join
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button className="md:hidden w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}
            onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? <path d="M6 18L18 6M6 6l12 12"/> : <path d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t py-2 px-4"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)" }}>
          {NAV.map(({ href, label, highlight }) => (
            <Link key={href} href={href}
              className="flex items-center justify-between py-3 text-sm font-medium border-b last:border-0"
              style={{ color: highlight ? "var(--accent)" : "var(--text-secondary)", borderColor: "var(--border)" }}
              onClick={() => setMenuOpen(false)}>
              {label}
              {highlight && (
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "color-mix(in srgb, var(--accent) 15%, transparent)", color: "var(--accent)" }}>
                  New
                </span>
              )}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link href="/dashboard"
                className="block py-3 text-sm font-medium border-b"
                style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}
                onClick={() => setMenuOpen(false)}>
                My Submissions
              </Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="block w-full text-left py-3 text-sm"
                style={{ color: "var(--text-muted)" }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login"
                className="block py-3 text-sm font-medium border-b"
                style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}
                onClick={() => setMenuOpen(false)}>
                Sign in
              </Link>
              <Link href="/auth/register"
                className="block py-3 text-sm font-medium"
                style={{ color: "var(--accent)" }}
                onClick={() => setMenuOpen(false)}>
                Join Koloqwa
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
