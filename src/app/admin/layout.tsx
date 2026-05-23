"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/admin",             label: "Overview",    icon: "📊" },
  { href: "/admin/submissions", label: "Submissions", icon: "📝" },
  { href: "/admin/reports",     label: "Reports",     icon: "🚩" },
  { href: "/admin/suggestions", label: "Suggestions", icon: "✏️" },
  { href: "/admin/users",       label: "Users",       icon: "👥" },
  { href: "/admin/analytics",   label: "Analytics",   icon: "📈" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

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
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{user?.email}</span>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-48 min-h-screen border-r p-4 flex-shrink-0 hidden md:block"
            style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
            <nav className="space-y-1">
              {NAV.map(({ href, label, icon }) => {
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
          <main className="flex-1 p-6 min-w-0">{children}</main>
        </div>
      </div>
    </AdminRoute>
  );
}
