"use client";

import Link from "next/link";
import {
  Orbit,
  Rocket,
  Download,
  Mail,
  Github,
  Linkedin,
  Code2,
  Sparkles,
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { navItems, siteConfig } from "@/constants";
import { usePublicProfile } from "@/hooks/usePublicProfile";

export default function Footer() {
  const { profile } = usePublicProfile();
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    {
      label: "GitHub",
      href: `https://github.com/${siteConfig.githubUsername}`,
      Icon: Github
    },
    {
      label: "LinkedIn",
      href: siteConfig.linkedinUrl,
      Icon: Linkedin
    },
    {
      label: "LeetCode",
      href: `https://leetcode.com/u/${siteConfig.leetcodeUsername}/`,
      Icon: Code2
    },
    {
      label: "Email",
      href: `mailto:${siteConfig.email}`,
      Icon: Mail
    }
  ];

  const primaryNav = navItems.slice(0, 8);

  return (
    <footer className="relative z-10 overflow-hidden border-t border-[#7042f8]/30 bg-[#030014]/90 backdrop-blur-2xl">
      {/* ── Top Radiant Cosmic Flare ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[1px] w-full max-w-6xl bg-gradient-to-r from-transparent via-[#00f0ff]/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-32 w-3/4 max-w-4xl bg-[#7042f8]/12 blur-[100px]"
      />

      <div className="section-shell pt-16 pb-12">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1.1fr]">
          {/* ── Column 1: Identity & Live Availability ── */}
          <div className="flex flex-col items-start">
            <Link
              href="/#home"
              className="group inline-flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#7042f8]/60 bg-gradient-to-br from-[#120738] via-[#0b0424] to-[#040114] shadow-[0_0_20px_rgba(112,66,248,0.5)] group-hover:border-[#00f0ff] transition-colors">
                <Orbit className="h-5 w-5 text-[#00f0ff] group-hover:rotate-180 transition-transform duration-700" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-base font-bold tracking-tight text-white group-hover:text-[#00f0ff] transition-colors">
                  {siteConfig.name}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300">
                  Fullstack Space Engineer
                </span>
              </div>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-300">
              {profile.tagline ||
                "Data Science scholar at IIT Madras engineering high-throughput web platforms, scalable distributed systems, and motion-rich interactive experiences."}
            </p>

            {/* Live Availability Status Beacon */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-1 text-xs font-mono text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>Available for high-impact roles &amp; projects</span>
            </div>

            {/* Social Matrix */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-[#7042f8]/40 bg-[#07011d]/90 text-gray-300 transition-all duration-300 hover:-translate-y-1 hover:border-[#00f0ff] hover:text-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Column 2: Cosmic Navigation Matrix ── */}
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-purple-200 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#00f0ff]" />
              <span>Cosmic Navigation</span>
            </h3>
            <ul className="mt-5 grid grid-cols-2 gap-y-2.5 gap-x-4">
              {primaryNav.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-300 transition-colors duration-200 hover:text-[#00f0ff]"
                  >
                    <ChevronRight className="h-3 w-3 text-purple-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#00f0ff]" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Direct Connect & Resume ── */}
          <div className="flex flex-col">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-purple-200 flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#00f0ff]" />
              <span>Direct Transmission</span>
            </h3>

            <div className="mt-5 space-y-2 text-xs sm:text-sm">
              <a
                href={`mailto:${siteConfig.email}`}
                className="group flex items-center justify-between rounded-xl border border-[#7042f8]/30 bg-[#07011d]/70 px-3.5 py-2.5 text-gray-200 transition-all duration-200 hover:border-[#00f0ff] hover:text-[#00f0ff]"
              >
                <span className="truncate">{siteConfig.email}</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
              </a>

              <a
                href={`mailto:${siteConfig.collegeEmail}`}
                className="group flex items-center justify-between rounded-xl border border-[#7042f8]/30 bg-[#07011d]/70 px-3.5 py-2.5 text-gray-300 transition-all duration-200 hover:border-[#7042f8] hover:text-white"
              >
                <span className="truncate">{siteConfig.collegeEmail}</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
              </a>
            </div>

            <div className="mt-5">
              <a
                href={siteConfig.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="button-primary w-full justify-center text-xs sm:text-sm gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Download Resume / CV</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar: Copyright, Tech Badges, and Launch to Orbit ── */}
        <div className="mt-14 pt-6 border-t border-[#7042f8]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-400">
          <p className="text-center sm:text-left">
            © {year} <span className="text-white font-semibold">{siteConfig.name}</span>. Engineered for deep space exploration.
          </p>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-purple-300/80">
            <span>Next.js 15</span>
            <span>•</span>
            <span>Three.js 3D</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="group inline-flex items-center gap-2 rounded-xl border border-[#7042f8]/40 bg-[#07011d]/90 px-3.5 py-1.5 text-xs text-purple-200 transition-all duration-300 hover:border-[#00f0ff] hover:text-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
          >
            <span>Launch to Orbit</span>
            <Rocket className="h-3.5 w-3.5 text-[#00f0ff] transition-transform duration-300 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </footer>
  );
}
