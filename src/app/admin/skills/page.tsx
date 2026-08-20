import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import ResourceManager, { type FieldConfig } from "@/components/admin/ResourceManager";
import { requireAdminPage } from "@/lib/auth-page";

export const metadata: Metadata = {
  title: "Manage Skills",
  description: "Create, update, and delete portfolio skills."
};

const fields: FieldConfig[] = [
  { name: "name", label: "Skill Name", type: "text", placeholder: "Next.js" },
  { name: "category", label: "Category", type: "text", placeholder: "Frontend" },
  { name: "level", label: "Level", type: "number" },
  { name: "icon", label: "Icon", type: "select", options: ["Atom", "Code2", "Database", "Layers", "MousePointer2", "Palette", "Server", "Sparkles", "Workflow"] },
  { name: "years", label: "Years", type: "number" },
  { name: "sortOrder", label: "Sort Order", type: "number" },
  { name: "featured", label: "Featured skill", type: "checkbox" }
];

export default async function AdminSkillsPage() {
  await requireAdminPage();
  return (
    <AdminShell>
      <ResourceManager
        title="Skills"
        description="Manage the technologies and strengths displayed on the public skills section."
        endpoint="/api/skills"
        fields={fields}
        emptyTitle="No skills yet"
        emptyDescription="Create a skill to populate the skills grid."
      />
    </AdminShell>
  );
}
