import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const HeroSection = dynamic(() => import("@/sections/hero/HeroSection"));
const AboutSection = dynamic(() => import("@/sections/about/AboutSection"));
const StatsSection = dynamic(() => import("@/sections/stats/StatsSection"));
const ProjectsSection = dynamic(() => import("@/sections/projects/ProjectsSection"));
const GitHubSection = dynamic(() => import("@/sections/github/GitHubSection"), {
  loading: () => <SectionSkeleton label="GitHub" />
});
const LeetCodeSection = dynamic(() => import("@/sections/leetcode/LeetCodeSection"), {
  loading: () => <SectionSkeleton label="LeetCode" />
});
const SkillsSection = dynamic(() => import("@/sections/skills/SkillsSection"));
const ExperienceSection = dynamic(() => import("@/sections/experience/ExperienceSection"));
const EducationSection = dynamic(() => import("@/sections/education/EducationSection"));
const CertificatesSection = dynamic(() => import("@/sections/certificates/CertificatesSection"));
const ResumeSection = dynamic(() => import("@/sections/resume/ResumeSection"));
const ContactSection = dynamic(() => import("@/sections/contact/ContactSection"));

export const metadata: Metadata = {
  title: "Ehtesham Aalam | Full-Stack Developer",
  description:
    "Modern developer portfolio — projects, skills, experience, and live GitHub & LeetCode analytics."
};

function SectionSkeleton({ label }: { label: string }) {
  return (
    <section className="section-shell section-pad" aria-busy="true" aria-label={`Loading ${label}`}>
      <div className="glass h-7 w-48 animate-pulse" />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="glass h-40 animate-pulse" />
        <div className="glass h-40 animate-pulse" />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <Navbar />
      <main id="content">
        <HeroSection />
        <AboutSection />
        <StatsSection />
        <ProjectsSection />
        <GitHubSection />
        <LeetCodeSection />
        <SkillsSection />
        <ExperienceSection />
        <EducationSection />
        <CertificatesSection />
        <ResumeSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

