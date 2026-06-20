import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import DashboardOverview from "@/components/admin/DashboardOverview";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Portfolio admin dashboard."
};

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <DashboardOverview />
    </AdminShell>
  );
}
