"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { heroStats, siteConfig } from "@/constants";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import TypingAnimation from "@/components/TypingAnimation";

const typingTexts = [
  `Hi, I'm ${siteConfig.name}`,
  "Full Stack Developer",
  "Web Developer & Engineer",
  "Next.js & TypeScript Expert",
];

export default function Hero() {
  const { profile } = usePublicProfile();

  return (
    <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden">
      <Image
        src="/images/portfolio-hero.png"
        alt="Dark software engineering workspace with code, dashboard panels, and data architecture visuals"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover object-center"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,7,13,0.98)_0%,rgba(5,7,13,0.9)_34%,rgba(5,7,13,0.42)_72%,rgba(5,7,13,0.7)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#05070d] to-transparent" />

      <div className="section-shell grid min-h-[calc(100vh-4rem)] items-center py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
        <div className="max-w-3xl hero-stagger">
          <div>
            <Badge tone="cyan" className="mb-5">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Available for full-stack work
            </Badge>
          </div>

          <h1 className="text-balance text-4xl font-black leading-[1.08] text-white sm:text-5xl lg:text-6xl min-h-[1.2em]">
            <TypingAnimation
              texts={typingTexts}
              typingSpeed={70}
              deletingSpeed={35}
              pauseDuration={2500}
            />
          </h1>

          <p className="mt-5 max-w-2xl text-xl font-semibold sm:text-2xl" style={{
            background: "linear-gradient(90deg, #22d3ee, #10b981)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            {siteConfig.role} building fast, elegant web products.
          </p>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            {siteConfig.description} I care about the full path from schema design to UI details,
            so the finished app feels sharp and dependable.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => document.querySelector("#projects")?.scrollIntoView()}>
              View Projects
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Link
              href={profile.resumeUrl || siteConfig.resumeUrl}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-white/5 px-6 text-sm font-semibold text-white transition hover:border-cyan-300/60 hover:bg-white/10"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Resume
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div key={stat.label} className="stat-card rounded-lg border border-white/12 bg-black/24 p-4 backdrop-blur-md">
                <p className="relative z-10 text-2xl font-black text-white">{stat.value}</p>
                <p className="relative z-10 mt-1 text-sm text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
