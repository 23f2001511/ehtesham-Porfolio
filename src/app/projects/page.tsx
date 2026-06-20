import type { Metadata } from "next";
import PublicLayout from "@/components/shared/PublicLayout";
import ProjectsSection from "@/sections/projects/ProjectsSection";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected full-stack projects by Ehtesham Aalam."
};

export default function ProjectsPage() {
  return (
    <PublicLayout>
      <ProjectsSection />
    </PublicLayout>
  );
}
