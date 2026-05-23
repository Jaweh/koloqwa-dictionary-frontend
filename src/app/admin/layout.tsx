"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/admin",             label: "Overview",    icon: "📊", superAdminOnly: false },
  { href: "/admin/submissions", label: "Submissions", icon: "📝", superAdminOnly: false },
  { href: "/admin/reports",     label: "Reports",     icon: "🚩", superAdminOnly: false },
  { href: "/admin/suggestions", label: "Suggestions", icon: "✏️", superAdminOnly: false },
  { href: "/admin/users",       label: "Users",       icon: "👥", superAdminOnly: true  },
  { href: "/admin/analytics",   label: "Analytics",   icon: "📈", superAdminOnly: true  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isSuperAdmin = user?.role === "SuperAdmin";
  const visibleNav = NAV.filter(item => !item.superAdminOnly || isSuperAdmin);
  const currentPage = visibleNav.find(item =>
    pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
  );

  return (
    <AdminRoute>
      <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>

        {/* Admin top bar */}
        <div className="border-b px-4 sm:px-6 py-3 flex items-center justify-between"
          style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              ← Back to site
            </Link>
            <span style={{ color: "var(--border)" }}>|</span>
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Koloqwa Admin
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: "color-mix(in srgb, var(--accent) 15%, transparent)", color: "var(--accent)" }}>
              {user?.role}
            </span>
          </div>
          <span className="text-xs hidden sm:block" style={{ color: "var(--text-muted)" }}>{user?.email}</span>
        </div>

        {/* Mobile nav dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b px-4 py-3 space-y-1"
            style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
            {visibleNav.map(({ href, label, icon }) => {
              const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
              return (
                <Link key={href} href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: active ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent",
                    color: active ? "var(--accent)" : "var(--text-secondary)",
                  }}>
                  <span>{icon}</span>
                  {label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Mobile current page indicator */}
        <div className="md:hidden px-4 py-2 border-b flex items-center justify-between"
          style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--accent)" }}>
            <span>{currentPage?.icon}</span>
            <span>{currentPage?.label}</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(v => !v)}
            className="text-xs px-2.5 py-1 rounded-lg"
            style={{ color: "var(--text-muted)", background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
            {mobileMenuOpen ? "✕ Close" : "☰ Menu"}
          </button>
        </div>

        <div className="flex">
          {/* Desktop sidebar */}
          <aside className="w-48 min-h-screen border-r p-4 flex-shrink-0 hidden md:block"
            style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
            <nav className="space-y-1">
              {visibleNav.map(({ href, label, icon }) => {
                const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
                return (
                  <Link key={href} href={href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: active ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent",
                      color: active ? "var(--accent)" : "var(--text-secondary)",
                    }}>
                    <span>{icon}</span>
                    {label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-4 sm:p-6 min-w-0">{children}</main>
        </div>
      </div>
    </AdminRoute>
  );
}