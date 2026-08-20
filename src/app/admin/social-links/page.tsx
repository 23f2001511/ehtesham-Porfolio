import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import SocialLinksManager from "@/components/admin/SocialLinksManager";
import { requireAdminPage } from "@/lib/auth-page";

export const metadata: Metadata = {
  title: "Manage Social Links",
  description: "Manage public social links."
};

export default async function AdminSocialLinksPage() {
  await requireAdminPage();
  return (
    <AdminShell>
      <SocialLinksManager />
    </AdminShell>
  );
}
