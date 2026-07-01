import Hero from "@/components/Hero";
import LandingIntro from "@/components/LandingIntro";
import PublicLayout from "@/components/shared/PublicLayout";
import AboutSection from "@/sections/about/AboutSection";
import SkillsSection from "@/sections/skills/SkillsSection";
import ExperienceSection from "@/sections/experience/ExperienceSection";
import ProjectsSection from "@/sections/projects/ProjectsSection";
import CertificatesSection from "@/sections/certificates/CertificatesSection";
import ContactSection from "@/sections/contact/ContactSection";

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
