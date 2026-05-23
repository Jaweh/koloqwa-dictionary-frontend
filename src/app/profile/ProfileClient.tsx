"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { updateProfile, changePassword } from "@/lib/auth-api";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { FormField, Input, Button } from "@/components/ui/FormField";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:62971/api/v1";

export function ProfileClient() {
  const { user, accessToken, logout } = useAuth();
  const router = useRouter();

  // Profile form
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Delete account
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) { setProfileError("Display name is required."); return; }
    if (displayName.trim().length < 2) { setProfileError("Display name must be at least 2 characters."); return; }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setProfileError("Enter a valid email address."); return; }
    setProfileError(""); setProfileSuccess("");
    setProfileLoading(true);
    try {
      const updated = await updateProfile(accessToken!, { displayName: displayName.trim(), email: email.trim() });
      if (user) {
        const updatedUser = { ...user, displayName: updated.displayName, email: updated.email };
        localStorage.setItem("kq_user", JSON.stringify(updatedUser));
      }
      setProfileSuccess("Profile updated successfully.");
    } catch (err) {
      setProfileError((err as Error).message);
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword) { setPasswordError("Current password is required."); return; }
    if (!newPassword) { setPasswordError("New password is required."); return; }
    if (newPassword.length < 8) { setPasswordError("New password must be at least 8 characters."); return; }
    if (!/[A-Z]/.test(newPassword)) { setPasswordError("New password must contain an uppercase letter."); return; }
    if (!/[0-9]/.test(newPassword)) { setPasswordError("New password must contain a number."); return; }
    if (newPassword !== confirmPassword) { setPasswordError("Passwords do not match."); return; }
    setPasswordError(""); setPasswordSuccess("");
    setPasswordLoading(true);
    try {
      await changePassword(accessToken!, currentPassword, newPassword);
      setPasswordSuccess("Password changed successfully.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      setPasswordError((err as Error).message);
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? "Failed to delete account");
      logout();
      router.push("/");
    } catch (err) {
      setDeleteError((err as Error).message);
      setDeleteLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            <Link href="/dashboard" style={{ color: "var(--text-muted)" }} className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span style={{ color: "var(--text-primary)" }}>My profile</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
              style={{ background: "var(--accent)" }}>
              {user?.displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
                {user?.displayName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>{user?.email}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)" }}>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile info */}
        <div className="p-8 rounded-2xl border mb-6" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
          <h2 className="text-sm font-semibold mb-6" style={{ color: "var(--text-primary)" }}>Profile information</h2>
          {profileSuccess && (
            <div className="mb-6 p-4 rounded-xl text-sm"
              style={{ background: "color-mix(in srgb, #639922 10%, transparent)", color: "#3B6D11", border: "1px solid color-mix(in srgb, #639922 25%, transparent)" }}>
              {profileSuccess}
            </div>
          )}
          {profileError && (
            <div className="mb-6 p-4 rounded-xl text-sm"
              style={{ background: "color-mix(in srgb, #BF0A30 10%, transparent)", color: "#BF0A30", border: "1px solid color-mix(in srgb, #BF0A30 25%, transparent)" }}>
              {profileError}
            </div>
          )}
          <form onSubmit={handleProfileSave} className="space-y-5">
            <FormField label="Display name" required>
              <Input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your display name" />
            </FormField>
            <FormField label="Email address" required>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
            </FormField>
            <Button type="submit" loading={profileLoading}>
              {profileLoading ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </div>

        {/* Change password */}
        <div className="p-8 rounded-2xl border mb-6" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
          <h2 className="text-sm font-semibold mb-6" style={{ color: "var(--text-primary)" }}>Change password</h2>
          {passwordSuccess && (
            <div className="mb-6 p-4 rounded-xl text-sm"
              style={{ background: "color-mix(in srgb, #639922 10%, transparent)", color: "#3B6D11", border: "1px solid color-mix(in srgb, #639922 25%, transparent)" }}>
              {passwordSuccess}
            </div>
          )}
          {passwordError && (
            <div className="mb-6 p-4 rounded-xl text-sm"
              style={{ background: "color-mix(in srgb, #BF0A30 10%, transparent)", color: "#BF0A30", border: "1px solid color-mix(in srgb, #BF0A30 25%, transparent)" }}>
              {passwordError}
            </div>
          )}
          <form onSubmit={handlePasswordChange} className="space-y-5">
            <FormField label="Current password" required>
              <div className="relative">
                <Input
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: "var(--text-muted)" }}>
                  {showPasswords ? "Hide" : "Show"}
                </button>
              </div>
            </FormField>
            <FormField label="New password" required hint="At least 8 characters, one uppercase letter, one number">
              <Input type={showPasswords ? "text" : "password"} value={newPassword}
                onChange={e => setNewPassword(e.target.value)} placeholder="Enter your new password" autoComplete="new-password" />
            </FormField>
            <FormField label="Confirm new password" required>
              <Input type={showPasswords ? "text" : "password"} value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm your new password" autoComplete="new-password" />
            </FormField>
            <Button type="submit" loading={passwordLoading}>
              {passwordLoading ? "Changing password..." : "Change password"}
            </Button>
          </form>
        </div>

        {/* Danger zone — only for regular users */}
        {user?.role === "User" && (
          <div className="p-8 rounded-2xl border"
            style={{ borderColor: "color-mix(in srgb, #BF0A30 25%, transparent)", background: "color-mix(in srgb, #BF0A30 4%, transparent)" }}>
            <h2 className="text-sm font-semibold mb-2" style={{ color: "#BF0A30" }}>Danger zone</h2>
            <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
              Permanently delete your account and all your submitted data. This cannot be undone.
            </p>
            {deleteError && (
              <div className="mb-4 p-4 rounded-xl text-sm"
                style={{ background: "color-mix(in srgb, #BF0A30 10%, transparent)", color: "#BF0A30", border: "1px solid color-mix(in srgb, #BF0A30 25%, transparent)" }}>
                {deleteError}
              </div>
            )}
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)}
                className="h-10 px-5 rounded-xl text-sm font-medium"
                style={{ background: "color-mix(in srgb, #BF0A30 12%, transparent)", color: "#BF0A30", border: "1px solid color-mix(in srgb, #BF0A30 30%, transparent)" }}>
                Delete my account
              </button>
            ) : (
              <div className="p-4 rounded-xl border space-y-3"
                style={{ borderColor: "color-mix(in srgb, #BF0A30 30%, transparent)", background: "var(--bg-primary)" }}>
                <p className="text-sm font-medium" style={{ color: "#BF0A30" }}>
                  Are you sure? This will permanently delete your account and all your submissions.
                </p>
                <div className="flex gap-3">
                  <button onClick={handleDeleteAccount} disabled={deleteLoading}
                    className="h-10 px-5 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                    style={{ background: "#BF0A30" }}>
                    {deleteLoading ? "Deleting..." : "Yes, delete my account"}
                  </button>
                  <button onClick={() => setConfirmDelete(false)}
                    className="h-10 px-5 rounded-xl text-sm font-medium"
                    style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}