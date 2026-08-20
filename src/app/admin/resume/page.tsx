import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import ResumeManager from "@/components/admin/ResumeManager";
import { requireAdminPage } from "@/lib/auth-page";

export const metadata: Metadata = {
  title: "Manage Resume",
  description: "Upload and manage the public resume PDF."
};

export default async function AdminResumePage() {
  await requireAdminPage();
  return (
    <AdminShell>
      <ResumeManager />
    </AdminShell>
  );
}
