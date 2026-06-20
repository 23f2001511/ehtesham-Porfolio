import type { Metadata } from "next";
import PublicLayout from "@/components/shared/PublicLayout";
import AboutSection from "@/sections/about/AboutSection";

export const metadata: Metadata = {
  title: "About",
  description: "About Ehtesham Aalam, a full-stack developer focused on modern web applications."
};

export default function AboutPage() {
  return (
    <PublicLayout>
      <AboutSection />
    </PublicLayout>
  );
}
