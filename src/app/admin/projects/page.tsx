import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import ResourceManager, { type FieldConfig } from "@/components/admin/ResourceManager";

export const metadata: Metadata = {
  title: "Manage Projects",
  description: "Create, update, and delete portfolio projects."
};

const fields: FieldConfig[] = [
  { name: "title", label: "Title", type: "text", placeholder: "Portfolio Admin System" },
  { name: "slug", label: "Slug", type: "text", placeholder: "portfolio-admin-system" },
  { name: "summary", label: "Summary", type: "textarea", placeholder: "A short project summary" },
  { name: "description", label: "Description", type: "textarea", placeholder: "What you built and why it matters" },
  { name: "imageUrl", label: "Image URL", type: "upload", placeholder: "/projects/project.png", uploadType: "project" },
  { name: "liveUrl", label: "Live URL", type: "url", placeholder: "https://example.com" },
  { name: "repoUrl", label: "Repository URL", type: "url", placeholder: "https://github.com/username/repo" },
  { name: "tags", label: "Tags", type: "tags", placeholder: "Next.js, TypeScript, MongoDB" },
  { name: "status", label: "Status", type: "select", options: ["Planning", "In Progress", "Live", "Archived"] },
  { name: "sortOrder", label: "Sort Order", type: "number" },
  { name: "featured", label: "Featured project", type: "checkbox" }
];

export default function AdminProjectsPage() {
  return (
    <AdminShell>
      <ResourceManager
        title="Projects"
        description="Create case-study quality project entries with tags, URLs, images, and display order."
        endpoint="/api/projects"
        fields={fields}
        emptyTitle="No projects yet"
        emptyDescription="Create a project to start building the public portfolio grid."
      />
    </AdminShell>
  );
}
