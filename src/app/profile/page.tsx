import type { Metadata } from "next";
import { ProfileClient } from "./ProfileClient";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your Koloqwa account profile.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
