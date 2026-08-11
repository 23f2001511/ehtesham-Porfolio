import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import ProfileManager from "@/components/admin/ProfileManager";

export const metadata: Metadata = {
  title: "Profile | Admin"
};

export default function AdminProfilePage() {
  return (
    <AdminShell>
      <div className="mx-auto w-full max-w-3xl space-y-4 p-6">
        <header>
          <h1 className="text-xl font-bold text-white">Profile</h1>
          <p className="text-sm text-muted-foreground">
            Identity, developer usernames, experience, and education shown across the portfolio.
          </p>
        </header>
        <ProfileManager />
      </div>
    </AdminShell>
  );
}
