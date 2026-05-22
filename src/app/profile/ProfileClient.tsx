"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { updateProfile, changePassword } from "@/lib/auth-api";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { FormField, Input, Button } from "@/components/ui/FormField";

export function ProfileClient() {
  const { user, accessToken, login, accessToken: token } = useAuth();

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

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) { setProfileError("Display name is required."); return; }
    if (displayName.trim().length < 2) { setProfileError("Display name must be at least 2 characters."); return; }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { setProfileError("Enter a valid email address."); return; }

    setProfileError(""); setProfileSuccess("");
    setProfileLoading(true);
    try {
      const updated = await updateProfile(accessToken!, {
        displayName: displayName.trim(),
        email: email.trim(),
      });
      // Update local auth state with new display name
      if (user) {
        const updatedUser = { ...user, displayName: updated.displayName, email: updated.email };
        // Patch localStorage directly since we don't have a full token refresh
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
              <Input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Your display name"
              />
            </FormField>

            <FormField label="Email address" required>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </FormField>

            <Button type="submit" loading={profileLoading}>
              {profileLoading ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </div>

        {/* Change password */}
        <div className="p-8 rounded-2xl border" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
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
              <Input
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                autoComplete="new-password"
              />
            </FormField>

            <FormField label="Confirm new password" required>
              <Input
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                autoComplete="new-password"
              />
            </FormField>

            <Button type="submit" loading={passwordLoading}>
              {passwordLoading ? "Changing password..." : "Change password"}
            </Button>
          </form>
        </div>

      </div>
    </ProtectedRoute>
  );
}
