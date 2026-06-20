import type { Metadata } from "next";
import PublicLayout from "@/components/shared/PublicLayout";
import CertificatesSection from "@/sections/certificates/CertificatesSection";

export const metadata: Metadata = {
  title: "Certificates",
  description: "Certificates, credentials, and learning milestones."
};

export default function CertificatesPage() {
  return (
    <PublicLayout>
      <CertificatesSection />
    </PublicLayout>
  );
}
