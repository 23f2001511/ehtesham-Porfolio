"use client";

import { useCallback, useState } from "react";
import Hero from "@/components/Hero";
import SunLoader from "@/components/SunLoader";
import HeroWelcome from "@/components/HeroWelcome";
import PublicLayout from "@/components/shared/PublicLayout";
import AboutSection from "@/sections/about/AboutSection";
import SkillsSection from "@/sections/skills/SkillsSection";
import ExperienceSection from "@/sections/experience/ExperienceSection";
import ProjectsSection from "@/sections/projects/ProjectsSection";
import CertificatesSection from "@/sections/certificates/CertificatesSection";
import ContactSection from "@/sections/contact/ContactSection";

export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false);

  const handleLoaderComplete = useCallback(() => {
    setLoaderDone(true);
  }, []);

  return (
    <PublicLayout>
      <SunLoader onComplete={handleLoaderComplete} />
      <HeroWelcome visible={loaderDone} />
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
