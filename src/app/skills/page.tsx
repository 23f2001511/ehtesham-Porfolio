import type { Metadata } from "next";
import PublicLayout from "@/components/shared/PublicLayout";
import SkillsSection from "@/sections/skills/SkillsSection";

export const metadata: Metadata = {
  title: "Skills",
  description: "Technical skills across Next.js, TypeScript, MongoDB, UI engineering, and APIs."
};

export default function SkillsPage() {
  return (
    <PublicLayout>
      <SkillsSection />
    </PublicLayout>
  );
}
