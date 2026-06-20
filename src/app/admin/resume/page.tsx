import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import ResumeManager from "@/components/admin/ResumeManager";

export const metadata: Metadata = {
  title: "Manage Resume",
  description: "Upload and manage the public resume PDF."
};

export default function AdminResumePage() {
  return (
    <AdminShell>
      <ResumeManager />
    </AdminShell>
  );
}
