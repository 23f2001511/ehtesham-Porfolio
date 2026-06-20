import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import SocialLinksManager from "@/components/admin/SocialLinksManager";

export const metadata: Metadata = {
  title: "Manage Social Links",
  description: "Manage public social links."
};

export default function AdminSocialLinksPage() {
  return (
    <AdminShell>
      <SocialLinksManager />
    </AdminShell>
  );
}
