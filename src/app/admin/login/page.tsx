import type { Metadata } from "next";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Admin login for portfolio content management."
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
