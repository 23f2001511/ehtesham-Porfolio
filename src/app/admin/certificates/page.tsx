import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import ResourceManager, { type FieldConfig } from "@/components/admin/ResourceManager";

export const metadata: Metadata = {
  title: "Manage Certificates",
  description: "Create, update, and delete portfolio certificates."
};

const fields: FieldConfig[] = [
  { name: "title", label: "Title", type: "text", placeholder: "Full Stack Web Development" },
  { name: "issuer", label: "Issuer", type: "text", placeholder: "IIT Madras" },
  { name: "issueDate", label: "Issue Date", type: "date" },
  { name: "credentialUrl", label: "Credential URL", type: "url", placeholder: "https://credential.example.com" },
  { name: "imageUrl", label: "Image URL", type: "upload", placeholder: "/certificates/certificate.png", uploadType: "certificate" },
  { name: "sortOrder", label: "Sort Order", type: "number" },
  { name: "featured", label: "Featured certificate", type: "checkbox" }
];

export default function AdminCertificatesPage() {
  return (
    <AdminShell>
      <ResourceManager
        title="Certificates"
        description="Manage certificates, issuers, images, and credential links."
        endpoint="/api/certificates"
        fields={fields}
        emptyTitle="No certificates yet"
        emptyDescription="Create a certificate to populate the public certificate section."
      />
    </AdminShell>
  );
}
