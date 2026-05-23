"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAdminUsers, updateUserRole, toggleUserActive, type AdminUser } from "@/lib/admin-api";
import { Pagination } from "@/components/ui/Pagination";
import type { PagedResult } from "@/lib/admin-api";

const ROLES = ["User", "Admin", "SuperAdmin"];

const ROLE_STYLES: Record<string, { bg: string; color: string }> = {
  User:       { bg: "color-mix(in srgb, #888780 12%, transparent)", color: "#5F5E5A" },
  Admin:      { bg: "color-mix(in srgb, #002868 12%, transparent)", color: "#002868" },
  SuperAdmin: { bg: "color-mix(in srgb, #BF0A30 12%, transparent)", color: "#BF0A30" },
};

interface ConfirmState {
  userId: string;
  displayName: string;
  isActive: boolean;
}

export default function AdminUsers() {
  const { accessToken, user: currentUser } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<PagedResult<AdminUser> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const isSuperAdmin = currentUser?.role === "SuperAdmin";

  useEffect(() => {
    if (currentUser && !isSuperAdmin) router.push("/admin");
  }, [currentUser, isSuperAdmin, router]);

  const load = useCallback(async () => {
    if (!accessToken || !isSuperAdmin) return;
    setLoading(true);
    try {
      const result = await getAdminUsers(accessToken, { search: search || undefined, page });
      setData(result);
    } finally {
      setLoading(false);
    }
  }, [accessToken, isSuperAdmin, search, page]);

  useEffect(() => { load(); }, [load]);

  async function handleRoleChange(userId: string, role: string) {
    if (!accessToken) return;
    setActionLoading(userId);
    try {
      await updateUserRole(accessToken, userId, role);
      await load();
    } catch (e) { alert((e as Error).message); }
    finally { setActionLoading(null); }
  }

  async function handleToggleActive() {
    if (!confirm || !accessToken) return;
    setActionLoading(confirm.userId);
    setConfirm(null);
    try {
      await toggleUserActive(accessToken, confirm.userId, !confirm.isActive);
      await load();
    } catch (e) { alert((e as Error).message); }
    finally { setActionLoading(null); }
  }

  if (!isSuperAdmin) return null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          Users
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {data?.totalCount ?? 0} registered users
        </p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="h-9 px-3 rounded-lg border text-sm outline-none"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)", color: "var(--text-primary)", minWidth: "260px" }}
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => <div key={i} className="h-14 rounded-xl skeleton" />)}
        </div>
      ) : data?.items.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed"
          style={{ borderColor: "var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No users found</p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
                  {["User", "Role", "Submissions", "Approved", "Joined", "Status", "Verified", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.items.map((u, i) => {
                  const roleStyle = ROLE_STYLES[u.role] ?? ROLE_STYLES.User;
                  const isCurrentUser = u.id === currentUser?.id;
                  return (
                    <tr key={u.id}
                      style={{ borderBottom: i < data.items.length - 1 ? "1px solid var(--border)" : "none", background: "var(--bg-primary)" }}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-xs" style={{ color: "var(--text-primary)" }}>{u.displayName}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{u.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        {isSuperAdmin && !isCurrentUser ? (
                          <select
                            value={u.role}
                            onChange={e => handleRoleChange(u.id, e.target.value)}
                            disabled={actionLoading === u.id}
                            className="h-7 px-2 rounded-lg border text-xs outline-none"
                            style={{ background: roleStyle.bg, borderColor: "transparent", color: roleStyle.color }}>
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ background: roleStyle.bg, color: roleStyle.color }}>{u.role}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-center" style={{ color: "var(--text-secondary)" }}>
                        {u.submissionCount}
                      </td>
                      <td className="px-4 py-3 text-xs text-center" style={{ color: "#3B6D11" }}>
                        {u.approvedCount}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                        {new Date(u.createdAt).toLocaleDateString("en-LR", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            background: u.isActive ? "color-mix(in srgb, #639922 12%, transparent)" : "color-mix(in srgb, #BF0A30 10%, transparent)",
                            color: u.isActive ? "#3B6D11" : "#BF0A30"
                          }}>
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            background: u.emailVerified ? "color-mix(in srgb, #639922 12%, transparent)" : "color-mix(in srgb, #BA7517 12%, transparent)",
                            color: u.emailVerified ? "#3B6D11" : "#BA7517"
                          }}>
                          {u.emailVerified ? "✓ Verified" : "⚠ Unverified"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {!isCurrentUser && (
                          <button
                            onClick={() => setConfirm({ userId: u.id, displayName: u.displayName, isActive: u.isActive })}
                            disabled={actionLoading === u.id}
                            className="text-xs px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
                            style={{
                              color: u.isActive ? "#BF0A30" : "#3B6D11",
                              border: `1px solid ${u.isActive ? "color-mix(in srgb, #BF0A30 30%, transparent)" : "color-mix(in srgb, #639922 30%, transparent)"}`,
                              background: "transparent"
                            }}>
                            {actionLoading === u.id ? "..." : u.isActive ? "Deactivate" : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={data?.totalPages ?? 1} onPage={setPage} />
        </>
      )}

      {/* Custom confirm modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={e => { if (e.target === e.currentTarget) setConfirm(null); }}>
          <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
            <h2 className="font-display text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              {confirm.isActive ? "Deactivate" : "Activate"} user
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Are you sure you want to {confirm.isActive ? "deactivate" : "activate"}{" "}
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>{confirm.displayName}</span>?
              {confirm.isActive && " They will no longer be able to log in."}
            </p>
            <div className="flex gap-3">
              <button onClick={handleToggleActive}
                className="flex-1 h-10 rounded-xl text-sm font-medium text-white"
                style={{ background: confirm.isActive ? "#BF0A30" : "#3B6D11" }}>
                Yes, {confirm.isActive ? "deactivate" : "activate"}
              </button>
              <button onClick={() => setConfirm(null)}
                className="flex-1 h-10 rounded-xl text-sm font-medium"
                style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}