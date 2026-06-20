import type { Metadata } from "next";
import PublicLayout from "@/components/shared/PublicLayout";
import ExperienceSection from "@/sections/experience/ExperienceSection";

export const metadata: Metadata = {
  title: "Experience",
  description: "Experience and learning timeline for Ehtesham Aalam."
};

export default function ExperiencePage() {
  return (
    <PublicLayout>
      <ExperienceSection />
    </PublicLayout>
  );
}
