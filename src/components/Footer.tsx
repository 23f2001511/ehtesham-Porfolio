"use client";

import Link from "next/link";
import { Code2, Github, Linkedin, Mail, Globe, Twitter } from "lucide-react";
import { navItems, siteConfig } from "@/constants";
import { usePublicProfile } from "@/hooks/usePublicProfile";

const iconMap = {
  Github,
  Linkedin,
  Mail,
  Twitter,
  Globe,
  Code: Code2
};

export default function Footer() {
  const { profile } = usePublicProfile();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl">
      <div className="section-shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/#home" className="inline-flex items-center gap-2.5">
            <span className="glass grid h-9 w-9 place-items-center text-[13px] font-bold">
              <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">EA</span>
            </span>
            <span className="text-base font-semibold text-foreground">{siteConfig.name}</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            {profile.tagline ||
              "Full-stack developer building modern web applications with a focus on clean engineering and honest data."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {profile.socials.map((link) => {
              const Icon = iconMap[link.icon] ?? Globe;
              return (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={link.label}
                  className="btn-spring grid h-10 w-10 place-items-center rounded-md border border-[var(--glass-border)] bg-[var(--glass-bg)] text-muted-foreground backdrop-blur-md hover:-translate-y-px hover:border-primary/50 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </div>

        <nav aria-label="Footer sections">
          <h3 className="text-sm font-semibold text-foreground">Navigate</h3>
          <ul className="mt-4 space-y-2.5">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Get in touch</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={`mailto:${siteConfig.email}`} className="text-muted-foreground transition-colors hover:text-foreground">
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.collegeEmail}`} className="text-muted-foreground transition-colors hover:text-foreground">
                {siteConfig.collegeEmail}
              </a>
            </li>
          </ul>
          <a
            href={siteConfig.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-spring mt-5 inline-flex h-9 items-center rounded-md border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 text-sm font-medium text-foreground backdrop-blur-md hover:border-primary/50"
          >
            Download resume
          </a>
        </div>
      </div>

      <div className="border-t border-border py-5">
        <p className="section-shell text-center text-xs text-muted-foreground sm:text-left">
          © {year} {siteConfig.name}. Built with Next.js, TypeScript, and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
