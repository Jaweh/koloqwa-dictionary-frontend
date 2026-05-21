import type { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
  title: "My Dashboard",
  description: "View and manage your Koloqwa Dictionary contributions.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
