"use client";

import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";
import Footer from "@/components/Footer";

import HeroSection from "@/sections/hero/HeroSection";
import SkillsSection from "@/sections/skills/SkillsSection";
import EncryptionSection from "@/sections/encryption/EncryptionSection";
import ProjectsSection from "@/sections/projects/ProjectsSection";
import AboutSection from "@/sections/about/AboutSection";
import StatsSection from "@/sections/stats/StatsSection";
import GitHubSection from "@/sections/github/GitHubSection";
import LeetCodeSection from "@/sections/leetcode/LeetCodeSection";
import ExperienceSection from "@/sections/experience/ExperienceSection";
import EducationSection from "@/sections/education/EducationSection";
import CertificatesSection from "@/sections/certificates/CertificatesSection";
import ResumeSection from "@/sections/resume/ResumeSection";
import ContactSection from "@/sections/contact/ContactSection";

export default function Home() {
  return (
    <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
      <Navbar />
      <SideNav />
      <main id="content">
        <HeroSection />
        <SkillsSection />
        <EncryptionSection />
        <ProjectsSection />
        <AboutSection />
        <StatsSection />
        <GitHubSection />
        <LeetCodeSection />
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
