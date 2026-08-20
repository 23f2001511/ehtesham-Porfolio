import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import DashboardOverview from "@/components/admin/DashboardOverview";
import { requireAdminPage } from "@/lib/auth-page";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Portfolio admin dashboard."
};

export default async function AdminDashboardPage() {
  await requireAdminPage();

  return (
    <AdminShell>
      <DashboardOverview />
    </AdminShell>
  );
}
