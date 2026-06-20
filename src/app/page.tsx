import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import LandingIntro from "@/components/LandingIntro";
import PublicLayout from "@/components/shared/PublicLayout";

function SectionFallback() {
  return (
    <section className="py-24">
      <div className="section-shell">
        <div className="h-6 w-32 rounded-md bg-white/10" />
        <div className="mt-5 h-12 max-w-2xl rounded-md bg-white/10" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-48 rounded-lg border border-white/10 bg-white/[0.04]" />
          ))}
        </div>
      </div>
    </section>
  );
}

const AboutSection = dynamic(() => import("@/sections/about/AboutSection"), {
  loading: () => <SectionFallback />
});
const SkillsSection = dynamic(() => import("@/sections/skills/SkillsSection"), {
  loading: () => <SectionFallback />
});
const ExperienceSection = dynamic(() => import("@/sections/experience/ExperienceSection"), {
  loading: () => <SectionFallback />
});
const ProjectsSection = dynamic(() => import("@/sections/projects/ProjectsSection"), {
  loading: () => <SectionFallback />
});
const CertificatesSection = dynamic(() => import("@/sections/certificates/CertificatesSection"), {
  loading: () => <SectionFallback />
});
const ContactSection = dynamic(() => import("@/sections/contact/ContactSection"), {
  loading: () => <SectionFallback />
});

export default function Home() {
  return (
    <PublicLayout>
      <LandingIntro />
      <Hero />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <CertificatesSection />
      <ContactSection />
    </PublicLayout>
  );
}
